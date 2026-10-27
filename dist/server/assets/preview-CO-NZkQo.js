import { i as regenerateQuestion, n as finalDocxFilename, r as finalFilename, s as downloadPdf, t as buildFinalPdf, u as useAssessmentStore } from "./pipeline-003f9P2_.js";
import { n as cn, t as Button } from "./button-DRsC1qZi.js";
import * as React from "react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronDown, Download, FileStack, FileText, LoaderCircle, RefreshCw, Save, SquarePen } from "lucide-react";
import { toast } from "sonner";
import { cva } from "class-variance-authority";
import { AlignmentType, BorderStyle, Document, ImageRun, LevelFormat, Packer, PageBreak, Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, WidthType } from "docx";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
//#region src/components/ui/badge.tsx
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
	return /* @__PURE__ */ jsx("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
//#region src/components/AssessmentAnalysis.tsx
function Row({ label, value }) {
	if (!value.trim()) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-0.5 border-b border-border/70 py-2 last:border-0 sm:flex-row sm:gap-4",
		children: [/* @__PURE__ */ jsx("span", {
			className: "w-44 shrink-0 text-sm text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("span", {
			className: "text-sm font-medium",
			children: value
		})]
	});
}
function AssessmentAnalysisView({ analysis }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "card-elevated p-6",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "font-heading text-lg font-bold",
				children: "Assessment Summary"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-3",
				children: [
					/* @__PURE__ */ jsx(Row, {
						label: "Institution",
						value: analysis.institution
					}),
					/* @__PURE__ */ jsx(Row, {
						label: "Course",
						value: analysis.course_name
					}),
					/* @__PURE__ */ jsx(Row, {
						label: "Course Code",
						value: analysis.course_code
					}),
					/* @__PURE__ */ jsx(Row, {
						label: "Assessment",
						value: analysis.assessment_type
					}),
					/* @__PURE__ */ jsx(Row, {
						label: "Questions",
						value: String(analysis.questions.length || analysis.total_questions)
					}),
					/* @__PURE__ */ jsx(Row, {
						label: "Total Marks",
						value: analysis.total_marks ? String(analysis.total_marks) : ""
					}),
					/* @__PURE__ */ jsx(Row, {
						label: "Course Outcome",
						value: analysis.course_outcomes.join(", ")
					}),
					/* @__PURE__ */ jsx(Row, {
						label: "Taxonomy",
						value: analysis.taxonomy
					}),
					/* @__PURE__ */ jsx(Row, {
						label: "Sections",
						value: analysis.sections.map((s) => s.name).join(", ")
					})
				]
			}),
			analysis.instructions.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "text-sm font-semibold",
					children: "Instructions detected"
				}), /* @__PURE__ */ jsx("ul", {
					className: "mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground",
					children: analysis.instructions.map((i, idx) => /* @__PURE__ */ jsx("li", { children: i }, idx))
				})]
			}),
			analysis.rubric.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "text-sm font-semibold",
					children: "Rubric detected"
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: analysis.rubric.map((r, idx) => /* @__PURE__ */ jsxs(Badge, {
						variant: "secondary",
						children: [r.criterion, r.marks ? ` · ${r.marks}` : ""]
					}, idx))
				})]
			}),
			analysis.tables.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "mt-5 space-y-4",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "text-sm font-semibold",
					children: "Tables analyzed"
				}), analysis.tables.map((t, idx) => /* @__PURE__ */ jsxs("div", {
					className: "overflow-x-auto rounded-lg border border-border",
					children: [t.title ? /* @__PURE__ */ jsx("p", {
						className: "border-b border-border bg-muted/50 px-3 py-2 text-xs font-semibold",
						children: t.title
					}) : null, /* @__PURE__ */ jsxs("table", {
						className: "w-full text-left text-xs",
						children: [t.headers.length > 0 && /* @__PURE__ */ jsx("thead", {
							className: "bg-muted/30",
							children: /* @__PURE__ */ jsx("tr", { children: t.headers.map((h, i) => /* @__PURE__ */ jsx("th", {
								className: "px-3 py-2 font-semibold",
								children: h
							}, i)) })
						}), /* @__PURE__ */ jsx("tbody", { children: t.rows.map((row, i) => /* @__PURE__ */ jsx("tr", {
							className: "border-t border-border/70",
							children: row.map((cell, j) => /* @__PURE__ */ jsx("td", {
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
//#endregion
//#region src/lib/docx/answer-docx.ts
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
	const doc = new Document({
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
//#endregion
//#region src/components/DownloadButton.tsx
function DownloadButton() {
	const [busy, setBusy] = useState(false);
	const [busyDocx, setBusyDocx] = useState(false);
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
			const { renderPdfPagesToImages } = await import("./pipeline-003f9P2_.js").then((n) => n.d);
			downloadDocx(await buildAnswerDocx(student, analysis, answers, originalPdf ? await renderPdfPagesToImages(originalPdf) : []), finalDocxFilename());
		} catch {
			toast.error("Word document generation failed. Please try again.");
		} finally {
			setBusyDocx(false);
		}
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-3 sm:flex-row",
		children: [/* @__PURE__ */ jsxs(Button, {
			size: "lg",
			disabled: busy,
			onClick: () => void download(),
			children: [busy ? /* @__PURE__ */ jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsx(Download, { className: "size-4" }), "Download Final PDF"]
		}), /* @__PURE__ */ jsxs(Button, {
			size: "lg",
			variant: "outline",
			disabled: busyDocx,
			onClick: () => void downloadWord(),
			children: [busyDocx ? /* @__PURE__ */ jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsx(FileText, { className: "size-4" }), "Download Word (.docx)"]
		})]
	});
}
//#endregion
//#region src/components/ui/textarea.tsx
var Textarea = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
//#endregion
//#region src/components/AnswerPreview.tsx
function AnswerPreview({ item, editing, draft, onDraftChange }) {
	const { answer, validation } = item;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			validation && /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ jsx(Badge, {
						variant: validation.passed ? "secondary" : "destructive",
						children: validation.passed ? "Validation passed" : "Validation flagged"
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "text-xs text-muted-foreground",
						children: [
							"Score: ",
							validation.score,
							"/100"
						]
					}),
					validation.issues.slice(0, 3).map((issue, i) => /* @__PURE__ */ jsxs("span", {
						className: "text-xs text-muted-foreground",
						children: ["· ", issue]
					}, i))
				]
			}),
			editing ? /* @__PURE__ */ jsx(Textarea, {
				value: draft,
				onChange: (e) => onDraftChange(e.target.value),
				className: "min-h-72 font-mono text-xs"
			}) : /* @__PURE__ */ jsx("div", {
				className: "whitespace-pre-wrap text-sm leading-relaxed",
				children: answer.answer_markdown.replace(/\*\*/g, "")
			}),
			answer.table && (answer.table.headers.length > 0 || answer.table.rows.length > 0) && /* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto rounded-lg border border-border",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-left text-xs",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "bg-muted/40",
						children: /* @__PURE__ */ jsx("tr", { children: answer.table.headers.map((h, i) => /* @__PURE__ */ jsx("th", {
							className: "px-3 py-2 font-semibold",
							children: h
						}, i)) })
					}), /* @__PURE__ */ jsx("tbody", { children: answer.table.rows.map((row, i) => /* @__PURE__ */ jsx("tr", {
						className: "border-t border-border/70",
						children: row.map((c, j) => /* @__PURE__ */ jsx("td", {
							className: "px-3 py-2 align-top",
							children: c
						}, j))
					}, i)) })]
				})
			}),
			answer.diagram && answer.diagram.nodes.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "rounded-lg border border-border bg-muted/30 p-4",
				children: [
					/* @__PURE__ */ jsxs("p", {
						className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
						children: ["Diagram · ", answer.diagram.kind]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm font-medium",
						children: answer.diagram.title
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-3 space-y-2",
						children: [...new Set(answer.diagram.nodes.map((n) => n.layer))].sort((a, b) => a - b).map((layer) => /* @__PURE__ */ jsx("div", {
							className: "flex flex-wrap justify-center gap-2",
							children: answer.diagram.nodes.filter((n) => n.layer === layer).map((n) => /* @__PURE__ */ jsx("span", {
								className: "rounded-md border border-primary/40 bg-card px-3 py-1.5 text-center text-xs font-medium text-primary",
								children: n.label
							}, n.id))
						}, layer))
					})
				]
			}),
			answer.code && answer.code.source && /* @__PURE__ */ jsxs("div", {
				className: "space-y-2",
				children: [
					answer.code.algorithm.length > 0 && /* @__PURE__ */ jsx("ol", {
						className: "list-decimal space-y-1 pl-5 text-sm",
						children: answer.code.algorithm.map((s, i) => /* @__PURE__ */ jsx("li", { children: s }, i))
					}),
					/* @__PURE__ */ jsx("pre", {
						className: "overflow-x-auto rounded-lg bg-surface-ink p-4 text-xs leading-relaxed text-primary-foreground",
						children: /* @__PURE__ */ jsx("code", { children: answer.code.source })
					}),
					(answer.code.sample_input || answer.code.sample_output) && /* @__PURE__ */ jsxs("p", {
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
//#endregion
//#region src/components/ui/accordion.tsx
var Accordion = AccordionPrimitive.Root;
var AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Item, {
	ref,
	className: cn("border-b", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, {
	className: "flex",
	children: /* @__PURE__ */ jsxs(AccordionPrimitive.Trigger, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
var AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Content, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ jsx("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
//#endregion
//#region src/components/QuestionList.tsx
function QuestionList() {
	const answers = useAssessmentStore((s) => s.answers);
	const updateAnswer = useAssessmentStore((s) => s.updateAnswer);
	const setFinalPdf = useAssessmentStore((s) => s.setFinalPdf);
	const [busy, setBusy] = useState(null);
	const [editing, setEditing] = useState(null);
	const [draft, setDraft] = useState("");
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
	return /* @__PURE__ */ jsxs("section", {
		className: "card-elevated p-6",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "font-heading text-lg font-bold",
			children: "Questions & Answers"
		}), /* @__PURE__ */ jsx(Accordion, {
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
				return /* @__PURE__ */ jsxs(AccordionItem, {
					value: `q-${index}`,
					children: [/* @__PURE__ */ jsx(AccordionTrigger, {
						className: "text-left",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex flex-1 flex-wrap items-center gap-2 pr-3",
							children: [
								/* @__PURE__ */ jsxs("span", {
									className: "font-heading font-bold",
									children: ["Q", q.question_number]
								}),
								/* @__PURE__ */ jsx("span", {
									className: "line-clamp-1 flex-1 text-sm font-normal text-muted-foreground",
									children: q.question_text
								}),
								/* @__PURE__ */ jsxs(Badge, {
									variant: "secondary",
									children: ["Marks: ", q.marks]
								}),
								q.question_type[0] && /* @__PURE__ */ jsx(Badge, {
									variant: "outline",
									children: q.question_type[0]
								}),
								q.answer_depth && /* @__PURE__ */ jsxs(Badge, {
									variant: "outline",
									children: ["Depth: ", q.answer_depth]
								}),
								artifacts.map((a) => /* @__PURE__ */ jsx(Badge, {
									variant: "outline",
									children: a
								}, a))
							]
						})
					}), /* @__PURE__ */ jsxs(AccordionContent, { children: [/* @__PURE__ */ jsx(AnswerPreview, {
						item,
						editing: editing === index,
						draft,
						onDraftChange: setDraft
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							editing === index ? /* @__PURE__ */ jsxs(Button, {
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
								children: [/* @__PURE__ */ jsx(Save, { className: "size-4" }), " Save answer"]
							}) : /* @__PURE__ */ jsxs(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => {
									setDraft(item.answer.answer_markdown);
									setEditing(index);
								},
								children: [/* @__PURE__ */ jsx(SquarePen, { className: "size-4" }), " Edit answer"]
							}),
							/* @__PURE__ */ jsxs(Button, {
								size: "sm",
								variant: "outline",
								disabled: busy === index,
								onClick: () => void regenerate(index, "answer"),
								children: [busy === index ? /* @__PURE__ */ jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsx(RefreshCw, { className: "size-4" }), "Regenerate answer"]
							}),
							(q.requires_diagram || q.requires_concept_map) && /* @__PURE__ */ jsxs(Button, {
								size: "sm",
								variant: "outline",
								disabled: busy === index,
								onClick: () => void regenerate(index, "diagram"),
								children: [/* @__PURE__ */ jsx(RefreshCw, { className: "size-4" }), " Regenerate diagram"]
							})
						]
					})] })]
				}, `${q.question_number}-${index}`);
			})
		})]
	});
}
//#endregion
//#region src/routes/preview.tsx?tsr-split=component
function PreviewPage() {
	const { analysis, answers, student, fileName } = useAssessmentStore();
	if (!analysis) return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto w-full max-w-xl px-5 py-24 text-center",
		children: [
			/* @__PURE__ */ jsx(FileStack, { className: "mx-auto size-10 text-muted-foreground" }),
			/* @__PURE__ */ jsx("h1", {
				className: "mt-4 font-heading text-2xl font-bold",
				children: "Nothing to preview yet"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Upload an assessment and generate answers first."
			}),
			/* @__PURE__ */ jsx(Button, {
				asChild: true,
				className: "mt-6",
				children: /* @__PURE__ */ jsx(Link, {
					to: "/create",
					children: "Start an assessment"
				})
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto w-full max-w-4xl px-5 py-12",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "font-heading text-3xl font-bold tracking-tight",
				children: "Answer preview"
			}), /* @__PURE__ */ jsxs("p", {
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
			})] }), /* @__PURE__ */ jsx(Button, {
				asChild: true,
				variant: "outline",
				children: /* @__PURE__ */ jsx(Link, {
					to: "/create",
					children: "New assessment"
				})
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "mt-8 space-y-6",
			children: [
				/* @__PURE__ */ jsx(AssessmentAnalysisView, { analysis }),
				/* @__PURE__ */ jsx(QuestionList, {}),
				/* @__PURE__ */ jsxs("div", {
					className: "card-elevated flex flex-col items-start gap-3 p-6",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "font-heading text-lg font-bold",
						children: "Final document"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Original assessment pages first, followed by your Times New Roman 12pt answers."
					})] }), /* @__PURE__ */ jsx(DownloadButton, {})]
				})
			]
		})]
	});
}
//#endregion
export { PreviewPage as component };
