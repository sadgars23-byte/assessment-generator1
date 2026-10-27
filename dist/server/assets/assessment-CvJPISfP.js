import { z } from "zod";
//#region src/types/assessment.ts
var tableSchema = z.object({
	title: z.string().default(""),
	headers: z.array(z.string()).default([]),
	rows: z.array(z.array(z.string())).default([]),
	purpose: z.string().default("")
});
var rubricItemSchema = z.object({
	criterion: z.string().default(""),
	description: z.string().default(""),
	marks: z.number().nullable().default(null)
});
var sectionSchema = z.object({
	name: z.string().default(""),
	instructions: z.string().default(""),
	marks: z.number().nullable().default(null),
	question_count: z.number().nullable().default(null)
});
var questionSchema = z.object({
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
	answer_depth: z.string().default("")
});
var analysisSchema = z.object({
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
	questions: z.array(questionSchema).default([])
});
var diagramSchema = z.object({
	title: z.string().default(""),
	kind: z.string().default("flowchart"),
	nodes: z.array(z.object({
		id: z.string(),
		label: z.string(),
		layer: z.number().default(0)
	})).default([]),
	edges: z.array(z.object({
		from: z.string(),
		to: z.string(),
		label: z.string().default("")
	})).default([])
});
var codeSchema = z.object({
	language: z.string().default(""),
	algorithm: z.array(z.string()).default([]),
	source: z.string().default(""),
	sample_input: z.string().default(""),
	sample_output: z.string().default(""),
	explanation: z.string().default("")
});
var answerSchema = z.object({
	answer_markdown: z.string().default(""),
	table: tableSchema.nullable().default(null),
	diagram: diagramSchema.nullable().default(null),
	code: codeSchema.nullable().default(null)
});
var validationSchema = z.object({
	passed: z.boolean().default(true),
	score: z.number().default(100),
	issues: z.array(z.string()).default([]),
	suggestions: z.array(z.string()).default([])
});
//#endregion
export { validationSchema as i, answerSchema as n, questionSchema as r, analysisSchema as t };
