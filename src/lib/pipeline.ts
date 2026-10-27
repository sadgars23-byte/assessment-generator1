import { analyzeAssessment, generateAnswer, validateAnswer } from "@/lib/assessment.functions";
import { extractPdfText, getPdfPageCount } from "@/lib/pdf/extract";
import { buildAnswerPdf } from "@/lib/pdf/answer-pdf";
import { mergeAssessmentAndAnswers, sanitizeFilename } from "@/lib/pdf/merge";
import { useAssessmentStore } from "@/lib/store";
import type { AssessmentQuestion, QuestionAnswer } from "@/types/assessment";

function friendly(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : String(error);
  if (/missing AI_API_KEY|not configured/i.test(message)) {
    return "AI is not configured. Please add AI_API_KEY to your .env file and restart the server.";
  }
  if (/credits/i.test(message)) return message;
  if (/rate limited/i.test(message)) return message;
  if (/API key|unauthorized|invalid api key|401/i.test(message)) {
    return "Invalid AI API Key. Please verify AI_API_KEY in your .env file.";
  }
  return message || fallback;
}

export async function runAnalysis(): Promise<boolean> {
  const s = useAssessmentStore.getState();
  if (!s.originalPdf) {
    s.setError("Please upload a valid PDF assessment.");
    return false;
  }
  s.resetPipeline();
  const store = useAssessmentStore.getState();
  store.setStep("uploaded", "done");
  store.setStep("reading", "active");

  let text = "";
  try {
    const pages = await extractPdfText(s.originalPdf);
    text = pages.text;
    store.setPageCount(pages.pageCount);
    store.setExtractedText(text);
    if (text.replace(/---\s*Page\s*\d+\s*---/g, "").trim().length < 40) {
      throw new Error("empty");
    }
  } catch {
    store.setStep("reading", "error");
    store.setError("We couldn't read this assessment. Please upload a clearer PDF.");
    return false;
  }
  store.setStep("reading", "done");

  for (const id of ["tables", "questions", "marks", "rubric"] as const) {
    store.setStep(id, "active");
  }
  store.setProgressNote("Understanding the assessment structure...");

  try {
    const analysis = await analyzeAssessment({ data: { text } });
    store.setAnalysis(analysis);
    for (const id of ["tables", "questions", "marks", "rubric", "classify", "plan"] as const) {
      store.setStep(id, "done");
    }
    store.setProgressNote("");
    return true;
  } catch (error) {
    for (const id of ["tables", "questions", "marks", "rubric"] as const) {
      store.setStep(id, "error");
    }
    store.setError(friendly(error, "Assessment analysis failed. Please try again."));
    return false;
  }
}

async function answerOne(question: AssessmentQuestion): Promise<QuestionAnswer> {
  const { analysis } = useAssessmentStore.getState();
  if (!analysis) throw new Error("No analysis");

  let answer = await generateAnswer({ data: { analysis, question } });
  let validation = { passed: true, score: 0, issues: [] as string[], suggestions: [] as string[] };
  try {
    validation = await validateAnswer({ data: { analysis, question, answer } });
    if (!validation.passed && validation.issues.length) {
      answer = await generateAnswer({ data: { analysis, question, feedback: validation.issues } });
      validation = await validateAnswer({ data: { analysis, question, answer } });
    }
  } catch {
    // validation is a quality gate, never a reason to lose a generated answer
  }
  return { question, answer, validation };
}

function placeholder(question: AssessmentQuestion, reason: string): QuestionAnswer {
  return {
    question,
    answer: {
      answer_markdown: `_This answer could not be generated automatically (${reason}). Use “Regenerate” on this question to try again._`,
      table: null,
      diagram: null,
      code: null,
    },
    validation: { passed: false, score: 0, issues: [reason], suggestions: [] },
  };
}

const CONCURRENCY = 3;

export async function runGeneration(): Promise<boolean> {
  const store = useAssessmentStore.getState();
  const analysis = store.analysis;
  if (!analysis) return false;

  store.setError(null);
  store.setStep("answers", "active");
  const needsDiagram = analysis.questions.some((q) => q.requires_diagram || q.requires_concept_map);
  const needsCode = analysis.questions.some((q) => q.requires_code);
  store.setStep("diagrams", needsDiagram ? "active" : "done");
  store.setStep("code", needsCode ? "active" : "done");

  const questions = analysis.questions;
  const results: (QuestionAnswer | undefined)[] = new Array(questions.length);
  const failed: string[] = [];
  let completed = 0;
  let fatal: unknown = null;

  const publish = () => {
    useAssessmentStore
      .getState()
      .setAnswers(results.filter((r): r is QuestionAnswer => Boolean(r)));
  };

  let next = 0;
  async function worker() {
    while (true) {
      const i = next++;
      if (i >= questions.length || fatal) return;
      const question = questions[i]!;
      try {
        results[i] = await answerOne(question);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (/credits/i.test(message)) {
          fatal = error;
          return;
        }
        // one isolated question must not sink the whole run
        try {
          results[i] = await answerOne(question);
        } catch {
          results[i] = placeholder(question, "the AI could not complete it in time");
          failed.push(question.question_number);
        }
      }
      completed++;
      useAssessmentStore
        .getState()
        .setProgressNote(`Answered ${completed} of ${questions.length} questions`);
      publish();
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, questions.length || 1) }, () => worker()),
  );

  if (fatal) {
    store.setStep("answers", "error");
    store.setError(friendly(fatal, "Answer generation failed. Please try again."));
    return false;
  }

  publish();
  for (const id of ["answers", "diagrams", "code", "validate"] as const) {
    store.setStep(id, "done");
  }
  store.setProgressNote("Building the final document...");

  const ok = await buildFinalPdf();
  store.setProgressNote("");
  if (ok && failed.length) {
    useAssessmentStore
      .getState()
      .setError(
        `Questions ${failed.join(", ")} couldn't be generated. Open Preview and regenerate them individually.`,
      );
  }
  return ok;
}


export async function buildFinalPdf(): Promise<boolean> {
  const store = useAssessmentStore.getState();
  const { analysis, answers, student, originalPdf } = store;
  if (!analysis || !originalPdf) return false;

  store.setStep("answerPdf", "active");
  try {
    const answerPdf = await buildAnswerPdf(student, analysis, answers);
    store.setStep("answerPdf", "done");
    store.setStep("merge", "active");
    const finalPdf = await mergeAssessmentAndAnswers(originalPdf, answerPdf);
    store.setStep("merge", "done");
    store.setFinalPdf(finalPdf);
    store.setStep("ready", "done");
    return true;
  } catch {
    store.setStep("answerPdf", "error");
    store.setStep("merge", "error");
    store.setError("Final PDF generation failed. Please try again.");
    return false;
  }
}

export async function regenerateQuestion(index: number) {
  const store = useAssessmentStore.getState();
  const existing = store.answers[index];
  if (!existing) return;
  const updated = await answerOne(existing.question);
  useAssessmentStore.getState().updateAnswer(index, updated);
  useAssessmentStore.getState().setFinalPdf(null);
}

export function finalFilename() {
  const { student } = useAssessmentStore.getState();
  return `${sanitizeFilename(student.name)}_${sanitizeFilename(student.registrationNumber)}_Assessment.pdf`;
}

export function finalDocxFilename() {
  return finalFilename().replace(/\.pdf$/i, ".docx");
}

export async function readPdfPageCount(bytes: Uint8Array) {
  try {
    return await getPdfPageCount(bytes);
  } catch {
    return 0;
  }
}
