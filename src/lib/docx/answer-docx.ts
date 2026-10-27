import {
  AlignmentType,
  Document,
  HeadingLevel,
  ImageRun,
  LevelFormat,
  PageBreak,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  BorderStyle,
} from "docx";
import type { PageImage } from "@/lib/pdf/extract";
import type { AssessmentAnalysis, QuestionAnswer, Student } from "@/types/assessment";


const FONT = "Times New Roman";
const SIZE = 24; // 12pt (half-points)
const BLACK = "000000";
const CONTENT_W = 9026; // A4 with 1" margins

function runs(markdown: string, opts: { bold?: boolean; font?: string; size?: number } = {}) {
  const parts = (markdown ?? "").split(/(\*\*)/g);
  let bold = opts.bold ?? false;
  const out: TextRun[] = [];
  for (const part of parts) {
    if (part === "**") {
      bold = !bold;
      continue;
    }
    if (!part) continue;
    out.push(
      new TextRun({
        text: part,
        bold,
        color: BLACK,
        font: opts.font ?? FONT,
        size: opts.size ?? SIZE,
      }),
    );
  }
  return out.length ? out : [new TextRun({ text: "", color: BLACK, font: FONT, size: SIZE })];
}

function body(markdown: string, extra: Record<string, unknown> = {}) {
  return new Paragraph({ children: runs(markdown), spacing: { after: 120 }, ...extra });
}

function heading(text: string, size = SIZE) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, color: BLACK, font: FONT, size })],
    spacing: { before: 200, after: 120 },
  });
}

