import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
  type RGB,
} from "pdf-lib";
import type {
  AssessmentAnalysis,
  DiagramSpec,
  QuestionAnswer,
  Student,
} from "@/types/assessment";

const PAGE_W = 595.28; // A4
const PAGE_H = 841.89;
const MARGIN = 56;
const BODY_SIZE = 12;
const LINE_GAP = 5.5;
const INK: RGB = rgb(0.08, 0.09, 0.13);
const MUTED: RGB = rgb(0.38, 0.4, 0.46);
const RULE: RGB = rgb(0.78, 0.8, 0.84);
const ACCENT: RGB = rgb(0.09, 0.24, 0.44);
const CODE_BG: RGB = rgb(0.955, 0.957, 0.965);

/** pdf-lib standard fonts are WinAnsi; drop anything they cannot encode. */
function sanitize(input: string): string {
  return (input ?? "")
    .replace(/[\u2018\u2019\u201B]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[\u2192\u21D2]/g, "->")
    .replace(/\u00A0/g, " ")
    .replace(/[^\x09\x0A\x0D\x20-\x7E\u00A1-\u00FF]/g, "");
}

type Word = { text: string; bold: boolean };

function tokenize(text: string): Word[] {
  const words: Word[] = [];
  let bold = false;
  for (const chunk of sanitize(text).split(/(\*\*)/g)) {
    if (chunk === "**") {
      bold = !bold;
      continue;
    }
    for (const w of chunk.split(/\s+/g)) {
      if (w) words.push({ text: w, bold });
    }
  }
  return words;
}

class AnswerDoc {
  pdf!: PDFDocument;
  page!: PDFPage;
  y = 0;
  regular!: PDFFont;
  bold!: PDFFont;
  italic!: PDFFont;
  mono!: PDFFont;

  static async create() {
    const doc = new AnswerDoc();
    doc.pdf = await PDFDocument.create();
    doc.regular = await doc.pdf.embedFont(StandardFonts.TimesRoman);
    doc.bold = await doc.pdf.embedFont(StandardFonts.TimesRomanBold);
    doc.italic = await doc.pdf.embedFont(StandardFonts.TimesRomanItalic);
    doc.mono = await doc.pdf.embedFont(StandardFonts.Courier);
    doc.addPage();
    return doc;
  }

  get width() {
    return PAGE_W - MARGIN * 2;
  }

  addPage() {
    this.page = this.pdf.addPage([PAGE_W, PAGE_H]);
    this.y = PAGE_H - MARGIN;
  }

  ensure(height: number) {
    if (this.y - height < MARGIN + 24) this.addPage();
  }

  space(h: number) {
    this.y -= h;
  }

  text(
    value: string,
    opts: {
      size?: number;
      font?: PDFFont;
      color?: RGB;
      x?: number;
      align?: "left" | "center" | "right";
    } = {},
  ) {
    const size = opts.size ?? BODY_SIZE;
    const font = opts.font ?? this.regular;
    const clean = sanitize(value);
    const w = font.widthOfTextAtSize(clean, size);
    let x = opts.x ?? MARGIN;
    if (opts.align === "center") x = (PAGE_W - w) / 2;
    if (opts.align === "right") x = PAGE_W - MARGIN - w;
    this.ensure(size + LINE_GAP);
    this.page.drawText(clean, { x, y: this.y - size, size, font, color: opts.color ?? INK });
    this.y -= size + LINE_GAP;
  }

  /** Justified, word-wrapped paragraph with inline bold support. */
  paragraph(
    markdown: string,
    opts: { indent?: number; size?: number; justify?: boolean; color?: RGB } = {},
  ) {
    const size = opts.size ?? BODY_SIZE;
    const indent = opts.indent ?? 0;
    const justify = opts.justify ?? true;
    const maxWidth = this.width - indent;
    const words = tokenize(markdown);
    if (!words.length) return;

    const spaceW = this.regular.widthOfTextAtSize(" ", size);
    let line: Word[] = [];
    let lineW = 0;

    const flush = (last: boolean) => {
      if (!line.length) return;
      this.ensure(size + LINE_GAP);
      const gaps = line.length - 1;
      const extra = justify && !last && gaps > 0 ? (maxWidth - lineW - gaps * spaceW) / gaps : 0;
      let x = MARGIN + indent;
      for (const word of line) {
        const font = word.bold ? this.bold : this.regular;
        this.page.drawText(word.text, {
          x,
          y: this.y - size,
          size,
          font,
          color: opts.color ?? INK,
        });
        x += font.widthOfTextAtSize(word.text, size) + spaceW + extra;
      }
      this.y -= size + LINE_GAP;
      line = [];
      lineW = 0;
    };

    for (const word of words) {
      const font = word.bold ? this.bold : this.regular;
      const w = font.widthOfTextAtSize(word.text, size);
      const projected = lineW + (line.length ? spaceW : 0) + w;
      if (line.length && projected > maxWidth) flush(false);
      lineW += (line.length ? spaceW : 0) + w;
      line.push(word);
    }
    flush(true);
  }

