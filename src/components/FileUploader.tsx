import { useRef, useState } from "react";
import { FileText, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes, useAssessmentStore } from "@/lib/store";

export function FileUploader() {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { fileName, fileSize, pageCount, setFile, clearFile, setError } = useAssessmentStore();

  async function accept(file: File | undefined) {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a valid PDF assessment.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError("This PDF is larger than the 25 MB limit.");
      return;
    }
    setError(null);
    const bytes = new Uint8Array(await file.arrayBuffer());
    setFile({ name: file.name, size: file.size, bytes });
  }

  return (
    <section className="card-elevated p-6">
      <h2 className="font-heading text-lg font-bold">Upload Assessment</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        The original pages are preserved and placed first in the final PDF.
      </p>

      {!fileName ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            void accept(e.dataTransfer.files[0]);
          }}
          className={`mt-5 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
            dragging ? "border-primary bg-secondary" : "border-border bg-muted/40"
          }`}
        >
          <UploadCloud className="size-8 text-muted-foreground" />
          <p className="mt-3 font-medium">Drag assessment PDF here</p>
          <p className="my-2 text-xs uppercase tracking-widest text-muted-foreground">or</p>
          <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
            Choose PDF
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => void accept(e.target.files?.[0])}
          />
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-4 rounded-xl border border-border bg-muted/40 p-4">
          <FileText className="size-8 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{fileName}</p>
            <p className="text-sm text-muted-foreground">
              {formatBytes(fileSize)}
              {pageCount ? ` · ${pageCount} page${pageCount > 1 ? "s" : ""}` : ""}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={clearFile}>
            <Trash2 className="size-4" /> Remove
          </Button>
        </div>
      )}
    </section>
  );
}
