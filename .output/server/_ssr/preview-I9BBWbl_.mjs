import { i as __toESM } from "../_runtime.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as AccordionTrigger$1, i as AccordionItem$1, l as require_jsx_runtime, n as AccordionContent$1, r as AccordionHeader, t as Accordion$1, u as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as finalFilename, c as regenerateQuestion, d as useAssessmentStore, i as finalDocxFilename, n as buildFinalPdf, r as downloadPdf } from "./pipeline-JpHAsJ0z.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { c as Save, f as FileText, h as Download, i as SquarePen, l as RefreshCw, p as FileStack, u as LoaderCircle, v as ChevronDown } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as LevelFormat, c as Paragraph, d as TableCell, f as TableRow, i as ImageRun, l as ShadingType, m as WidthType, n as BorderStyle, o as Packer, p as TextRun, r as File, s as PageBreak, t as AlignmentType, u as Table } from "../_libs/docx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/preview-I9BBWbl_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function Row({ label, value }) {
	if (!value.trim()) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-0.5 border-b border-border/70 py-2 last:border-0 sm:flex-row sm:gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "w-44 shrink-0 text-sm text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-medium",
			children: value
		})]
	});
}
function AssessmentAnalysisView({ analysis }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "card-elevated p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-heading text-lg font-bold",
				children: "Assessment Summary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Institution",
						value: analysis.institution
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Course",
						value: analysis.course_name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Course Code",
						value: analysis.course_code
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Assessment",
						value: analysis.assessment_type
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Questions",
						value: String(analysis.questions.length || analysis.total_questions)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Total Marks",
						value: analysis.total_marks ? String(analysis.total_marks) : ""
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Course Outcome",
						value: analysis.course_outcomes.join(", ")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Taxonomy",
						value: analysis.taxonomy
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Sections",
						value: analysis.sections.map((s) => s.name).join(", ")
					})
				]
			}),
			analysis.instructions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Instructions detected"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground",
					children: analysis.instructions.map((i, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: i }, idx))
				})]
			}),
			analysis.rubric.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Rubric detected"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: analysis.rubric.map((r, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						children: [r.criterion, r.marks ? ` · ${r.marks}` : ""]
					}, idx))
				})]
			}),
			analysis.tables.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Tables analyzed"
				}), analysis.tables.map((t, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-x-auto rounded-lg border border-border",
					children: [t.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "border-b border-border bg-muted/50 px-3 py-2 text-xs font-semibold",
						children: t.title
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-xs",
						children: [t.headers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: t.headers.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-semibold",
								children: h
							}, i)) })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: t.rows.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
							className: "border-t border-border/70",
							children: row.map((cell, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 align-top",
								children: cell
							}, j))
						}, i)) })]
					})]
				}, idx))]
			})
		]
	});
}
var FONT = "Times New Roman";
var SIZE = 24;
var BLACK = "000000";
var CONTENT_W = 9026;
function runs(markdown, opts = {}) {
	const parts = (markdown ?? "").split(/(\*\*)/g);
	let bold = opts.bold ?? false;
	const out = [];
	for (const part of parts) {
		if (part === "**") {
			bold = !bold;
			continue;
		}
		if (!part) continue;
		out.push(new TextRun({
			text: part,
			bold,
			color: BLACK,
			font: opts.font ?? FONT,
			size: opts.size ?? SIZE
		}));
	}
	return out.length ? out : [new TextRun({
		text: "",
		color: BLACK,
		font: FONT,
		size: SIZE
	})];
}
function body(markdown, extra = {}) {
	return new Paragraph({
		children: runs(markdown),
		spacing: { after: 120 },
		...extra
	});
}
function heading(text, size = SIZE) {
	return new Paragraph({
		children: [new TextRun({
			text,
			bold: true,
			color: BLACK,
			font: FONT,
			size
		})],
		spacing: {
			before: 200,
			after: 120
		}
	});
}
function markdownParagraphs(markdown) {
	const out = [];
	let buffer = [];
	const flush = () => {
		if (buffer.length) {
			out.push(body(buffer.join(" ")));
			buffer = [];
		}
	};
	let inFence = false;
	for (const raw of (markdown ?? "").split(/\n/)) {
		const line = raw.trim();
		if (/^```/.test(line)) {
			flush();
			inFence = !inFence;
			continue;
		}
		if (inFence) {
			out.push(new Paragraph({
				spacing: { after: 0 },
				children: [new TextRun({
					text: raw.replace(/\t/g, "    ") || " ",
					font: "Courier New",
					size: 20,
					color: BLACK
				})]
			}));
			continue;
		}
		if (!line) {
			flush();
			continue;
		}
		const h = line.match(/^(#{1,4})\s+(.*)$/);
		const bullet = line.match(/^[-*]\s+(.*)$/);
		const numbered = line.match(/^(\d+[.)])\s+(.*)$/);
		const mathLine = /^\s{2,}\S/.test(raw) || /[=+×÷√∑]/.test(line);
		if (h) {
			flush();
			out.push(heading((h[2] ?? "").replace(/\*\*/g, "")));
		} else if (bullet) {
			flush();
			out.push(new Paragraph({
				children: runs(bullet[1] ?? ""),
				numbering: {
					reference: "answer-bullets",
					level: 0
				},
				spacing: { after: 60 }
			}));
		} else if (numbered) {
			flush();
			out.push(new Paragraph({
				children: runs(`${numbered[1]} ${numbered[2]}`),
				indent: { left: 360 },
				spacing: { after: 60 }
			}));
		} else if (mathLine) {
			flush();
			out.push(body(line));
		} else buffer.push(line);
	}
	flush();
	return out;
}
function docTable(table) {
	const cols = Math.max(table.headers.length, ...table.rows.map((r) => r.length), 1);
	const colW = Math.floor(CONTENT_W / cols);
	const widths = Array.from({ length: cols }, () => colW);
	const border = {
		style: BorderStyle.SINGLE,
		size: 1,
		color: "999999"
	};
	const borders = {
		top: border,
		bottom: border,
		left: border,
		right: border
	};
	const row = (cells, head) => new TableRow({ children: Array.from({ length: cols }, (_, i) => new TableCell({
		borders,
		width: {
			size: colW,
			type: WidthType.DXA
		},
		margins: {
			top: 80,
			bottom: 80,
			left: 120,
			right: 120
		},
		...head ? { shading: {
			fill: "EFEFEF",
			type: ShadingType.CLEAR,
			color: "auto"
		} } : {},
		children: [new Paragraph({ children: runs(cells[i] ?? "", {
			bold: head,
			size: 21
		}) })]
	})) });
	const rows = [];
	if (table.headers.length) rows.push(row(table.headers, true));
	for (const r of table.rows) rows.push(row(r, false));
	const blocks = [];
	if (table.title) blocks.push(body(`*${table.title}*`.replace(/\*/g, "")));
	blocks.push(new Table({
		width: {
			size: CONTENT_W,
			type: WidthType.DXA
		},
		columnWidths: widths,
		rows
	}));
	blocks.push(new Paragraph({
		children: [],
		spacing: { after: 120 }
	}));
	return blocks;
}
var MAX_IMG_W = 602;
var MAX_IMG_H = 930;
function originalPageParagraphs(pages) {
	const out = [];
	pages.forEach((page, i) => {
		const ratio = Math.min(MAX_IMG_W / page.width, MAX_IMG_H / page.height);
		const buffer = new ArrayBuffer(page.data.byteLength);
		new Uint8Array(buffer).set(page.data);
		out.push(new Paragraph({
			alignment: AlignmentType.CENTER,
			spacing: { after: 0 },
			children: [...i > 0 ? [new PageBreak()] : [], new ImageRun({
				type: "png",
				data: buffer,
				transformation: {
					width: Math.round(page.width * ratio),
					height: Math.round(page.height * ratio)
				},
				altText: {
					title: `Assessment page ${i + 1}`,
					description: `Original uploaded assessment page ${i + 1}`,
					name: `assessment-page-${i + 1}`
				}
			})]
		}));
	});
	return out;
}
async function buildAnswerDocx(student, analysis, answers, originalPages = []) {
	const children = [];
	if (originalPages.length) {
		children.push(...originalPageParagraphs(originalPages));
		children.push(new Paragraph({ children: [new PageBreak()] }));
	}
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
		children.push(new Paragraph({
			spacing: { after: 60 },
			children: [new TextRun({
				text: `${label}: `,
				bold: true,
				color: BLACK,
				font: FONT,
				size: SIZE
			}), new TextRun({
				text: value,
				color: BLACK,
				font: FONT,
				size: SIZE
			})]
		}));
	}
	let currentSection = "";
	for (const item of answers) {
		const q = item.question;
		if (q.section && q.section !== currentSection) {
			currentSection = q.section;
			children.push(heading(currentSection.toUpperCase(), 26));
		}
		children.push(heading(`Question ${q.question_number}`, 25));
		children.push(body(q.question_text));
		children.push(heading("Answer"));
		children.push(...markdownParagraphs(item.answer.answer_markdown));
		if (item.answer.table) children.push(...docTable(item.answer.table));
		const diagram = item.answer.diagram;
		if (diagram && diagram.nodes.length) {
			children.push(heading(diagram.title ? `Figure: ${diagram.title}` : "Figure"));
			for (const node of diagram.nodes) children.push(new Paragraph({
				children: runs(node.label),
				numbering: {
					reference: "answer-bullets",
					level: 0
				},
				spacing: { after: 40 }
			}));
			for (const edge of diagram.edges) {
				const from = diagram.nodes.find((n) => n.id === edge.from)?.label ?? edge.from;
				const to = diagram.nodes.find((n) => n.id === edge.to)?.label ?? edge.to;
				children.push(body(`${from} -> ${to}${edge.label ? ` (${edge.label})` : ""}`));
			}
		}
		const code = item.answer.code;
		if (code) {
			if (code.algorithm.length) {
				children.push(heading("Algorithm"));
				code.algorithm.forEach((step, i) => children.push(body(`${i + 1}. ${step}`)));
			}
			if (code.source.trim()) {
				children.push(heading(`Program${code.language ? ` (${code.language})` : ""}`));
				for (const line of code.source.replace(/\t/g, "    ").split("\n")) children.push(new Paragraph({
					spacing: { after: 0 },
					children: [new TextRun({
						text: line || " ",
						font: "Courier New",
						size: 20,
						color: BLACK
					})]
				}));
				children.push(new Paragraph({
					children: [],
					spacing: { after: 120 }
				}));
			}
			if (code.sample_input || code.sample_output) {
				children.push(heading("Sample input / output"));
				if (code.sample_input) children.push(body(`Input: ${code.sample_input}`));
				if (code.sample_output) children.push(body(`Output: ${code.sample_output}`));
			}
			if (code.explanation) {
				children.push(heading("Explanation"));
				children.push(body(code.explanation));
			}
		}
	}
	const doc = new File({
		styles: { default: { document: { run: {
			font: FONT,
			size: SIZE,
			color: BLACK
		} } } },
		numbering: { config: [{
			reference: "answer-bullets",
			levels: [{
				level: 0,
				format: LevelFormat.BULLET,
				text: "•",
				alignment: AlignmentType.LEFT,
				style: { paragraph: { indent: {
					left: 720,
					hanging: 360
				} } }
			}]
		}] },
		sections: [{
			properties: { page: {
				size: {
					width: 11906,
					height: 16838
				},
				margin: {
					top: 1440,
					right: 1440,
					bottom: 1440,
					left: 1440
				}
			} },
			children: children.length ? children : [new Paragraph({ children: runs("No answers generated.") })]
		}]
	});
	const blob = await Packer.toBlob(doc);
	return new Uint8Array(await blob.arrayBuffer());
}
function downloadDocx(bytes, filename) {
	const buffer = new ArrayBuffer(bytes.byteLength);
	new Uint8Array(buffer).set(bytes);
	const url = URL.createObjectURL(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }));
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 4e3);
}
function DownloadButton() {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [busyDocx, setBusyDocx] = (0, import_react.useState)(false);
	const finalPdf = useAssessmentStore((s) => s.finalPdf);
	async function download() {
		setBusy(true);
		try {
			let bytes = finalPdf;
			if (!bytes) {
				if (!await buildFinalPdf()) throw new Error("build failed");
				bytes = useAssessmentStore.getState().finalPdf;
			}
			if (!bytes) throw new Error("no pdf");
			downloadPdf(bytes, finalFilename());
		} catch {
			toast.error("Final PDF generation failed. Please try again.");
		} finally {
			setBusy(false);
		}
	}
	async function downloadWord() {
		setBusyDocx(true);
		try {
			const { student, analysis, answers, originalPdf } = useAssessmentStore.getState();
			if (!analysis) throw new Error("no analysis");
			const { renderPdfPagesToImages } = await import("./pipeline-JpHAsJ0z.mjs").then((n) => n.s).then((n) => n.d);
			downloadDocx(await buildAnswerDocx(student, analysis, answers, originalPdf ? await renderPdfPagesToImages(originalPdf) : []), finalDocxFilename());
		} catch {
			toast.error("Word document generation failed. Please try again.");
		} finally {
			setBusyDocx(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3 sm:flex-row",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "lg",
			disabled: busy,
			onClick: () => void download(),
			children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Download Final PDF"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "lg",
			variant: "outline",
			disabled: busyDocx,
			onClick: () => void downloadWord(),
			children: [busyDocx ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" }), "Download Word (.docx)"]
		})]
	});
}
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function AnswerPreview({ item, editing, draft, onDraftChange }) {
	const { answer, validation } = item;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			validation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: validation.passed ? "secondary" : "destructive",
						children: validation.passed ? "Validation passed" : "Validation flagged"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground",
						children: [
							"Score: ",
							validation.score,
							"/100"
						]
					}),
					validation.issues.slice(0, 3).map((issue, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground",
						children: ["· ", issue]
					}, i))
				]
			}),
			editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: draft,
				onChange: (e) => onDraftChange(e.target.value),
				className: "min-h-72 font-mono text-xs"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "whitespace-pre-wrap text-sm leading-relaxed",
				children: answer.answer_markdown.replace(/\*\*/g, "")
			}),
			answer.table && (answer.table.headers.length > 0 || answer.table.rows.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-lg border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: answer.table.headers.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-semibold",
							children: h
						}, i)) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: answer.table.rows.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
						className: "border-t border-border/70",
						children: row.map((c, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 align-top",
							children: c
						}, j))
					}, i)) })]
				})
			}),
			answer.diagram && answer.diagram.nodes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-muted/30 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
						children: ["Diagram · ", answer.diagram.kind]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm font-medium",
						children: answer.diagram.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 space-y-2",
						children: [...new Set(answer.diagram.nodes.map((n) => n.layer))].sort((a, b) => a - b).map((layer) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap justify-center gap-2",
							children: answer.diagram.nodes.filter((n) => n.layer === layer).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md border border-primary/40 bg-card px-3 py-1.5 text-center text-xs font-medium text-primary",
								children: n.label
							}, n.id))
						}, layer))
					})
				]
			}),
			answer.code && answer.code.source && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					answer.code.algorithm.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "list-decimal space-y-1 pl-5 text-sm",
						children: answer.code.algorithm.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: s }, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "overflow-x-auto rounded-lg bg-surface-ink p-4 text-xs leading-relaxed text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: answer.code.source })
					}),
					(answer.code.sample_input || answer.code.sample_output) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Sample I/O: ",
							answer.code.sample_input,
							" → ",
							answer.code.sample_output
						]
					})
				]
			})
		]
	});
}
var Accordion = Accordion$1;
var AccordionItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionItem$1, {
	ref,
	className: cn("border-b", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionHeader, {
	className: "flex",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionTrigger$1, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = AccordionTrigger$1.displayName;
var AccordionContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent$1, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = AccordionContent$1.displayName;
function QuestionList() {
	const answers = useAssessmentStore((s) => s.answers);
	const updateAnswer = useAssessmentStore((s) => s.updateAnswer);
	const setFinalPdf = useAssessmentStore((s) => s.setFinalPdf);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)("");
	async function regenerate(index, what) {
		setBusy(index);
		try {
			await regenerateQuestion(index);
			toast.success(what === "diagram" ? "Diagram regenerated" : "Answer regenerated");
		} catch {
			toast.error(what === "diagram" ? "Diagram generation failed. Regenerate the diagram." : "Answer generation failed. Please try again.");
		} finally {
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "card-elevated p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-heading text-lg font-bold",
			children: "Questions & Answers"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
			type: "single",
			collapsible: true,
			className: "mt-3",
			children: answers.map((item, index) => {
				const q = item.question;
				const artifacts = [
					q.requires_diagram || q.requires_concept_map ? "Visual" : null,
					q.requires_code ? "Code" : null,
					q.requires_table ? "Table" : null,
					q.requires_formula ? "Formula" : null
				].filter(Boolean);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
					value: `q-${index}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
						className: "text-left",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-1 flex-wrap items-center gap-2 pr-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-heading font-bold",
									children: ["Q", q.question_number]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "line-clamp-1 flex-1 text-sm font-normal text-muted-foreground",
									children: q.question_text
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "secondary",
									children: ["Marks: ", q.marks]
								}),
								q.question_type[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									children: q.question_type[0]
								}),
								q.answer_depth && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									children: ["Depth: ", q.answer_depth]
								}),
								artifacts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									children: a
								}, a))
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnswerPreview, {
						item,
						editing: editing === index,
						draft,
						onDraftChange: setDraft
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							editing === index ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => {
									updateAnswer(index, {
										...item,
										answer: {
											...item.answer,
											answer_markdown: draft
										}
									});
									setFinalPdf(null);
									setEditing(null);
									toast.success("Answer updated");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), " Save answer"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => {
									setDraft(item.answer.answer_markdown);
									setEditing(index);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "size-4" }), " Edit answer"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								disabled: busy === index,
								onClick: () => void regenerate(index, "answer"),
								children: [busy === index ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), "Regenerate answer"]
							}),
							(q.requires_diagram || q.requires_concept_map) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								disabled: busy === index,
								onClick: () => void regenerate(index, "diagram"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), " Regenerate diagram"]
							})
						]
					})] })]
				}, `${q.question_number}-${index}`);
			})
		})]
	});
}
function PreviewPage() {
	const { analysis, answers, student, fileName } = useAssessmentStore();
	if (!analysis) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-xl px-5 py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileStack, { className: "mx-auto size-10 text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-heading text-2xl font-bold",
				children: "Nothing to preview yet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Upload an assessment and generate answers first."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/create",
					children: "Start an assessment"
				})
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-4xl px-5 py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-heading text-3xl font-bold tracking-tight",
				children: "Answer preview"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: [
					student.name,
					" · ",
					student.registrationNumber,
					" · ",
					fileName,
					" · ",
					answers.length,
					" answers"
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/create",
					children: "New assessment"
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssessmentAnalysisView, { analysis }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionList, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-elevated flex flex-col items-start gap-3 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-heading text-lg font-bold",
						children: "Final document"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Original assessment pages first, followed by your Times New Roman 12pt answers."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DownloadButton, {})]
				})
			]
		})]
	});
}
//#endregion
export { PreviewPage as component };
