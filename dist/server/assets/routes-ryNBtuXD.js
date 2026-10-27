import { t as Button } from "./button-DRsC1qZi.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { BrainCircuit, FileCheck2, FileStack, ScanText, ShieldCheck, Workflow } from "lucide-react";
//#region src/routes/index.tsx?tsr-split=component
var features = [
	{
		icon: ScanText,
		title: "Deep structure analysis",
		body: "Course details, sections, tables, rubrics, marks and internal choices are read from your PDF."
	},
	{
		icon: BrainCircuit,
		title: "Mark-aware answers",
		body: "Answer depth follows the marks and taxonomy level of every single question."
	},
	{
		icon: Workflow,
		title: "Diagrams & code",
		body: "Flowcharts and concept maps are drawn, and programming questions get runnable solutions."
	},
	{
		icon: ShieldCheck,
		title: "Validation pass",
		body: "Every answer is checked against the question requirements before it reaches your document."
	},
	{
		icon: FileCheck2,
		title: "Times New Roman, 12pt",
		body: "Justified academic formatting with headings, tables, page numbers and a cover page."
	},
	{
		icon: FileStack,
		title: "Merged output",
		body: "The original assessment stays first, your answers follow — one clean PDF to submit."
	}
];
function Home() {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("section", {
		className: "border-b border-border bg-gradient-parchment",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28",
			children: [/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("span", {
					className: "inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground",
					children: "Academic answer engine"
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "mt-5 font-heading text-4xl leading-tight font-bold tracking-tight sm:text-5xl",
					children: "Turn any assessment PDF into a complete, submission-ready answer document"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-5 max-w-xl text-base leading-relaxed text-muted-foreground",
					children: "Enter your details, upload the assessment, and the AI reads its structure, marks and rubric to write answers at exactly the right depth — then hands you the original and the answers merged into a single PDF."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-8 flex flex-wrap gap-3",
					children: /* @__PURE__ */ jsx(Button, {
						asChild: true,
						size: "lg",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/create",
							children: "Start an assessment"
						})
					})
				})
			] }), /* @__PURE__ */ jsxs("div", {
				className: "card-elevated p-6",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
					children: "How it works"
				}), /* @__PURE__ */ jsx("ol", {
					className: "mt-4 space-y-4",
					children: [
						"Enter student name and registration number",
						"Upload the assessment PDF",
						"AI analyses structure, marks and rubric",
						"Answers, diagrams and code are generated and validated",
						"Download the original plus answers as one PDF"
					].map((step, i) => /* @__PURE__ */ jsxs("li", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ jsx("span", {
							className: "flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground",
							children: i + 1
						}), /* @__PURE__ */ jsx("span", {
							className: "pt-1 text-sm",
							children: step
						})]
					}, i))
				})]
			})]
		})
	}), /* @__PURE__ */ jsxs("section", {
		className: "mx-auto w-full max-w-6xl px-5 py-20",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "font-heading text-3xl font-bold tracking-tight",
			children: "Built for real coursework"
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
			children: features.map((f) => /* @__PURE__ */ jsxs("div", {
				className: "card-elevated p-6",
				children: [
					/* @__PURE__ */ jsx(f.icon, { className: "size-6 text-primary" }),
					/* @__PURE__ */ jsx("h3", {
						className: "mt-4 font-heading text-base font-bold",
						children: f.title
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-sm leading-relaxed text-muted-foreground",
						children: f.body
					})
				]
			}, f.title))
		})]
	})] });
}
//#endregion
export { Home as component };
