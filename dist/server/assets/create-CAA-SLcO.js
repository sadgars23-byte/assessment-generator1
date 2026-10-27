import { a as runAnalysis, c as PIPELINE_STEPS, l as formatBytes, o as runGeneration, u as useAssessmentStore } from "./pipeline-003f9P2_.js";
import { n as cn, t as Button } from "./button-DRsC1qZi.js";
import * as React from "react";
import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Check, CircleDashed, FileText, LoaderCircle, Sparkles, Trash2, TriangleAlert, UploadCloud } from "lucide-react";
import { cva } from "class-variance-authority";
import * as LabelPrimitive from "@radix-ui/react-label";
//#region src/components/FileUploader.tsx
function FileUploader() {
	const [dragging, setDragging] = useState(false);
	const inputRef = useRef(null);
	const { fileName, fileSize, pageCount, setFile, clearFile, setError } = useAssessmentStore();
	async function accept(file) {
		if (!file) return;
		if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
			setError("Please upload a valid PDF assessment.");
			return;
		}
		if (file.size > 26214400) {
			setError("This PDF is larger than the 25 MB limit.");
			return;
		}
		setError(null);
		const bytes = new Uint8Array(await file.arrayBuffer());
		setFile({
			name: file.name,
			size: file.size,
			bytes
		});
	}
	return /* @__PURE__ */ jsxs("section", {
		className: "card-elevated p-6",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "font-heading text-lg font-bold",
				children: "Upload Assessment"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "The original pages are preserved and placed first in the final PDF."
			}),
			!fileName ? /* @__PURE__ */ jsxs("div", {
				onDragOver: (e) => {
					e.preventDefault();
					setDragging(true);
				},
				onDragLeave: () => setDragging(false),
				onDrop: (e) => {
					e.preventDefault();
					setDragging(false);
					accept(e.dataTransfer.files[0]);
				},
				className: `mt-5 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors ${dragging ? "border-primary bg-secondary" : "border-border bg-muted/40"}`,
				children: [
					/* @__PURE__ */ jsx(UploadCloud, { className: "size-8 text-muted-foreground" }),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 font-medium",
						children: "Drag assessment PDF here"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "my-2 text-xs uppercase tracking-widest text-muted-foreground",
						children: "or"
					}),
					/* @__PURE__ */ jsx(Button, {
						type: "button",
						variant: "secondary",
						onClick: () => inputRef.current?.click(),
						children: "Choose PDF"
					}),
					/* @__PURE__ */ jsx("input", {
						ref: inputRef,
						type: "file",
						accept: ".pdf,application/pdf",
						className: "hidden",
						onChange: (e) => void accept(e.target.files?.[0])
					})
				]
			}) : /* @__PURE__ */ jsxs("div", {
				className: "mt-5 flex items-center gap-4 rounded-xl border border-border bg-muted/40 p-4",
				children: [
					/* @__PURE__ */ jsx(FileText, { className: "size-8 shrink-0 text-primary" }),
					/* @__PURE__ */ jsxs("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ jsx("p", {
							className: "truncate font-medium",
							children: fileName
						}), /* @__PURE__ */ jsxs("p", {
							className: "text-sm text-muted-foreground",
							children: [formatBytes(fileSize), pageCount ? ` · ${pageCount} page${pageCount > 1 ? "s" : ""}` : ""]
						})]
					}),
					/* @__PURE__ */ jsxs(Button, {
						variant: "ghost",
						size: "sm",
						onClick: clearFile,
						children: [/* @__PURE__ */ jsx(Trash2, { className: "size-4" }), " Remove"]
					})
				]
			})
		]
	});
}
//#endregion
//#region src/components/GenerationProgress.tsx
function GenerationProgress() {
	const steps = useAssessmentStore((s) => s.steps);
	const note = useAssessmentStore((s) => s.progressNote);
	return /* @__PURE__ */ jsxs("section", {
		className: "card-elevated p-6",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "font-heading text-lg font-bold",
				children: "Progress"
			}),
			note ? /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: note
			}) : null,
			/* @__PURE__ */ jsx("ul", {
				className: "mt-4 space-y-1.5",
				children: PIPELINE_STEPS.map((step) => {
					const state = steps[step.id] ?? "pending";
					return /* @__PURE__ */ jsxs("li", {
						className: "flex items-center gap-3 text-sm",
						children: [
							state === "done" && /* @__PURE__ */ jsx(Check, { className: "size-4 text-success" }),
							state === "active" && /* @__PURE__ */ jsx(LoaderCircle, { className: "size-4 animate-spin text-primary" }),
							state === "pending" && /* @__PURE__ */ jsx(CircleDashed, { className: "size-4 text-muted-foreground/60" }),
							state === "error" && /* @__PURE__ */ jsx(TriangleAlert, { className: "size-4 text-destructive" }),
							/* @__PURE__ */ jsx("span", {
								className: state === "pending" ? "text-muted-foreground" : state === "error" ? "text-destructive" : "text-foreground",
								children: step.label
							})
						]
					}, step.id);
				})
			})
		]
	});
}
//#endregion
//#region src/components/ui/input.tsx
var Input = React.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ jsx("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
//#endregion
//#region src/components/ui/label.tsx
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(LabelPrimitive.Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = LabelPrimitive.Root.displayName;
//#endregion
//#region src/components/StudentForm.tsx
function StudentForm() {
	const student = useAssessmentStore((s) => s.student);
	const setStudent = useAssessmentStore((s) => s.setStudent);
	return /* @__PURE__ */ jsxs("section", {
		className: "card-elevated p-6",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "font-heading text-lg font-bold",
				children: "Student Information"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "These details appear on the generated answer document."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-5 grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ jsx(Label, {
						htmlFor: "student-name",
						children: "Student Name"
					}), /* @__PURE__ */ jsx(Input, {
						id: "student-name",
						placeholder: "Enter student name",
						value: student.name,
						onChange: (e) => setStudent({
							...student,
							name: e.target.value
						}),
						required: true
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ jsx(Label, {
						htmlFor: "student-reg",
						children: "Registration Number"
					}), /* @__PURE__ */ jsx(Input, {
						id: "student-reg",
						placeholder: "Enter registration number",
						value: student.registrationNumber,
						onChange: (e) => setStudent({
							...student,
							registrationNumber: e.target.value
						}),
						required: true
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/routes/create.tsx?tsr-split=component
function CreatePage() {
	const navigate = useNavigate();
	const [running, setRunning] = useState(false);
	const { student, originalPdf, error, setError } = useAssessmentStore();
	const ready = student.name.trim() && student.registrationNumber.trim() && originalPdf;
	async function start() {
		if (!ready) {
			setError("Enter your name, registration number and upload the assessment PDF.");
			return;
		}
		setRunning(true);
		try {
			if (!await runAnalysis()) return;
			if (await runGeneration()) navigate({ to: "/preview" });
		} finally {
			setRunning(false);
		}
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto w-full max-w-3xl px-5 py-12",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "font-heading text-3xl font-bold tracking-tight",
				children: "Generate your answers"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-muted-foreground",
				children: "Everything is processed from your uploaded assessment — nothing is invented about the paper."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-8 space-y-6",
				children: [
					/* @__PURE__ */ jsx(StudentForm, {}),
					/* @__PURE__ */ jsx(FileUploader, {}),
					error && /* @__PURE__ */ jsxs("div", {
						className: "flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive",
						children: [/* @__PURE__ */ jsx(TriangleAlert, { className: "mt-0.5 size-4 shrink-0" }), /* @__PURE__ */ jsx("p", { children: error })]
					}),
					/* @__PURE__ */ jsxs(Button, {
						size: "lg",
						className: "w-full",
						disabled: running,
						onClick: () => void start(),
						children: [running ? /* @__PURE__ */ jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsx(Sparkles, { className: "size-4" }), running ? "Working on your assessment..." : "Analyze & generate answers"]
					}),
					running && /* @__PURE__ */ jsx(GenerationProgress, {})
				]
			})
		]
	});
}
//#endregion
export { CreatePage as component };