  rule(color: RGB = RULE) {
    this.ensure(10);
    this.page.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: PAGE_W - MARGIN, y: this.y },
      thickness: 0.8,
      color,
    });
    this.y -= 10;
  }
}

function renderMarkdown(doc: AnswerDoc, markdown: string) {
  const blocks = sanitize(markdown).split(/\n/);
  let paragraph: string[] = [];

  const flush = () => {
    if (paragraph.length) {
      doc.paragraph(paragraph.join(" "));
      doc.space(4);
      paragraph = [];
    }
  };

  let inFence = false;
  for (const raw of blocks) {
    const line = raw.trimEnd();
    if (/^\s*```/.test(line)) {
      flush();
      inFence = !inFence;
      doc.space(3);
      continue;
    }
    if (inFence) {
      doc.ensure(16);
      doc.text(line.replace(/\t/g, "    ") || " ", { font: doc.mono, size: BODY_SIZE - 2 });
      continue;
    }
    if (!line.trim()) {
      flush();
      continue;
    }
    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    const numbered = line.match(/^\s*(\d+[.)])\s+(.*)$/);
    const mathLine = /^\s{2,}\S/.test(raw) || /[=+×÷√∑]/.test(line);


    if (heading) {
      flush();
      doc.space(4);
      doc.ensure(28);
      doc.text((heading[2] ?? "").replace(/\*\*/g, ""), { font: doc.bold, size: BODY_SIZE });
      doc.space(1);
    } else if (bullet) {
      flush();
      doc.ensure(20);
      const yBefore = doc.y;
      doc.page.drawCircle({ x: MARGIN + 6, y: yBefore - BODY_SIZE / 2 - 1, size: 1.6, color: INK });
      doc.paragraph(bullet[1] ?? "", { indent: 16, justify: false });
      doc.space(1.5);
    } else if (numbered) {
      flush();
      doc.ensure(20);
      const yBefore = doc.y;
      doc.page.drawText(numbered[1] ?? "", {
        x: MARGIN,
        y: yBefore - BODY_SIZE,
        size: BODY_SIZE,
        font: doc.regular,
        color: INK,
      });
      doc.paragraph(numbered[2] ?? "", { indent: 20, justify: false });
      doc.space(1.5);
    } else if (mathLine) {
      flush();
      doc.paragraph(line.trim(), { justify: false });
      doc.space(2);
    } else {
      paragraph.push(line.trim());
    }

  }
  flush();
}

function renderTable(
  doc: AnswerDoc,
  table: { title: string; headers: string[]; rows: string[][] },
) {
  if (!table.headers.length && !table.rows.length) return;
  const cols = Math.max(table.headers.length, ...table.rows.map((r) => r.length), 1);
  const colW = doc.width / cols;
  const size = 10.5;

  if (table.title) {
    doc.space(4);
    doc.text(table.title, { font: doc.italic, size: 11, color: INK });
  }

  const drawRow = (cells: string[], bold: boolean) => {
    const wrapped = Array.from({ length: cols }, (_, i) =>
      wrapText(sanitize(cells[i] ?? ""), bold ? doc.bold : doc.regular, size, colW - 10),
    );
    const rowH = Math.max(...wrapped.map((w) => w.length)) * (size + 3) + 8;
    doc.ensure(rowH + 4);
    const top = doc.y;
    if (bold) {
      doc.page.drawRectangle({
        x: MARGIN,
        y: top - rowH,
        width: doc.width,
        height: rowH,
        color: CODE_BG,
      });
    }
    wrapped.forEach((lines, i) => {
      lines.forEach((ln, j) => {
        doc.page.drawText(ln, {
          x: MARGIN + i * colW + 5,
          y: top - 6 - size - j * (size + 3),
          size,
          font: bold ? doc.bold : doc.regular,
          color: INK,
        });
      });
    });
    doc.page.drawRectangle({
      x: MARGIN,
      y: top - rowH,
      width: doc.width,
      height: rowH,
      borderColor: RULE,
      borderWidth: 0.6,
    });
    for (let i = 1; i < cols; i++) {
      doc.page.drawLine({
        start: { x: MARGIN + i * colW, y: top },
        end: { x: MARGIN + i * colW, y: top - rowH },
        thickness: 0.6,
        color: RULE,
      });
    }
    doc.y = top - rowH;
  };

  if (table.headers.length) drawRow(table.headers, true);
  for (const row of table.rows) drawRow(row, false);
  doc.space(8);
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function renderDiagram(doc: AnswerDoc, diagram: DiagramSpec) {
  if (!diagram.nodes.length) return;
  const size = 9;
  const layers = new Map<number, typeof diagram.nodes>();
  diagram.nodes.forEach((n) => {
    const list = layers.get(n.layer) ?? [];
    list.push(n);
    layers.set(n.layer, list);
  });
  const layerKeys = [...layers.keys()].sort((a, b) => a - b);
  const boxH = 34;
  const vGap = 30;
  const totalH = layerKeys.length * boxH + (layerKeys.length - 1) * vGap + 34;

  doc.space(6);
  doc.ensure(totalH + 20);
  if (diagram.title) {
    doc.text(`Figure: ${diagram.title}`, { font: doc.italic, size: 11, color: INK });
  }

  const top = doc.y - 6;
  const positions = new Map<string, { x: number; y: number; w: number }>();

  layerKeys.forEach((key, li) => {
    const nodes = layers.get(key)!;
    const gap = 14;
    const boxW = Math.min(160, (doc.width - gap * (nodes.length - 1)) / nodes.length);
    const rowW = nodes.length * boxW + gap * (nodes.length - 1);
    let x = MARGIN + (doc.width - rowW) / 2;
    const y = top - li * (boxH + vGap);
    for (const node of nodes) {
      doc.page.drawRectangle({
        x,
        y: y - boxH,
        width: boxW,
        height: boxH,
        color: rgb(0.96, 0.97, 1),
        borderColor: ACCENT,
        borderWidth: 0.9,
      });
      const lines = wrapText(sanitize(node.label), doc.regular, size, boxW - 8).slice(0, 2);
      lines.forEach((ln, i) => {
        const w = doc.regular.widthOfTextAtSize(ln, size);
        doc.page.drawText(ln, {
          x: x + (boxW - w) / 2,
          y: y - boxH / 2 - size / 2 + (lines.length === 2 ? (i === 0 ? 5 : -5) : 0),
          size,
          font: doc.regular,
          color: INK,
        });
      });
      positions.set(node.id, { x: x + boxW / 2, y, w: boxW });
      x += boxW + gap;
    }
  });

  for (const edge of diagram.edges) {
    const a = positions.get(edge.from);
    const b = positions.get(edge.to);
    if (!a || !b) continue;
    const start = { x: a.x, y: a.y - boxH };
    const end = { x: b.x, y: b.y };
    doc.page.drawLine({ start, end, thickness: 0.8, color: MUTED });
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    doc.page.drawLine({
      start: end,
      end: { x: end.x - ux * 6 - uy * 3, y: end.y - uy * 6 + ux * 3 },
      thickness: 0.8,
      color: MUTED,
    });
    doc.page.drawLine({
      start: end,
      end: { x: end.x - ux * 6 + uy * 3, y: end.y - uy * 6 - ux * 3 },
      thickness: 0.8,
      color: MUTED,
    });
    if (edge.label) {
      const label = sanitize(edge.label).slice(0, 24);
      doc.page.drawText(label, {
        x: (start.x + end.x) / 2 + 4,
        y: (start.y + end.y) / 2,
        size: 8,
        font: doc.italic,
        color: INK,
      });
    }
  }

  doc.y = top - (layerKeys.length - 1) * (boxH + vGap) - boxH - 16;
}

function renderCode(doc: AnswerDoc, code: NonNullable<QuestionAnswer["answer"]["code"]>) {
  if (code.algorithm.length) {
    doc.space(4);
    doc.text("Algorithm", { font: doc.bold });
    code.algorithm.forEach((step, i) => doc.paragraph(`${i + 1}. ${step}`, { justify: false }));
    doc.space(4);
  }
  if (code.source.trim()) {
    doc.text(`Program${code.language ? ` (${code.language})` : ""}`, { font: doc.bold });
    const size = 9.5;
    const lines = sanitize(code.source)
      .split("\n")
      .flatMap((l) => wrapText(l.replace(/\t/g, "    "), doc.mono, size, doc.width - 20) || [""]);
    for (const line of lines) {
      doc.ensure(size + 4);
      doc.page.drawRectangle({
        x: MARGIN,
        y: doc.y - size - 3,
        width: doc.width,
        height: size + 5,
        color: CODE_BG,
      });
      doc.page.drawText(line, {
        x: MARGIN + 8,
        y: doc.y - size,
        size,
        font: doc.mono,
        color: INK,
      });
      doc.y -= size + 4;
    }
    doc.space(6);
  }
  if (code.sample_input || code.sample_output) {
    doc.text("Sample input / output", { font: doc.bold });
    if (code.sample_input) doc.paragraph(`Input: ${code.sample_input}`, { justify: false });
    if (code.sample_output) doc.paragraph(`Output: ${code.sample_output}`, { justify: false });
    doc.space(4);
  }
  if (code.explanation) {
    doc.text("Explanation", { font: doc.bold });
    doc.paragraph(code.explanation);
    doc.space(4);
  }
}

export async function buildAnswerPdf(
  student: Student,
  analysis: AssessmentAnalysis,
  answers: QuestionAnswer[],
): Promise<Uint8Array> {
  const doc = await AnswerDoc.create();


  const meta: [string, string][] = [
    ["Student Name", student.name],
    ["Registration Number", student.registrationNumber],
    ["Course", analysis.course_name],
    ["Course Code", analysis.course_code],
    ["Assessment", analysis.assessment_type],
    ["Institution", analysis.institution],
    ["Course Outcome", analysis.course_outcomes.join(", ")],
    ["Taxonomy", analysis.taxonomy],
    ["Total Marks", analysis.total_marks ? String(analysis.total_marks) : ""],
  ];
  for (const [label, value] of meta) {
    if (!value?.trim()) continue;
    doc.ensure(18);
    const y = doc.y;
    doc.page.drawText(sanitize(`${label}:`), {
      x: MARGIN,
      y: y - BODY_SIZE,
      size: BODY_SIZE,
      font: doc.bold,
      color: INK,
    });
    doc.page.drawText(sanitize(value), {
      x: MARGIN + 150,
      y: y - BODY_SIZE,
      size: BODY_SIZE,
      font: doc.regular,
      color: INK,
    });
    doc.y -= BODY_SIZE + LINE_GAP;
  }
  doc.space(6);
  doc.rule();
  doc.space(8);

  let currentSection = "";
  for (const item of answers) {
    const q = item.question;
    if (q.section && q.section !== currentSection) {
      currentSection = q.section;
      doc.space(6);
      doc.ensure(30);
      doc.text(currentSection.toUpperCase(), { font: doc.bold, size: 13, color: INK });
      doc.space(4);
    }

    doc.ensure(90);
    doc.space(6);
    doc.text(`Question ${q.question_number}`, { font: doc.bold, size: 12.5, color: INK });
    doc.paragraph(q.question_text, { justify: false });
    doc.space(4);
    doc.text("Answer", { font: doc.bold });
    doc.space(2);

    renderMarkdown(doc, item.answer.answer_markdown);
    if (item.answer.table) renderTable(doc, item.answer.table);
    if (item.answer.diagram) renderDiagram(doc, item.answer.diagram);
    if (item.answer.code) renderCode(doc, item.answer.code);

    doc.space(6);
    doc.rule();
  }

  // Page numbers
  const pages = doc.pdf.getPages();
  pages.forEach((page, i) => {
    const label = `Answers - Page ${i + 1} of ${pages.length}`;
    const w = doc.regular.widthOfTextAtSize(label, 9);
    page.drawText(label, {
      x: (PAGE_W - w) / 2,
      y: 26,
      size: 9,
      font: doc.regular,
      color: INK,
    });
  });

  return doc.pdf.save();
}
