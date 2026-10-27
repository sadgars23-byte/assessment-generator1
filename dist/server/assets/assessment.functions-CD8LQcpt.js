import { d as TSS_SERVER_FUNCTION, t as createServerFn } from "./createServerFn-CIHAFgYl.js";
import { n as answerSchema, r as questionSchema, t as analysisSchema } from "./assessment-CvJPISfP.js";
import { z } from "zod";
//#region node_modules/@tanstack/start-server-core/dist/esm/createServerRpc.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region src/lib/assessment.functions.ts?tss-serverfn-split
var analyzeInput = z.object({ text: z.string().min(20) });
var generateInput = z.object({
	analysis: analysisSchema,
	question: questionSchema,
	feedback: z.array(z.string()).optional()
});
var validateInput = z.object({
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
	const { analyzeAssessmentText } = await import("./assessment.server-yZAW4_mU.js");
	return analyzeAssessmentText(data.text);
});
var generateAnswer_createServerFn_handler = createServerRpc({
	id: "3fb8a786da8627d1eeea3caa46b9e1bc2fd9d05cfe11277f7ccac3efcc60eae5",
	name: "generateAnswer",
	filename: "src/lib/assessment.functions.ts"
}, (opts) => generateAnswer.__executeServer(opts));
var generateAnswer = createServerFn({ method: "POST" }).inputValidator((input) => generateInput.parse(input)).handler(generateAnswer_createServerFn_handler, async ({ data }) => {
	const { generateAnswerFor } = await import("./assessment.server-yZAW4_mU.js");
	return generateAnswerFor(data.analysis, data.question, data.feedback);
});
var validateAnswer_createServerFn_handler = createServerRpc({
	id: "49cab2c949e37f1381f0079e75194dad40406c07dfce97e6425200defce2c4b9",
	name: "validateAnswer",
	filename: "src/lib/assessment.functions.ts"
}, (opts) => validateAnswer.__executeServer(opts));
var validateAnswer = createServerFn({ method: "POST" }).inputValidator((input) => validateInput.parse(input)).handler(validateAnswer_createServerFn_handler, async ({ data }) => {
	const { validateAnswerFor } = await import("./assessment.server-yZAW4_mU.js");
	return validateAnswerFor(data.analysis, data.question, data.answer);
});
//#endregion
export { analyzeAssessment_createServerFn_handler, generateAnswer_createServerFn_handler, validateAnswer_createServerFn_handler };
