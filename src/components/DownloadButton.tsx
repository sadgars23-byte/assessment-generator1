import { useState } from "react";
import { Download, FileText, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { buildFinalPdf, finalFilename, finalDocxFilename } from "@/lib/pipeline";
import { downloadPdf } from "@/lib/pdf/merge";
import { buildAnswerDocx, downloadDocx } from "@/lib/docx/answer-docx";
import { useAssessmentStore } from "@/lib/store";

export function DownloadButton() {
  const [busy, setBusy] = useState(false);
  const [busyDocx, setBusyDocx] = useState(false);
  const finalPdf = useAssessmentStore((s) => s.finalPdf);

  async function download() {
    setBusy(true);
    try {
      let bytes = finalPdf;
      if (!bytes) {
        const ok = await buildFinalPdf();
        if (!ok) throw new Error("build failed");
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
      const { renderPdfPagesToImages } = await import("@/lib/pdf/extract");
      const pages = originalPdf ? await renderPdfPagesToImages(originalPdf) : [];
      const bytes = await buildAnswerDocx(student, analysis, answers, pages);
      downloadDocx(bytes, finalDocxFilename());
    } catch {
      toast.error("Word document generation failed. Please try again.");
    } finally {
      setBusyDocx(false);
    }
  }


  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button size="lg" disabled={busy} onClick={() => void download()}>
        {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Download className="size-4" />}
        Download Final PDF
      </Button>
      <Button
        size="lg"
        variant="outline"
        disabled={busyDocx}
        onClick={() => void downloadWord()}
      >
        {busyDocx ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <FileText className="size-4" />
        )}
        Download Word (.docx)
      </Button>
    </div>
  );
}
