//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-TgOvcc8d.js
var manifest = {
	"3fb8a786da8627d1eeea3caa46b9e1bc2fd9d05cfe11277f7ccac3efcc60eae5": {
		functionName: "generateAnswer_createServerFn_handler",
		importer: () => import("./_ssr/assessment.functions-BdKl_j2S.mjs")
	},
	"49cab2c949e37f1381f0079e75194dad40406c07dfce97e6425200defce2c4b9": {
		functionName: "validateAnswer_createServerFn_handler",
		importer: () => import("./_ssr/assessment.functions-BdKl_j2S.mjs")
	},
	"df9ab5404b03f2ab9bce5b9be8292169a160e7ede9a62379ef1a21db861b6a90": {
		functionName: "analyzeAssessment_createServerFn_handler",
		importer: () => import("./_ssr/assessment.functions-BdKl_j2S.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
