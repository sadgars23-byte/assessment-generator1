export type ExtractedPdf = {
  pageCount: number;
  text: string;
  perPage: string[];
};

let workerReady = false;

async function getPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  if (!workerReady) {
    const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    workerReady = true;
  }
  return pdfjs;
}

/**
 * Extracts text from EVERY page of the PDF, preserving line breaks so that
 * headings, question numbers, marks and table rows survive for the analyzer.
 */
export async function extractPdfText(bytes: Uint8Array): Promise<ExtractedPdf> {
  const pdfjs = await getPdfjs();
  const doc = await pdfjs.getDocument({ data: bytes.slice() }).promise;
  const perPage: string[] = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    let line = "";
    let lastY: number | null = null;
    const lines: string[] = [];

    for (const item of content.items) {
      if (!("str" in item)) continue;
      const y = Math.round(item.transform[5]);
      if (lastY !== null && Math.abs(y - lastY) > 3) {
        lines.push(line.trim());
        line = "";
      }
      line += item.str + (item.hasEOL ? " " : " ");
      lastY = y;
    }
    if (line.trim()) lines.push(line.trim());
    perPage.push(lines.filter(Boolean).join("\n"));
  }

  doc.cleanup();

  const text = perPage.map((p, i) => `--- Page ${i + 1} ---\n${p}`).join("\n\n");
  return { pageCount: doc.numPages, text, perPage };
}

export async function getPdfPageCount(bytes: Uint8Array): Promise<number> {
  const pdfjs = await getPdfjs();
  const doc = await pdfjs.getDocument({ data: bytes.slice() }).promise;
  const n = doc.numPages;
  doc.cleanup();
  return n;
}

export type PageImage = { data: Uint8Array; width: number; height: number };

/** Renders every page of the PDF to a PNG image (for embedding in a DOCX). */
export async function renderPdfPagesToImages(
  bytes: Uint8Array,
  scale = 2,
): Promise<PageImage[]> {
  const pdfjs = await getPdfjs();
  const doc = await pdfjs.getDocument({ data: bytes.slice() }).promise;
  const out: PageImage[] = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext("2d");
    if (!context) continue;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvas, canvasContext: context, viewport }).promise;
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png"),
    );
    if (!blob) continue;
    out.push({
      data: new Uint8Array(await blob.arrayBuffer()),
      width: canvas.width,
      height: canvas.height,
    });
  }

  doc.cleanup();
  return out;
}
