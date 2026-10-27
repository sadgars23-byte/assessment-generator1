import { createFileRoute, Link } from "@tanstack/react-router";
import { FileStack } from "lucide-react";
import { AssessmentAnalysisView } from "@/components/AssessmentAnalysis";
import { DownloadButton } from "@/components/DownloadButton";
import { QuestionList } from "@/components/QuestionList";
import { Button } from "@/components/ui/button";
import { useAssessmentStore } from "@/lib/store";

export const Route = createFileRoute("/preview")({
  head: () => ({
    meta: [
      { title: "Answer Preview — AI Assessment Generator" },
      {
        name: "description",
        content:
          "Review the analysed assessment, edit or regenerate answers, and download the merged final PDF.",
      },
      { property: "og:title", content: "Answer Preview — AI Assessment Generator" },
      {
        property: "og:description",
        content: "Review generated answers and download the merged final assessment PDF.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PreviewPage,
});

function PreviewPage() {
  const { analysis, answers, student, fileName } = useAssessmentStore();

  if (!analysis) {
    return (
      <div className="mx-auto w-full max-w-xl px-5 py-24 text-center">
        <FileStack className="mx-auto size-10 text-muted-foreground" />
        <h1 className="mt-4 font-heading text-2xl font-bold">Nothing to preview yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Upload an assessment and generate answers first.
        </p>
        <Button asChild className="mt-6">
          <Link to="/create">Start an assessment</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Answer preview</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {student.name} · {student.registrationNumber} · {fileName} · {answers.length} answers
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/create">New assessment</Link>
        </Button>
      </div>

      <div className="mt-8 space-y-6">
        <AssessmentAnalysisView analysis={analysis} />
        <QuestionList />
        <div className="card-elevated flex flex-col items-start gap-3 p-6">
          <div>
            <h2 className="font-heading text-lg font-bold">Final document</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Original assessment pages first, followed by your Times New Roman 12pt answers.
            </p>
          </div>
          <DownloadButton />
        </div>
      </div>
    </div>
  );
}
