import { PDFDocument } from "pdf-lib";

/**
 * Final PDF = original assessment pages (copied verbatim, unchanged) followed by
 * the AI generated answer pages.
 */
export async function mergeAssessmentAndAnswers(
  originalPdf: Uint8Array,
  answerPdf: Uint8Array,
): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  const original = await PDFDocument.load(originalPdf.slice(), { ignoreEncryption: true });
  const answers = await PDFDocument.load(answerPdf.slice());

  const originalPages = await out.copyPages(original, original.getPageIndices());
  originalPages.forEach((p) => out.addPage(p));

  const answerPages = await out.copyPages(answers, answers.getPageIndices());
  answerPages.forEach((p) => out.addPage(p));

  return out.save();
}

export function sanitizeFilename(value: string): string {
  return (
    value
      .normalize("NFKD")
      .replace(/[^\w.-]+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "")
      .slice(0, 60) || "Student"
  );
}

export function downloadPdf(bytes: Uint8Array, filename: string) {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  const url = URL.createObjectURL(new Blob([buffer], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
