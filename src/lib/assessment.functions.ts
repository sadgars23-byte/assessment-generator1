import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { analysisSchema, answerSchema, questionSchema } from "@/types/assessment";

const analyzeInput = z.object({ text: z.string().min(20) });
const generateInput = z.object({
  analysis: analysisSchema,
  question: questionSchema,
  feedback: z.array(z.string()).optional(),
});
const validateInput = z.object({
  analysis: analysisSchema,
  question: questionSchema,
  answer: answerSchema,
});

export const analyzeAssessment = createServerFn({ method: "POST" })
  .validator((input: unknown) => analyzeInput.parse(input))
  .handler(async ({ data }) => {
    const { analyzeAssessmentText } = await import("./assessment.server");
    return analyzeAssessmentText(data.text);
  });

export const generateAnswer = createServerFn({ method: "POST" })
  .validator((input: unknown) => generateInput.parse(input))
  .handler(async ({ data }) => {
    const { generateAnswerFor } = await import("./assessment.server");
    return generateAnswerFor(data.analysis, data.question, data.feedback);
  });

export const validateAnswer = createServerFn({ method: "POST" })
  .validator((input: unknown) => validateInput.parse(input))
  .handler(async ({ data }) => {
    const { validateAnswerFor } = await import("./assessment.server");
    return validateAnswerFor(data.analysis, data.question, data.answer);
  });
