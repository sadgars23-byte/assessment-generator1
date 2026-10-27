import { i as validationSchema, n as answerSchema, t as analysisSchema } from "./assessment-CvJPISfP.js";
import { streamText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
//#region src/lib/ai-gateway.server.ts
var AI_MODEL = process.env["AI_MODEL"] || "gpt-4o-mini";
function createAiProvider(apiKey) {
	const baseURL = process.env["AI_BASE_URL"] || "https://api.openai.com/v1";
	return createOpenAICompatible({
		name: "custom-ai-provider",
		baseURL,
		headers: { Authorization: `Bearer ${apiKey}` }
	});
}
//#endregion
//#region src/lib/assessment.server.ts
var AiError = class extends Error {
	status;
	constructor(message, status = 500) {
		super(message);
		this.status = status;
	}
};
function getModel() {
	const key = process.env["AI_API_KEY"];
	if (!key || key === "your_gemini_api_key_here" || key === "your_openai_api_key_here") throw new AiError("AI is not configured. Please paste your valid API key into the .env file and restart the dev server.", 401);
	const modelName = process.env["AI_MODEL"] || AI_MODEL || "gemini-3.5-flash-lite";
	return createAiProvider(key)(modelName);
}
function extractJson(raw) {
	let text = raw.trim();
	const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
	if (fence?.[1]) text = fence[1].trim();
	const start = text.search(/[[{]/);
	if (start > 0) text = text.slice(start);
	const lastBrace = Math.max(text.lastIndexOf("}"), text.lastIndexOf("]"));
	if (lastBrace !== -1) text = text.slice(0, lastBrace + 1);
	return JSON.parse(text);
}
var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function completeText(system, prompt) {
	let lastError = null;
	for (let attempt = 0; attempt < 4; attempt++) try {
		const model = getModel();
		const text = await streamText({
			model,
			system,
			prompt,
			temperature: .3
		}).text;
		if (!text.trim()) throw new AiError("Empty AI response", 502);
		return text;
	} catch (error) {
		console.error("[completeText attempt", attempt + 1, "failed]:", error);
		const rootError = error?.cause || error;
		const status = error?.statusCode ?? error?.status ?? rootError?.status ?? rootError?.statusCode ?? 500;
		let message = rootError?.message || error?.message || "AI request failed";
		if (/API key not valid|API_KEY_INVALID|invalid api key|unauthorized/i.test(message) || status === 401 || status === 403) throw new AiError("Invalid AI API key. Please check your AI_API_KEY in .env and restart the server.", 401);
		if (/No output generated/i.test(message) && error?.cause) message = `AI generation failed: ${error.cause.message || message}`;
		if (status === 402 || /quota|credit/i.test(message)) throw new AiError("AI credits/quota exhausted. Please check your AI provider plan.", 402);
		if (status === 401 || status === 403 || status === 400) throw new AiError(message, status);
		lastError = status === 429 || /rate limit/i.test(message) ? new AiError("AI is rate limited. Please retry in a moment.", 429) : new AiError(message, status);
		await sleep(Math.min(2e4, 1500 * 2 ** attempt) + Math.random() * 750);
	}
	throw lastError ?? new AiError("AI request failed", 500);
}
async function completeJson(schema, system, prompt) {
	const jsonSystem = `${system}\n\nReturn ONLY valid minified JSON. No prose, no markdown fences.`;
	let lastError = "";
	for (let attempt = 0; attempt < 3; attempt++) {
		const text = await completeText(jsonSystem, attempt === 0 ? prompt : `${prompt}\n\nYour previous output was invalid: ${lastError}\nReturn strictly valid JSON matching the requested shape.`);
		try {
			return schema.parse(extractJson(text));
		} catch (error) {
			lastError = error instanceof Error ? error.message.slice(0, 500) : "parse error";
		}
	}
	throw new AiError("The AI returned an unreadable result. Please try again.", 502);
}
var ANALYSIS_SYSTEM = `You are an expert academic assessment analyst.
You are given the FULL extracted text (all pages, including table content) of a student assessment paper.
The uploaded assessment is the only source of truth: never invent questions, marks, sections or rubrics.
Read tables carefully — they often carry question distribution, marks, CO mapping, Bloom/Dave taxonomy levels and rubric criteria.
Detect the actual structure, whatever the format (single part, Part A/B/C, case study, programming test, internal choices).
For each question decide required artifacts by reading the wording and command verb, and set an answer_depth label
("direct", "short", "structured", "moderate", "detailed", "comprehensive", "extensive") derived from the marks,
command verb, taxonomy level and rubric — never from a fixed formula.`;
var ANALYSIS_SHAPE = `Shape:
{"institution":"","assessment_type":"","course_name":"","course_code":"","course_outcomes":[""],"taxonomy":"",
"total_questions":0,"total_marks":0,
"sections":[{"name":"","instructions":"","marks":0,"question_count":0}],
"rubric":[{"criterion":"","description":"","marks":0}],
"instructions":[""],
"tables":[{"title":"","headers":[""],"rows":[[""]],"purpose":""}],
"questions":[{"question_number":"1","question_text":"","section":"","marks":0,
"question_type":["Explanation"],"command_verb":"","taxonomy_level":"","course_outcome":"",
"requires_diagram":false,"requires_concept_map":false,"requires_code":false,"requires_formula":false,
"requires_table":false,"programming_language":"","internal_choice_group":"","answer_depth":""}]}
Use "" or [] for anything not present in the document. Marks must be numbers.`;
function analyzeAssessmentText(text) {
	return completeJson(analysisSchema, ANALYSIS_SYSTEM, `${ANALYSIS_SHAPE}\n\n=== ASSESSMENT DOCUMENT (full text) ===\n${text.slice(0, 12e4)}`);
}
function contextBlock(analysis, question) {
	const rubric = analysis.rubric.map((r) => `- ${r.criterion}: ${r.description}${r.marks ? ` (${r.marks} marks)` : ""}`).join("\n");
	return `Course: ${analysis.course_name} (${analysis.course_code})
Assessment: ${analysis.assessment_type} | Institution: ${analysis.institution}
Total marks: ${analysis.total_marks} across ${analysis.total_questions} questions
Assessment instructions: ${analysis.instructions.join(" | ") || "none stated"}
Rubric:\n${rubric || "none stated"}

QUESTION ${question.question_number} (section: ${question.section || "n/a"})
Text: ${question.question_text}
Marks: ${question.marks}
Command verb: ${question.command_verb}
Question types: ${question.question_type.join(", ")}
Taxonomy level: ${question.taxonomy_level || analysis.taxonomy}
Course outcome: ${question.course_outcome || analysis.course_outcomes.join(", ")}
Planned answer depth: ${question.answer_depth}
Required artifacts: diagram=${question.requires_diagram} concept_map=${question.requires_concept_map} code=${question.requires_code} formula=${question.requires_formula} table=${question.requires_table}
Programming language (if stated): ${question.programming_language || "not specified"}`;
}
var ANSWER_SYSTEM = `You are a subject-matter expert writing an exam answer for a university student.
Write the answer that this exact question deserves — depth is driven by the marks, the command verb, the taxonomy level and the rubric,
never by a fixed word-per-mark rule. A 1-2 mark question gets a crisp direct answer with no headings and no conclusion.
A 10-15 mark question gets a structured, analytical answer with headings, and a conclusion only when it adds value.

MATHEMATICAL / NUMERICAL QUESTIONS (matrices, vectors, probability, statistics, linear algebra, calculus,
any question that contains numbers or symbols to operate on):
Produce a WORKED SOLUTION, exactly like a solved textbook example — almost no prose.
Hard rules:
- Do NOT explain the method, define the concept, or write paragraphs. Sentences are banned except one optional
  final interpretation line if the question explicitly asks "interpret"/"comment".
- Every line is either a short bold label ("**Given:**", "**Inner product:**", "**Magnitude:**", "**Angle:**",
  "**Determinant:**", "**Row operations:**", "**Final:**") or a mathematical line.
- Each mathematical line stands alone on its own line and must be fully evaluated:
  u · v = (1)(2) + (2)(1) + (2)(2) = 2 + 2 + 4 = 8
  |u| = sqrt(1^2 + 2^2 + 2^2) = sqrt(9) = 3
  cos θ = (u · v) / (|u||v|) = 8 / (3 × 3) = 8/9
  θ = cos⁻¹(8/9) = 28.96°
- Never leave an expression unevaluated and never write "we can compute", "one would calculate",
  "this represents", "the formula is used to".
- Put every matrix, vector, system of equations and multi-line derivation inside a fenced block so alignment is kept:
\`\`\`
A = [ 1  2 ]
    [ 2  4 ]

R2 -> R2 - 2R1:
    [ 1  2 ]
    [ 0  0 ]
\`\`\`
- End with "**Final:**" followed by the explicit result(s) in bold, with units/degrees.
- Use the table field only for genuine tabular data (e.g. iteration/probability tables), not for the derivation.
- Verify every arithmetic value before answering; results must be numerically correct and consistent.
- Do not use "## " headings inside a purely numerical answer; the bold labels above replace them.


Use markdown: "## " headings, "- " bullets, **bold** for key terms. No markdown tables (use the table field).
Only produce a diagram when the question genuinely needs one; make its nodes and edges specific to this question.
Only produce code when the question asks for a program/algorithm implementation; include an algorithm, working code,
sample input/output and a short explanation. Never invent requirements the question does not state.`;
var ANSWER_SHAPE = `Shape:
{"answer_markdown":"","table":null|{"title":"","headers":[""],"rows":[[""]],"purpose":""},
"diagram":null|{"title":"","kind":"flowchart|architecture|concept map|data flow|network","nodes":[{"id":"n1","label":"","layer":0}],"edges":[{"from":"n1","to":"n2","label":""}]},
"code":null|{"language":"","algorithm":[""],"source":"","sample_input":"","sample_output":"","explanation":""}}
Diagram rules: 3-12 nodes, short labels (max 34 chars), "layer" is the top-to-bottom level (0,1,2,...), every edge references existing node ids.`;
function generateAnswerFor(analysis, question, feedback) {
	const fix = feedback?.length ? `\n\nA previous attempt failed validation. Fix these issues:\n- ${feedback.join("\n- ")}` : "";
	return completeJson(answerSchema, ANSWER_SYSTEM, `${ANSWER_SHAPE}\n\n${contextBlock(analysis, question)}${fix}`);
}
var VALIDATION_SYSTEM = `You are a strict examiner validating a generated exam answer.
Check: it answers the exact question asked; it is technically accurate for the course; it covers every component of the question;
its depth suits the marks (not padded, not thin); it matches the taxonomy level; it covers rubric criteria;
a required diagram is present and relevant; required code is present, plausible and explained.
For any numerical/mathematical question you MUST fail the answer if it only explains the method: it must show the given data,
the formula, every substituted arithmetic step with intermediate values, and an explicit bold final numeric answer.
Re-check the arithmetic yourself and fail it if any computed value is wrong.
Fail the answer only for real problems, and phrase each issue as an actionable fix.`;
function validateAnswerFor(analysis, question, answer) {
	return completeJson(validationSchema, VALIDATION_SYSTEM, `Shape: {"passed":true,"score":0,"issues":[""],"suggestions":[""]}

${contextBlock(analysis, question)}

=== GENERATED ANSWER ===
${answer.answer_markdown}
Diagram: ${answer.diagram ? JSON.stringify(answer.diagram) : "none"}
Code: ${answer.code ? JSON.stringify(answer.code) : "none"}
Table: ${answer.table ? JSON.stringify(answer.table) : "none"}`);
}
//#endregion
export { analyzeAssessmentText, generateAnswerFor, validateAnswerFor };
