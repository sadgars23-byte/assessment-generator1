import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LoaderCircle, Sparkles, TriangleAlert } from "lucide-react";
import { FileUploader } from "@/components/FileUploader";
import { GenerationProgress } from "@/components/GenerationProgress";
import { StudentForm } from "@/components/StudentForm";
import { Button } from "@/components/ui/button";
import { runAnalysis, runGeneration } from "@/lib/pipeline";
import { useAssessmentStore } from "@/lib/store";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create Answers — AI Assessment Generator" },
      {
        name: "description",
        content:
          "Enter your student details, upload your assessment PDF and let the AI generate validated, mark-aware answers.",
      },
      { property: "og:title", content: "Create Answers — AI Assessment Generator" },
      {
        property: "og:description",
        content: "Upload an assessment PDF and generate validated, mark-aware answers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreatePage,
});

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
      const analysed = await runAnalysis();
      if (!analysed) return;
      const done = await runGeneration();
      if (done) void navigate({ to: "/preview" });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12">
      <h1 className="font-heading text-3xl font-bold tracking-tight">Generate your answers</h1>
      <p className="mt-2 text-muted-foreground">
        Everything is processed from your uploaded assessment — nothing is invented about the paper.
      </p>

      <div className="mt-8 space-y-6">
        <StudentForm />
        <FileUploader />

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <Button size="lg" className="w-full" disabled={running} onClick={() => void start()}>
          {running ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {running ? "Working on your assessment..." : "Analyze & generate answers"}
        </Button>

        {running && <GenerationProgress />}
      </div>
    </div>
  );
}
