import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { a as stringType, i as objectType, t as arrayType } from "../_libs/zod.mjs";
import { n as answerSchema, r as questionSchema, t as analysisSchema } from "./assessment-CvJPISfP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assessment.functions-CD8LQcpt.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var analyzeInput = objectType({ text: stringType().min(20) });
var generateInput = objectType({
	analysis: analysisSchema,
	question: questionSchema,
	feedback: arrayType(stringType()).optional()
});
var validateInput = objectType({
	analysis: analysisSchema,
	question: questionSchema,
	answer: answerSchema
});
var analyzeAssessment_createServerFn_handler = createServerRpc({
	id: "df9ab5404b03f2ab9bce5b9be8292169a160e7ede9a62379ef1a21db861b6a90",
	name: "analyzeAssessment",
	filename: "src/lib/assessment.functions.ts"
}, (opts) => analyzeAssessment.__executeServer(opts));
var analyzeAssessment = createServerFn({ method: "POST" }).inputValidator((input) => analyzeInput.parse(input)).handler(analyzeAssessment_createServerFn_handler, async ({ data }) => {
	const { analyzeAssessmentText } = await import("./assessment.server-yZAW4_mU.mjs");
	return analyzeAssessmentText(data.text);
});
var generateAnswer_createServerFn_handler = createServerRpc({
	id: "3fb8a786da8627d1eeea3caa46b9e1bc2fd9d05cfe11277f7ccac3efcc60eae5",
	name: "generateAnswer",
	filename: "src/lib/assessment.functions.ts"
}, (opts) => generateAnswer.__executeServer(opts));
var generateAnswer = createServerFn({ method: "POST" }).inputValidator((input) => generateInput.parse(input)).handler(generateAnswer_createServerFn_handler, async ({ data }) => {
	const { generateAnswerFor } = await import("./assessment.server-yZAW4_mU.mjs");
	return generateAnswerFor(data.analysis, data.question, data.feedback);
});
var validateAnswer_createServerFn_handler = createServerRpc({
	id: "49cab2c949e37f1381f0079e75194dad40406c07dfce97e6425200defce2c4b9",
	name: "validateAnswer",
	filename: "src/lib/assessment.functions.ts"
}, (opts) => validateAnswer.__executeServer(opts));
var validateAnswer = createServerFn({ method: "POST" }).inputValidator((input) => validateInput.parse(input)).handler(validateAnswer_createServerFn_handler, async ({ data }) => {
	const { validateAnswerFor } = await import("./assessment.server-yZAW4_mU.mjs");
	return validateAnswerFor(data.analysis, data.question, data.answer);
});
//#endregion
export { analyzeAssessment_createServerFn_handler, generateAnswer_createServerFn_handler, validateAnswer_createServerFn_handler };
