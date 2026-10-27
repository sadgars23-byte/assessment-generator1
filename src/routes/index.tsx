import { createFileRoute, Link } from "@tanstack/react-router";
import { BrainCircuit, FileCheck2, FileStack, ScanText, ShieldCheck, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Assessment Generator — Answer Any Assessment PDF" },
      {
        name: "description",
        content:
          "Upload an assessment PDF and get structured, mark-aware answers with diagrams, code and a Times New Roman answer document merged with the original.",
      },
      { property: "og:title", content: "AI Assessment Generator" },
      {
        property: "og:description",
        content:
          "Upload an assessment PDF and get mark-aware answers, diagrams and code in one professionally formatted document.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const features = [
  {
    icon: ScanText,
    title: "Deep structure analysis",
    body: "Course details, sections, tables, rubrics, marks and internal choices are read from your PDF.",
  },
  {
    icon: BrainCircuit,
    title: "Mark-aware answers",
    body: "Answer depth follows the marks and taxonomy level of every single question.",
  },
  {
    icon: Workflow,
    title: "Diagrams & code",
    body: "Flowcharts and concept maps are drawn, and programming questions get runnable solutions.",
  },
  {
    icon: ShieldCheck,
    title: "Validation pass",
    body: "Every answer is checked against the question requirements before it reaches your document.",
  },
  {
    icon: FileCheck2,
    title: "Times New Roman, 12pt",
    body: "Justified academic formatting with headings, tables, page numbers and a cover page.",
  },
  {
    icon: FileStack,
    title: "Merged output",
    body: "The original assessment stays first, your answers follow — one clean PDF to submit.",
  },
];

function Home() {
  return (
    <div>
      <section className="border-b border-border bg-gradient-parchment">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
          <div>
            <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Academic answer engine
            </span>
            <h1 className="mt-5 font-heading text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
              Turn any assessment PDF into a complete, submission-ready answer document
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              Enter your details, upload the assessment, and the AI reads its structure, marks and
              rubric to write answers at exactly the right depth — then hands you the original and
              the answers merged into a single PDF.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/create">Start an assessment</Link>
              </Button>
            </div>
          </div>
          <div className="card-elevated p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              How it works
            </p>
            <ol className="mt-4 space-y-4">
              {[
                "Enter student name and registration number",
                "Upload the assessment PDF",
                "AI analyses structure, marks and rubric",
                "Answers, diagrams and code are generated and validated",
                "Download the original plus answers as one PDF",
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <h2 className="font-heading text-3xl font-bold tracking-tight">Built for real coursework</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card-elevated p-6">
              <f.icon className="size-6 text-primary" />
              <h3 className="mt-4 font-heading text-base font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