function markdownParagraphs(markdown: string): Paragraph[] {
  const out: Paragraph[] = [];
  let buffer: string[] = [];
  const flush = () => {
    if (buffer.length) {
      out.push(body(buffer.join(" ")));
      buffer = [];
    }
  };
  let inFence = false;
  for (const raw of (markdown ?? "").split(/\n/)) {
    const line = raw.trim();
    if (/^```/.test(line)) {
      flush();
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      out.push(
        new Paragraph({
          spacing: { after: 0 },
          children: [
            new TextRun({
              text: raw.replace(/\t/g, "    ") || " ",
              font: "Courier New",
              size: 20,
              color: BLACK,
            }),
          ],
        }),
      );
      continue;
    }
    if (!line) {
      flush();
      continue;
    }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    const bullet = line.match(/^[-*]\s+(.*)$/);
    const numbered = line.match(/^(\d+[.)])\s+(.*)$/);
    const mathLine = /^\s{2,}\S/.test(raw) || /[=+×÷√∑]/.test(line);
    if (h) {
      flush();
      out.push(heading((h[2] ?? "").replace(/\*\*/g, "")));
    } else if (bullet) {
      flush();
      out.push(
        new Paragraph({
          children: runs(bullet[1] ?? ""),
          numbering: { reference: "answer-bullets", level: 0 },
          spacing: { after: 60 },
        }),
      );
    } else if (numbered) {
      flush();
      out.push(
        new Paragraph({
          children: runs(`${numbered[1]} ${numbered[2]}`),
          indent: { left: 360 },
          spacing: { after: 60 },
        }),
      );
    } else if (mathLine) {
      flush();
      out.push(body(line));
    } else {
      buffer.push(line);
    }
  }

  flush();
  return out;
}

function docTable(table: { title: string; headers: string[]; rows: string[][] }) {
  const cols = Math.max(table.headers.length, ...table.rows.map((r) => r.length), 1);
  const colW = Math.floor(CONTENT_W / cols);
  const widths = Array.from({ length: cols }, () => colW);
  const border = { style: BorderStyle.SINGLE, size: 1, color: "999999" };
  const borders = { top: border, bottom: border, left: border, right: border };

  const row = (cells: string[], head: boolean) =>
    new TableRow({
      children: Array.from(
        { length: cols },
        (_, i) =>
          new TableCell({
            borders,
            width: { size: colW, type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            ...(head
              ? { shading: { fill: "EFEFEF", type: ShadingType.CLEAR, color: "auto" } }
              : {}),
            children: [
              new Paragraph({
                children: runs(cells[i] ?? "", { bold: head, size: 21 }),
              }),
            ],
          }),
      ),
    });

  const rows: TableRow[] = [];
  if (table.headers.length) rows.push(row(table.headers, true));
  for (const r of table.rows) rows.push(row(r, false));

  const blocks: (Paragraph | Table)[] = [];
  if (table.title) blocks.push(body(`*${table.title}*`.replace(/\*/g, "")));
  blocks.push(
    new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: widths,
      rows,
    }),
  );
  blocks.push(new Paragraph({ children: [], spacing: { after: 120 } }));
  return blocks;
}

const MAX_IMG_W = 602; // px at 96dpi for A4 content width
const MAX_IMG_H = 930;

function originalPageParagraphs(pages: PageImage[]): Paragraph[] {
  const out: Paragraph[] = [];
  pages.forEach((page, i) => {
    const ratio = Math.min(MAX_IMG_W / page.width, MAX_IMG_H / page.height);
    const buffer = new ArrayBuffer(page.data.byteLength);
    new Uint8Array(buffer).set(page.data);
    out.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 0 },
        children: [
          ...(i > 0 ? [new PageBreak()] : []),
          new ImageRun({
            type: "png",
            data: buffer,
            transformation: {
              width: Math.round(page.width * ratio),
              height: Math.round(page.height * ratio),
            },
            altText: {
              title: `Assessment page ${i + 1}`,
              description: `Original uploaded assessment page ${i + 1}`,
              name: `assessment-page-${i + 1}`,
            },
          }),
        ],
      }),
    );
  });
  return out;
}

export async function buildAnswerDocx(
  student: Student,
  analysis: AssessmentAnalysis,
  answers: QuestionAnswer[],
  originalPages: PageImage[] = [],
): Promise<Uint8Array> {
  const children: (Paragraph | Table)[] = [];

  if (originalPages.length) {
    children.push(...originalPageParagraphs(originalPages));
    children.push(new Paragraph({ children: [new PageBreak()] }));
  }



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
    children.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: `${label}: `, bold: true, color: BLACK, font: FONT, size: SIZE }),
          new TextRun({ text: value, color: BLACK, font: FONT, size: SIZE }),
        ],
      }),
    );
  }

  let currentSection = "";
  for (const item of answers) {
    const q = item.question;
    if (q.section && q.section !== currentSection) {
      currentSection = q.section;
      children.push(heading(currentSection.toUpperCase(), 26));
    }
    children.push(heading(`Question ${q.question_number}`, 25));
    children.push(body(q.question_text));
    children.push(heading("Answer"));
    children.push(...markdownParagraphs(item.answer.answer_markdown));

    if (item.answer.table) children.push(...docTable(item.answer.table));

    const diagram = item.answer.diagram;
    if (diagram && diagram.nodes.length) {
      children.push(heading(diagram.title ? `Figure: ${diagram.title}` : "Figure"));
      for (const node of diagram.nodes) {
        children.push(
          new Paragraph({
            children: runs(node.label),
            numbering: { reference: "answer-bullets", level: 0 },
            spacing: { after: 40 },
          }),
        );
      }
      for (const edge of diagram.edges) {
        const from = diagram.nodes.find((n) => n.id === edge.from)?.label ?? edge.from;
        const to = diagram.nodes.find((n) => n.id === edge.to)?.label ?? edge.to;
        children.push(body(`${from} -> ${to}${edge.label ? ` (${edge.label})` : ""}`));
      }
    }

    const code = item.answer.code;
    if (code) {
      if (code.algorithm.length) {
        children.push(heading("Algorithm"));
        code.algorithm.forEach((step, i) => children.push(body(`${i + 1}. ${step}`)));
      }
      if (code.source.trim()) {
        children.push(heading(`Program${code.language ? ` (${code.language})` : ""}`));
        for (const line of code.source.replace(/\t/g, "    ").split("\n")) {
          children.push(
            new Paragraph({
              spacing: { after: 0 },
              children: [
                new TextRun({
                  text: line || " ",
                  font: "Courier New",
                  size: 20,
                  color: BLACK,
                }),
              ],
            }),
          );
        }
        children.push(new Paragraph({ children: [], spacing: { after: 120 } }));
      }
      if (code.sample_input || code.sample_output) {
        children.push(heading("Sample input / output"));
        if (code.sample_input) children.push(body(`Input: ${code.sample_input}`));
        if (code.sample_output) children.push(body(`Output: ${code.sample_output}`));
      }
      if (code.explanation) {
        children.push(heading("Explanation"));
        children.push(body(code.explanation));
      }
    }
  }

  const doc = new Document({
    styles: { default: { document: { run: { font: FONT, size: SIZE, color: BLACK } } } },
    numbering: {
      config: [
        {
          reference: "answer-bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "\u2022",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: children.length
          ? children
          : [new Paragraph({ children: runs("No answers generated.") })],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return new Uint8Array(await blob.arrayBuffer());
}

export function downloadDocx(bytes: Uint8Array, filename: string) {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  const url = URL.createObjectURL(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// HeadingLevel is imported for consumers that need standard heading styles.
export { HeadingLevel };
