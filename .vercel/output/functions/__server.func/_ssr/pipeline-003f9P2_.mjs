import { n as __exportAll$1 } from "../_runtime.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { a as stringType, i as objectType, t as arrayType } from "../_libs/zod.mjs";
import { n as answerSchema, r as questionSchema, t as analysisSchema } from "./assessment-CvJPISfP.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-DMQV7yDI.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as StandardFonts, r as rgb, t as PDFDocument } from "../_libs/pdf-lib.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pipeline-003f9P2_.js
var pipeline_003f9P2__exports = /* @__PURE__ */ __exportAll$1({
	a: () => runAnalysis,
	c: () => PIPELINE_STEPS,
	d: () => extract_exports,
	i: () => regenerateQuestion,
	l: () => formatBytes,
	n: () => finalDocxFilename,
	o: () => runGeneration,
	r: () => finalFilename,
	s: () => downloadPdf,
	t: () => buildFinalPdf,
	u: () => useAssessmentStore
});
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var extract_exports = /* @__PURE__ */ __exportAll({
	extractPdfText: () => extractPdfText,
	renderPdfPagesToImages: () => renderPdfPagesToImages
});
var workerReady = false;
async function getPdfjs() {
	const pdfjs = await import("../_libs/pdfjs-dist.mjs").then((n) => n.t);
	if (!workerReady) {
		const worker = await import("./pdf.worker.min-DMv0gVyV.mjs");
		pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
		workerReady = true;
	}
	return pdfjs;
}
/**
* Extracts text from EVERY page of the PDF, preserving line breaks so that
* headings, question numbers, marks and table rows survive for the analyzer.
*/
async function extractPdfText(bytes) {
	const doc = await (await getPdfjs()).getDocument({ data: bytes.slice() }).promise;
	const perPage = [];
	for (let i = 1; i <= doc.numPages; i++) {
		const content = await (await doc.getPage(i)).getTextContent();
		let line = "";
		let lastY = null;
		const lines = [];
		for (const item of content.items) {
			if (!("str" in item)) continue;
			const y = Math.round(item.transform[5]);
			if (lastY !== null && Math.abs(y - lastY) > 3) {
				lines.push(line.trim());
				line = "";
			}
			line += item.str + (item.hasEOL ? " " : " ");
			lastY = y;
		}
		if (line.trim()) lines.push(line.trim());
		perPage.push(lines.filter(Boolean).join("\n"));
	}
	doc.cleanup();
	const text = perPage.map((p, i) => `--- Page ${i + 1} ---\n${p}`).join("\n\n");
	return {
		pageCount: doc.numPages,
		text,
		perPage
	};
}
/** Renders every page of the PDF to a PNG image (for embedding in a DOCX). */
async function renderPdfPagesToImages(bytes, scale = 2) {
	const doc = await (await getPdfjs()).getDocument({ data: bytes.slice() }).promise;
	const out = [];
	for (let i = 1; i <= doc.numPages; i++) {
		const page = await doc.getPage(i);
		const viewport = page.getViewport({ scale });
		const canvas = document.createElement("canvas");
		canvas.width = Math.ceil(viewport.width);
		canvas.height = Math.ceil(viewport.height);
		const context = canvas.getContext("2d");
		if (!context) continue;
		context.fillStyle = "#ffffff";
		context.fillRect(0, 0, canvas.width, canvas.height);
		await page.render({
			canvas,
			canvasContext: context,
			viewport
		}).promise;
		const blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
		if (!blob) continue;
		out.push({
			data: new Uint8Array(await blob.arrayBuffer()),
			width: canvas.width,
			height: canvas.height
		});
	}
	doc.cleanup();
	return out;
}
var PIPELINE_STEPS = [
	{
		id: "uploaded",
		label: "Assessment uploaded"
	},
	{
		id: "reading",
		label: "Reading assessment"
	},
	{
		id: "tables",
		label: "Analyzing tables"
	},
	{
		id: "questions",
		label: "Detecting questions"
	},
	{
		id: "marks",
		label: "Analyzing marks"
	},
	{
		id: "rubric",
		label: "Analyzing rubric"
	},
	{
		id: "classify",
		label: "Classifying questions"
	},
	{
		id: "plan",
		label: "Planning answers"
	},
	{
		id: "answers",
		label: "Generating answers"
	},
	{
		id: "diagrams",
		label: "Generating diagrams"
	},
	{
		id: "code",
		label: "Generating code"
	},
	{
		id: "validate",
		label: "Validating answers"
	},
	{
		id: "answerPdf",
		label: "Creating answer PDF"
	},
	{
		id: "merge",
		label: "Combining PDFs"
	},
	{
		id: "ready",
		label: "Final PDF ready"
	}
];
var emptySteps = () => Object.fromEntries(PIPELINE_STEPS.map((s) => [s.id, "pending"]));
var useAssessmentStore = create((set) => ({
	student: {
		name: "",
		registrationNumber: ""
	},
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
	setFile: ({ name, size, bytes }) => set({
		fileName: name,
		fileSize: size,
		originalPdf: bytes,
		pageCount: 0
	}),
	clearFile: () => set({
		fileName: "",
		fileSize: 0,
		originalPdf: null,
		pageCount: 0
	}),
	setPageCount: (pageCount) => set({ pageCount }),
	setExtractedText: (extractedText) => set({ extractedText }),
	setAnalysis: (analysis) => set({ analysis }),
	setAnswers: (answers) => set({ answers }),
	updateAnswer: (index, answer) => set((s) => ({ answers: s.answers.map((a, i) => i === index ? answer : a) })),
	setStep: (id, state) => set((s) => ({ steps: {
		...s.steps,
		[id]: state
	} })),
	setProgressNote: (progressNote) => set({ progressNote }),
	setError: (error) => set({ error }),
	setFinalPdf: (finalPdf) => set({ finalPdf }),
	resetPipeline: () => set({
		analysis: null,
		answers: [],
		steps: emptySteps(),
		progressNote: "",
		error: null,
		finalPdf: null,
		extractedText: ""
	})
}));
function formatBytes(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var analyzeInput = objectType({ text: stringType().min(20) });
var generateInput = objectType({
	analysis: analysisSchema,
	question: questionSchema,
	feedback: arrayType(stringType()).optional()
});
var validateInput = objectType({
	analysis: analysisSchema,
	question: questionSchema,
	answer: answerSchema
});
var analyzeAssessment = createServerFn({ method: "POST" }).inputValidator((input) => analyzeInput.parse(input)).handler(createSsrRpc("df9ab5404b03f2ab9bce5b9be8292169a160e7ede9a62379ef1a21db861b6a90"));
var generateAnswer = createServerFn({ method: "POST" }).inputValidator((input) => generateInput.parse(input)).handler(createSsrRpc("3fb8a786da8627d1eeea3caa46b9e1bc2fd9d05cfe11277f7ccac3efcc60eae5"));
var validateAnswer = createServerFn({ method: "POST" }).inputValidator((input) => validateInput.parse(input)).handler(createSsrRpc("49cab2c949e37f1381f0079e75194dad40406c07dfce97e6425200defce2c4b9"));
var PAGE_W = 595.28;
var PAGE_H = 841.89;
var MARGIN = 56;
var BODY_SIZE = 12;
var LINE_GAP = 5.5;
var INK = rgb(.08, .09, .13);
var MUTED = rgb(.38, .4, .46);
var RULE = rgb(.78, .8, .84);
var ACCENT = rgb(.09, .24, .44);
var CODE_BG = rgb(.955, .957, .965);
/** pdf-lib standard fonts are WinAnsi; drop anything they cannot encode. */
function sanitize(input) {
	return (input ?? "").replace(/[\u2018\u2019\u201B]/g, "'").replace(/[\u201C\u201D]/g, "\"").replace(/[\u2013\u2014]/g, "-").replace(/\u2026/g, "...").replace(/[\u2192\u21D2]/g, "->").replace(/\u00A0/g, " ").replace(/[^\x09\x0A\x0D\x20-\x7E\u00A1-\u00FF]/g, "");
}
function tokenize(text) {
	const words = [];
	let bold = false;
	for (const chunk of sanitize(text).split(/(\*\*)/g)) {
		if (chunk === "**") {
			bold = !bold;
			continue;
		}
		for (const w of chunk.split(/\s+/g)) if (w) words.push({
			text: w,
			bold
		});
	}
	return words;
}
var AnswerDoc = class AnswerDoc {
	pdf;
	page;
	y = 0;
	regular;
	bold;
	italic;
	mono;
	static async create() {
		const doc = new AnswerDoc();
		doc.pdf = await PDFDocument.create();
		doc.regular = await doc.pdf.embedFont(StandardFonts.TimesRoman);
		doc.bold = await doc.pdf.embedFont(StandardFonts.TimesRomanBold);
		doc.italic = await doc.pdf.embedFont(StandardFonts.TimesRomanItalic);
		doc.mono = await doc.pdf.embedFont(StandardFonts.Courier);
		doc.addPage();
		return doc;
	}
	get width() {
		return 483.28;
	}
	addPage() {
		this.page = this.pdf.addPage([PAGE_W, PAGE_H]);
		this.y = 785.89;
	}
	ensure(height) {
		if (this.y - height < 80) this.addPage();
	}
	space(h) {
		this.y -= h;
	}
	text(value, opts = {}) {
		const size = opts.size ?? BODY_SIZE;
		const font = opts.font ?? this.regular;
		const clean = sanitize(value);
		const w = font.widthOfTextAtSize(clean, size);
		let x = opts.x ?? MARGIN;
		if (opts.align === "center") x = (PAGE_W - w) / 2;
		if (opts.align === "right") x = 539.28 - w;
		this.ensure(size + LINE_GAP);
		this.page.drawText(clean, {
			x,
			y: this.y - size,
			size,
			font,
			color: opts.color ?? INK
		});
		this.y -= size + LINE_GAP;
	}
	/** Justified, word-wrapped paragraph with inline bold support. */
	paragraph(markdown, opts = {}) {
		const size = opts.size ?? BODY_SIZE;
		const indent = opts.indent ?? 0;
		const justify = opts.justify ?? true;
		const maxWidth = this.width - indent;
		const words = tokenize(markdown);
		if (!words.length) return;
		const spaceW = this.regular.widthOfTextAtSize(" ", size);
		let line = [];
		let lineW = 0;
		const flush = (last) => {
			if (!line.length) return;
			this.ensure(size + LINE_GAP);
			const gaps = line.length - 1;
			const extra = justify && !last && gaps > 0 ? (maxWidth - lineW - gaps * spaceW) / gaps : 0;
			let x = MARGIN + indent;
			for (const word of line) {
				const font = word.bold ? this.bold : this.regular;
				this.page.drawText(word.text, {
					x,
					y: this.y - size,
					size,
					font,
					color: opts.color ?? INK
				});
				x += font.widthOfTextAtSize(word.text, size) + spaceW + extra;
			}
			this.y -= size + LINE_GAP;
			line = [];
			lineW = 0;
		};
		for (const word of words) {
			const w = (word.bold ? this.bold : this.regular).widthOfTextAtSize(word.text, size);
			const projected = lineW + (line.length ? spaceW : 0) + w;
			if (line.length && projected > maxWidth) flush(false);
			lineW += (line.length ? spaceW : 0) + w;
			line.push(word);
		}
		flush(true);
	}
	rule(color = RULE) {
		this.ensure(10);
		this.page.drawLine({
			start: {
				x: MARGIN,
				y: this.y
			},
			end: {
				x: 539.28,
				y: this.y
			},
			thickness: .8,
			color
		});
		this.y -= 10;
	}
};
function renderMarkdown(doc, markdown) {
	const blocks = sanitize(markdown).split(/\n/);
	let paragraph = [];
	const flush = () => {
		if (paragraph.length) {
			doc.paragraph(paragraph.join(" "));
			doc.space(4);
			paragraph = [];
		}
	};
	let inFence = false;
	for (const raw of blocks) {
		const line = raw.trimEnd();
		if (/^\s*```/.test(line)) {
			flush();
			inFence = !inFence;
			doc.space(3);
			continue;
		}
		if (inFence) {
			doc.ensure(16);
			doc.text(line.replace(/\t/g, "    ") || " ", {
				font: doc.mono,
				size: 10
			});
			continue;
		}
		if (!line.trim()) {
			flush();
			continue;
		}
		const heading = line.match(/^(#{1,4})\s+(.*)$/);
		const bullet = line.match(/^\s*[-*]\s+(.*)$/);
		const numbered = line.match(/^\s*(\d+[.)])\s+(.*)$/);
		const mathLine = /^\s{2,}\S/.test(raw) || /[=+×÷√∑]/.test(line);
		if (heading) {
			flush();
			doc.space(4);
			doc.ensure(28);
			doc.text((heading[2] ?? "").replace(/\*\*/g, ""), {
				font: doc.bold,
				size: BODY_SIZE
			});
			doc.space(1);
		} else if (bullet) {
			flush();
			doc.ensure(20);
			const yBefore = doc.y;
			doc.page.drawCircle({
				x: 62,
				y: yBefore - BODY_SIZE / 2 - 1,
				size: 1.6,
				color: INK
			});
			doc.paragraph(bullet[1] ?? "", {
				indent: 16,
				justify: false
			});
			doc.space(1.5);
		} else if (numbered) {
			flush();
			doc.ensure(20);
			const yBefore = doc.y;
			doc.page.drawText(numbered[1] ?? "", {
				x: MARGIN,
				y: yBefore - BODY_SIZE,
				size: BODY_SIZE,
				font: doc.regular,
				color: INK
			});
			doc.paragraph(numbered[2] ?? "", {
				indent: 20,
				justify: false
			});
			doc.space(1.5);
		} else if (mathLine) {
			flush();
			doc.paragraph(line.trim(), { justify: false });
			doc.space(2);
		} else paragraph.push(line.trim());
	}
	flush();
}
function renderTable(doc, table) {
	if (!table.headers.length && !table.rows.length) return;
	const cols = Math.max(table.headers.length, ...table.rows.map((r) => r.length), 1);
	const colW = doc.width / cols;
	const size = 10.5;
	if (table.title) {
		doc.space(4);
		doc.text(table.title, {
			font: doc.italic,
			size: 11,
			color: INK
		});
	}
	const drawRow = (cells, bold) => {
		const wrapped = Array.from({ length: cols }, (_, i) => wrapText(sanitize(cells[i] ?? ""), bold ? doc.bold : doc.regular, size, colW - 10));
		const rowH = Math.max(...wrapped.map((w) => w.length)) * 13.5 + 8;
		doc.ensure(rowH + 4);
		const top = doc.y;
		if (bold) doc.page.drawRectangle({
			x: MARGIN,
			y: top - rowH,
			width: doc.width,
			height: rowH,
			color: CODE_BG
		});
		wrapped.forEach((lines, i) => {
			lines.forEach((ln, j) => {
				doc.page.drawText(ln, {
					x: MARGIN + i * colW + 5,
					y: top - 6 - size - j * 13.5,
					size,
					font: bold ? doc.bold : doc.regular,
					color: INK
				});
			});
		});
		doc.page.drawRectangle({
			x: MARGIN,
			y: top - rowH,
			width: doc.width,
			height: rowH,
			borderColor: RULE,
			borderWidth: .6
		});
		for (let i = 1; i < cols; i++) doc.page.drawLine({
			start: {
				x: MARGIN + i * colW,
				y: top
			},
			end: {
				x: MARGIN + i * colW,
				y: top - rowH
			},
			thickness: .6,
			color: RULE
		});
		doc.y = top - rowH;
	};
	if (table.headers.length) drawRow(table.headers, true);
	for (const row of table.rows) drawRow(row, false);
	doc.space(8);
}
function wrapText(text, font, size, maxWidth) {
	const words = text.split(/\s+/).filter(Boolean);
	const lines = [];
	let current = "";
	for (const word of words) {
		const next = current ? `${current} ${word}` : word;
		if (font.widthOfTextAtSize(next, size) > maxWidth && current) {
			lines.push(current);
			current = word;
		} else current = next;
	}
	if (current) lines.push(current);
	return lines.length ? lines : [""];
}
function renderDiagram(doc, diagram) {
	if (!diagram.nodes.length) return;
	const size = 9;
	const layers = /* @__PURE__ */ new Map();
	diagram.nodes.forEach((n) => {
		const list = layers.get(n.layer) ?? [];
		list.push(n);
		layers.set(n.layer, list);
	});
	const layerKeys = [...layers.keys()].sort((a, b) => a - b);
	const boxH = 34;
	const totalH = layerKeys.length * boxH + (layerKeys.length - 1) * 30 + 34;
	doc.space(6);
	doc.ensure(totalH + 20);
	if (diagram.title) doc.text(`Figure: ${diagram.title}`, {
		font: doc.italic,
		size: 11,
		color: INK
	});
	const top = doc.y - 6;
	const positions = /* @__PURE__ */ new Map();
	layerKeys.forEach((key, li) => {
		const nodes = layers.get(key);
		const gap = 14;
		const boxW = Math.min(160, (doc.width - gap * (nodes.length - 1)) / nodes.length);
		const rowW = nodes.length * boxW + gap * (nodes.length - 1);
		let x = MARGIN + (doc.width - rowW) / 2;
		const y = top - li * 64;
		for (const node of nodes) {
			doc.page.drawRectangle({
				x,
				y: y - boxH,
				width: boxW,
				height: boxH,
				color: rgb(.96, .97, 1),
				borderColor: ACCENT,
				borderWidth: .9
			});
			const lines = wrapText(sanitize(node.label), doc.regular, size, boxW - 8).slice(0, 2);
			lines.forEach((ln, i) => {
				const w = doc.regular.widthOfTextAtSize(ln, size);
				doc.page.drawText(ln, {
					x: x + (boxW - w) / 2,
					y: y - boxH / 2 - size / 2 + (lines.length === 2 ? i === 0 ? 5 : -5 : 0),
					size,
					font: doc.regular,
					color: INK
				});
			});
			positions.set(node.id, {
				x: x + boxW / 2,
				y,
				w: boxW
			});
			x += boxW + gap;
		}
	});
	for (const edge of diagram.edges) {
		const a = positions.get(edge.from);
		const b = positions.get(edge.to);
		if (!a || !b) continue;
		const start = {
			x: a.x,
			y: a.y - boxH
		};
		const end = {
			x: b.x,
			y: b.y
		};
		doc.page.drawLine({
			start,
			end,
			thickness: .8,
			color: MUTED
		});
		const dx = end.x - start.x;
		const dy = end.y - start.y;
		const len = Math.hypot(dx, dy) || 1;
		const ux = dx / len;
		const uy = dy / len;
		doc.page.drawLine({
			start: end,
			end: {
				x: end.x - ux * 6 - uy * 3,
				y: end.y - uy * 6 + ux * 3
			},
			thickness: .8,
			color: MUTED
		});
		doc.page.drawLine({
			start: end,
			end: {
				x: end.x - ux * 6 + uy * 3,
				y: end.y - uy * 6 - ux * 3
			},
			thickness: .8,
			color: MUTED
		});
		if (edge.label) {
			const label = sanitize(edge.label).slice(0, 24);
			doc.page.drawText(label, {
				x: (start.x + end.x) / 2 + 4,
				y: (start.y + end.y) / 2,
				size: 8,
				font: doc.italic,
				color: INK
			});
		}
	}
	doc.y = top - (layerKeys.length - 1) * 64 - boxH - 16;
}
function renderCode(doc, code) {
	if (code.algorithm.length) {
		doc.space(4);
		doc.text("Algorithm", { font: doc.bold });
		code.algorithm.forEach((step, i) => doc.paragraph(`${i + 1}. ${step}`, { justify: false }));
		doc.space(4);
	}
	if (code.source.trim()) {
		doc.text(`Program${code.language ? ` (${code.language})` : ""}`, { font: doc.bold });
		const size = 9.5;
		const lines = sanitize(code.source).split("\n").flatMap((l) => wrapText(l.replace(/\t/g, "    "), doc.mono, size, doc.width - 20) || [""]);
		for (const line of lines) {
			doc.ensure(13.5);
			doc.page.drawRectangle({
				x: MARGIN,
				y: doc.y - size - 3,
				width: doc.width,
				height: 14.5,
				color: CODE_BG
			});
			doc.page.drawText(line, {
				x: 64,
				y: doc.y - size,
				size,
				font: doc.mono,
				color: INK
			});
			doc.y -= 13.5;
		}
		doc.space(6);
	}
	if (code.sample_input || code.sample_output) {
		doc.text("Sample input / output", { font: doc.bold });
		if (code.sample_input) doc.paragraph(`Input: ${code.sample_input}`, { justify: false });
		if (code.sample_output) doc.paragraph(`Output: ${code.sample_output}`, { justify: false });
		doc.space(4);
	}
	if (code.explanation) {
		doc.text("Explanation", { font: doc.bold });
		doc.paragraph(code.explanation);
		doc.space(4);
	}
}
async function buildAnswerPdf(student, analysis, answers) {
	const doc = await AnswerDoc.create();
	const meta = [
		["Student Name", student.name],
		["Registration Number", student.registrationNumber],
		["Course", analysis.course_name],
		["Course Code", analysis.course_code],
		["Assessment", analysis.assessment_type],
		["Institution", analysis.institution],
		["Course Outcome", analysis.course_outcomes.join(", ")],
		["Taxonomy", analysis.taxonomy],
		["Total Marks", analysis.total_marks ? String(analysis.total_marks) : ""]
	];
	for (const [label, value] of meta) {
		if (!value?.trim()) continue;
		doc.ensure(18);
		const y = doc.y;
		doc.page.drawText(sanitize(`${label}:`), {
			x: MARGIN,
			y: y - BODY_SIZE,
			size: BODY_SIZE,
			font: doc.bold,
			color: INK
		});
		doc.page.drawText(sanitize(value), {
			x: 206,
			y: y - BODY_SIZE,
			size: BODY_SIZE,
			font: doc.regular,
			color: INK
		});
		doc.y -= 17.5;
	}
	doc.space(6);
	doc.rule();
	doc.space(8);
	let currentSection = "";
	for (const item of answers) {
		const q = item.question;
		if (q.section && q.section !== currentSection) {
			currentSection = q.section;
			doc.space(6);
			doc.ensure(30);
			doc.text(currentSection.toUpperCase(), {
				font: doc.bold,
				size: 13,
				color: INK
			});
			doc.space(4);
		}
		doc.ensure(90);
		doc.space(6);
		doc.text(`Question ${q.question_number}`, {
			font: doc.bold,
			size: 12.5,
			color: INK
		});
		doc.paragraph(q.question_text, { justify: false });
		doc.space(4);
		doc.text("Answer", { font: doc.bold });
		doc.space(2);
		renderMarkdown(doc, item.answer.answer_markdown);
		if (item.answer.table) renderTable(doc, item.answer.table);
		if (item.answer.diagram) renderDiagram(doc, item.answer.diagram);
		if (item.answer.code) renderCode(doc, item.answer.code);
		doc.space(6);
		doc.rule();
	}
	const pages = doc.pdf.getPages();
	pages.forEach((page, i) => {
		const label = `Answers - Page ${i + 1} of ${pages.length}`;
		const w = doc.regular.widthOfTextAtSize(label, 9);
		page.drawText(label, {
			x: (PAGE_W - w) / 2,
			y: 26,
			size: 9,
			font: doc.regular,
			color: INK
		});
	});
	return doc.pdf.save();
}
/**
* Final PDF = original assessment pages (copied verbatim, unchanged) followed by
* the AI generated answer pages.
*/
async function mergeAssessmentAndAnswers(originalPdf, answerPdf) {
	const out = await PDFDocument.create();
	const original = await PDFDocument.load(originalPdf.slice(), { ignoreEncryption: true });
	const answers = await PDFDocument.load(answerPdf.slice());
	(await out.copyPages(original, original.getPageIndices())).forEach((p) => out.addPage(p));
	(await out.copyPages(answers, answers.getPageIndices())).forEach((p) => out.addPage(p));
	return out.save();
}
function sanitizeFilename(value) {
	return value.normalize("NFKD").replace(/[^\w.-]+/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "").slice(0, 60) || "Student";
}
function downloadPdf(bytes, filename) {
	const buffer = new ArrayBuffer(bytes.byteLength);
	new Uint8Array(buffer).set(bytes);
	const url = URL.createObjectURL(new Blob([buffer], { type: "application/pdf" }));
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 4e3);
}
function friendly(error, fallback) {
	const message = error instanceof Error ? error.message : String(error);
	if (/missing AI_API_KEY|not configured/i.test(message)) return "AI is not configured. Please add AI_API_KEY to your .env file and restart the server.";
	if (/credits/i.test(message)) return message;
	if (/rate limited/i.test(message)) return message;
	if (/API key|unauthorized|invalid api key|401/i.test(message)) return "Invalid AI API Key. Please verify AI_API_KEY in your .env file.";
	return message || fallback;
}
async function runAnalysis() {
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
		if (text.replace(/---\s*Page\s*\d+\s*---/g, "").trim().length < 40) throw new Error("empty");
	} catch {
		store.setStep("reading", "error");
		store.setError("We couldn't read this assessment. Please upload a clearer PDF.");
		return false;
	}
	store.setStep("reading", "done");
	for (const id of [
		"tables",
		"questions",
		"marks",
		"rubric"
	]) store.setStep(id, "active");
	store.setProgressNote("Understanding the assessment structure...");
	try {
		const analysis = await analyzeAssessment({ data: { text } });
		store.setAnalysis(analysis);
		for (const id of [
			"tables",
			"questions",
			"marks",
			"rubric",
			"classify",
			"plan"
		]) store.setStep(id, "done");
		store.setProgressNote("");
		return true;
	} catch (error) {
		for (const id of [
			"tables",
			"questions",
			"marks",
			"rubric"
		]) store.setStep(id, "error");
		store.setError(friendly(error, "Assessment analysis failed. Please try again."));
		return false;
	}
}
async function answerOne(question) {
	const { analysis } = useAssessmentStore.getState();
	if (!analysis) throw new Error("No analysis");
	let answer = await generateAnswer({ data: {
		analysis,
		question
	} });
	let validation = {
		passed: true,
		score: 0,
		issues: [],
		suggestions: []
	};
	try {
		validation = await validateAnswer({ data: {
			analysis,
			question,
			answer
		} });
		if (!validation.passed && validation.issues.length) {
			answer = await generateAnswer({ data: {
				analysis,
				question,
				feedback: validation.issues
			} });
			validation = await validateAnswer({ data: {
				analysis,
				question,
				answer
			} });
		}
	} catch {}
	return {
		question,
		answer,
		validation
	};
}
function placeholder(question, reason) {
	return {
		question,
		answer: {
			answer_markdown: `_This answer could not be generated automatically (${reason}). Use “Regenerate” on this question to try again._`,
			table: null,
			diagram: null,
			code: null
		},
		validation: {
			passed: false,
			score: 0,
			issues: [reason],
			suggestions: []
		}
	};
}
var CONCURRENCY = 3;
async function runGeneration() {
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
	const results = new Array(questions.length);
	const failed = [];
	let completed = 0;
	let fatal = null;
	const publish = () => {
		useAssessmentStore.getState().setAnswers(results.filter((r) => Boolean(r)));
	};
	let next = 0;
	async function worker() {
		while (true) {
			const i = next++;
			if (i >= questions.length || fatal) return;
			const question = questions[i];
			try {
				results[i] = await answerOne(question);
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				if (/credits/i.test(message)) {
					fatal = error;
					return;
				}
				try {
					results[i] = await answerOne(question);
				} catch {
					results[i] = placeholder(question, "the AI could not complete it in time");
					failed.push(question.question_number);
				}
			}
			completed++;
			useAssessmentStore.getState().setProgressNote(`Answered ${completed} of ${questions.length} questions`);
			publish();
		}
	}
	await Promise.all(Array.from({ length: Math.min(CONCURRENCY, questions.length || 1) }, () => worker()));
	if (fatal) {
		store.setStep("answers", "error");
		store.setError(friendly(fatal, "Answer generation failed. Please try again."));
		return false;
	}
	publish();
	for (const id of [
		"answers",
		"diagrams",
		"code",
		"validate"
	]) store.setStep(id, "done");
	store.setProgressNote("Building the final document...");
	const ok = await buildFinalPdf();
	store.setProgressNote("");
	if (ok && failed.length) useAssessmentStore.getState().setError(`Questions ${failed.join(", ")} couldn't be generated. Open Preview and regenerate them individually.`);
	return ok;
}
async function buildFinalPdf() {
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
async function regenerateQuestion(index) {
	const existing = useAssessmentStore.getState().answers[index];
	if (!existing) return;
	const updated = await answerOne(existing.question);
	useAssessmentStore.getState().updateAnswer(index, updated);
	useAssessmentStore.getState().setFinalPdf(null);
}
function finalFilename() {
	const { student } = useAssessmentStore.getState();
	return `${sanitizeFilename(student.name)}_${sanitizeFilename(student.registrationNumber)}_Assessment.pdf`;
}
function finalDocxFilename() {
	return finalFilename().replace(/\.pdf$/i, ".docx");
}
//#endregion
export { finalFilename as a, regenerateQuestion as c, useAssessmentStore as d, finalDocxFilename as i, runAnalysis as l, buildFinalPdf as n, formatBytes as o, downloadPdf as r, pipeline_003f9P2__exports as s, PIPELINE_STEPS as t, runGeneration as u };
