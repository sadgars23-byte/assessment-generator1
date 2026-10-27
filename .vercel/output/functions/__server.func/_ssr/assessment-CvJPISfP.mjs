import { a as stringType, i as objectType, n as booleanType, r as numberType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assessment-CvJPISfP.js
var tableSchema = objectType({
	title: stringType().default(""),
	headers: arrayType(stringType()).default([]),
	rows: arrayType(arrayType(stringType())).default([]),
	purpose: stringType().default("")
});
var rubricItemSchema = objectType({
	criterion: stringType().default(""),
	description: stringType().default(""),
	marks: numberType().nullable().default(null)
});
var sectionSchema = objectType({
	name: stringType().default(""),
	instructions: stringType().default(""),
	marks: numberType().nullable().default(null),
	question_count: numberType().nullable().default(null)
});
var questionSchema = objectType({
	question_number: stringType().default(""),
	question_text: stringType().default(""),
	section: stringType().default(""),
	marks: numberType().default(0),
	question_type: arrayType(stringType()).default([]),
	command_verb: stringType().default(""),
	taxonomy_level: stringType().default(""),
	course_outcome: stringType().default(""),
	requires_diagram: booleanType().default(false),
	requires_concept_map: booleanType().default(false),
	requires_code: booleanType().default(false),
	requires_formula: booleanType().default(false),
	requires_table: booleanType().default(false),
	programming_language: stringType().default(""),
	internal_choice_group: stringType().default(""),
	answer_depth: stringType().default("")
});
var analysisSchema = objectType({
	institution: stringType().default(""),
	assessment_type: stringType().default(""),
	course_name: stringType().default(""),
	course_code: stringType().default(""),
	course_outcomes: arrayType(stringType()).default([]),
	taxonomy: stringType().default(""),
	total_questions: numberType().default(0),
	total_marks: numberType().default(0),
	sections: arrayType(sectionSchema).default([]),
	rubric: arrayType(rubricItemSchema).default([]),
	instructions: arrayType(stringType()).default([]),
	tables: arrayType(tableSchema).default([]),
	questions: arrayType(questionSchema).default([])
});
var diagramSchema = objectType({
	title: stringType().default(""),
	kind: stringType().default("flowchart"),
	nodes: arrayType(objectType({
		id: stringType(),
		label: stringType(),
		layer: numberType().default(0)
	})).default([]),
	edges: arrayType(objectType({
		from: stringType(),
		to: stringType(),
		label: stringType().default("")
	})).default([])
});
var codeSchema = objectType({
	language: stringType().default(""),
	algorithm: arrayType(stringType()).default([]),
	source: stringType().default(""),
	sample_input: stringType().default(""),
	sample_output: stringType().default(""),
	explanation: stringType().default("")
});
var answerSchema = objectType({
	answer_markdown: stringType().default(""),
	table: tableSchema.nullable().default(null),
	diagram: diagramSchema.nullable().default(null),
	code: codeSchema.nullable().default(null)
});
var validationSchema = objectType({
	passed: booleanType().default(true),
	score: numberType().default(100),
	issues: arrayType(stringType()).default([]),
	suggestions: arrayType(stringType()).default([])
});
//#endregion
export { validationSchema as i, answerSchema as n, questionSchema as r, analysisSchema as t };
