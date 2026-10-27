import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function getDefaultModel(apiKey?: string): string {
  if (process.env["AI_MODEL"]) return process.env["AI_MODEL"];
  if (apiKey?.startsWith("gsk_")) return "llama-3.3-70b-versatile";
  if (apiKey?.startsWith("AIza") || apiKey?.startsWith("AQ.")) return "gemini-flash-lite-latest";
  return "gemini-flash-lite-latest";
}

export function getDefaultBaseUrl(apiKey?: string): string {
  if (process.env["AI_BASE_URL"]) return process.env["AI_BASE_URL"];
  if (apiKey?.startsWith("gsk_")) return "https://api.groq.com/openai/v1";
  if (apiKey?.startsWith("AIza") || apiKey?.startsWith("AQ.")) {
    return "https://generativelanguage.googleapis.com/v1beta/openai/";
  }
  return "https://generativelanguage.googleapis.com/v1beta/openai/";
}

export const AI_MODEL = process.env["AI_MODEL"] || "gemini-flash-lite-latest";

export function createAiProvider(apiKey: string) {
  const baseURL = getDefaultBaseUrl(apiKey);
  return createOpenAICompatible({
    name: "fast-ai-provider",
    baseURL,
    headers: { Authorization: `Bearer ${apiKey}` },
  });
}

