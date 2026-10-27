import { z } from "zod";

export const tableSchema = z.object({
  title: z.string().default(""),
  headers: z.array(z.string()).default([]),
  rows: z.array(z.array(z.string())).default([]),
  purpose: z.string().default(""),
});

export const rubricItemSchema = z.object({
  criterion: z.string().default(""),
  description: z.string().default(""),
  marks: z.number().nullable().default(null),
});

export const sectionSchema = z.object({
  name: z.string().default(""),
  instructions: z.string().default(""),
  marks: z.number().nullable().default(null),
  question_count: z.number().nullable().default(null),
});

export const questionSchema = z.object({
  question_number: z.string().default(""),
  question_text: z.string().default(""),
  section: z.string().default(""),
  marks: z.number().default(0),
  question_type: z.array(z.string()).default([]),
  command_verb: z.string().default(""),
  taxonomy_level: z.string().default(""),
  course_outcome: z.string().default(""),
  requires_diagram: z.boolean().default(false),
  requires_concept_map: z.boolean().default(false),
  requires_code: z.boolean().default(false),
  requires_formula: z.boolean().default(false),
  requires_table: z.boolean().default(false),
  programming_language: z.string().default(""),
  internal_choice_group: z.string().default(""),
  answer_depth: z.string().default(""),
});

export const analysisSchema = z.object({
  institution: z.string().default(""),
  assessment_type: z.string().default(""),
  course_name: z.string().default(""),
  course_code: z.string().default(""),
  course_outcomes: z.array(z.string()).default([]),
  taxonomy: z.string().default(""),
  total_questions: z.number().default(0),
  total_marks: z.number().default(0),
  sections: z.array(sectionSchema).default([]),
  rubric: z.array(rubricItemSchema).default([]),
  instructions: z.array(z.string()).default([]),
  tables: z.array(tableSchema).default([]),
  questions: z.array(questionSchema).default([]),
});

export const diagramSchema = z.object({
  title: z.string().default(""),
  kind: z.string().default("flowchart"),
  nodes: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        layer: z.number().default(0),
      }),
    )
    .default([]),
  edges: z
    .array(
      z.object({
        from: z.string(),
        to: z.string(),
        label: z.string().default(""),
      }),
    )
    .default([]),
});

export const codeSchema = z.object({
  language: z.string().default(""),
  algorithm: z.array(z.string()).default([]),
  source: z.string().default(""),
  sample_input: z.string().default(""),
  sample_output: z.string().default(""),
  explanation: z.string().default(""),
});

export const answerSchema = z.object({
  answer_markdown: z.string().default(""),
  table: tableSchema.nullable().default(null),
  diagram: diagramSchema.nullable().default(null),
  code: codeSchema.nullable().default(null),
});

export const validationSchema = z.object({
  passed: z.boolean().default(true),
  score: z.number().default(100),
  issues: z.array(z.string()).default([]),
  suggestions: z.array(z.string()).default([]),
});

export type AssessmentTable = z.infer<typeof tableSchema>;
export type RubricItem = z.infer<typeof rubricItemSchema>;
export type AssessmentSection = z.infer<typeof sectionSchema>;
export type AssessmentQuestion = z.infer<typeof questionSchema>;
export type AssessmentAnalysis = z.infer<typeof analysisSchema>;
export type DiagramSpec = z.infer<typeof diagramSchema>;
export type CodeSolution = z.infer<typeof codeSchema>;
export type GeneratedAnswer = z.infer<typeof answerSchema>;
export type AnswerValidation = z.infer<typeof validationSchema>;

export type Student = {
  name: string;
  registrationNumber: string;
};

export type QuestionAnswer = {
  question: AssessmentQuestion;
  answer: GeneratedAnswer;
  validation: AnswerValidation | null;
};

export type PipelineStepId =
  | "uploaded"
  | "reading"
  | "tables"
  | "questions"
  | "marks"
  | "rubric"
  | "classify"
  | "plan"
  | "answers"
  | "diagrams"
  | "code"
  | "validate"
  | "answerPdf"
  | "merge"
  | "ready";

export type StepState = "pending" | "active" | "done" | "error";
