import { create } from "zustand";
import type {
  AssessmentAnalysis,
  PipelineStepId,
  QuestionAnswer,
  StepState,
  Student,
} from "@/types/assessment";

export const PIPELINE_STEPS: { id: PipelineStepId; label: string }[] = [
  { id: "uploaded", label: "Assessment uploaded" },
  { id: "reading", label: "Reading assessment" },
  { id: "tables", label: "Analyzing tables" },
  { id: "questions", label: "Detecting questions" },
  { id: "marks", label: "Analyzing marks" },
  { id: "rubric", label: "Analyzing rubric" },
  { id: "classify", label: "Classifying questions" },
  { id: "plan", label: "Planning answers" },
  { id: "answers", label: "Generating answers" },
  { id: "diagrams", label: "Generating diagrams" },
  { id: "code", label: "Generating code" },
  { id: "validate", label: "Validating answers" },
  { id: "answerPdf", label: "Creating answer PDF" },
  { id: "merge", label: "Combining PDFs" },
  { id: "ready", label: "Final PDF ready" },
];

type State = {
  student: Student;
  fileName: string;
  fileSize: number;
  pageCount: number;
  originalPdf: Uint8Array | null;
  extractedText: string;
  analysis: AssessmentAnalysis | null;
  answers: QuestionAnswer[];
  steps: Record<string, StepState>;
  progressNote: string;
  error: string | null;
  finalPdf: Uint8Array | null;
  setStudent: (student: Student) => void;
  setFile: (file: { name: string; size: number; bytes: Uint8Array }) => void;
  clearFile: () => void;
  setPageCount: (n: number) => void;
  setExtractedText: (text: string) => void;
  setAnalysis: (analysis: AssessmentAnalysis) => void;
  setAnswers: (answers: QuestionAnswer[]) => void;
  updateAnswer: (index: number, answer: QuestionAnswer) => void;
  setStep: (id: PipelineStepId, state: StepState) => void;
  setProgressNote: (note: string) => void;
  setError: (error: string | null) => void;
  setFinalPdf: (bytes: Uint8Array | null) => void;
  resetPipeline: () => void;
};

const emptySteps = () =>
  Object.fromEntries(PIPELINE_STEPS.map((s) => [s.id, "pending" as StepState]));

export const useAssessmentStore = create<State>((set) => ({
  student: { name: "", registrationNumber: "" },
  fileName: "",
  fileSize: 0,
  pageCount: 0,
  originalPdf: null,
  extractedText: "",
  analysis: null,
  answers: [],
  steps: emptySteps(),
  progressNote: "",
  error: null,
  finalPdf: null,
  setStudent: (student) => set({ student }),
  setFile: ({ name, size, bytes }) =>
    set({ fileName: name, fileSize: size, originalPdf: bytes, pageCount: 0 }),
  clearFile: () => set({ fileName: "", fileSize: 0, originalPdf: null, pageCount: 0 }),
  setPageCount: (pageCount) => set({ pageCount }),
  setExtractedText: (extractedText) => set({ extractedText }),
  setAnalysis: (analysis) => set({ analysis }),
  setAnswers: (answers) => set({ answers }),
  updateAnswer: (index, answer) =>
    set((s) => ({ answers: s.answers.map((a, i) => (i === index ? answer : a)) })),
  setStep: (id, state) => set((s) => ({ steps: { ...s.steps, [id]: state } })),
  setProgressNote: (progressNote) => set({ progressNote }),
  setError: (error) => set({ error }),
  setFinalPdf: (finalPdf) => set({ finalPdf }),
  resetPipeline: () =>
    set({
      analysis: null,
      answers: [],
      steps: emptySteps(),
      progressNote: "",
      error: null,
      finalPdf: null,
      extractedText: "",
    }),
}));

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
