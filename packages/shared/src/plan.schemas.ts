import { z } from "zod";

export const questionTypeSchema = z.enum(["boolean", "number", "string"]);

export const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형식이어야 합니다.");

export const customQuestionSchema = z.object({
  label: z.string().trim().min(1).max(80),
  type: questionTypeSchema
});

export const createPlanSchema = z.object({
  title: z.string().trim().min(1).max(80),
  adminPassword: z.string().min(8, "관리자 암호는 8자 이상이어야 합니다.").max(120),
  questions: z.array(customQuestionSchema).max(20).default([])
});

export const availabilityRangeSchema = z
  .object({
    startDate: dateStringSchema,
    endDate: dateStringSchema
  })
  .refine((range) => range.startDate <= range.endDate, {
    message: "종료일은 시작일 이후여야 합니다.",
    path: ["endDate"]
  });

const booleanAnswerSchema = z.object({
  questionId: z.string().min(1),
  type: z.literal("boolean"),
  value: z.boolean()
});

const numberAnswerSchema = z.object({
  questionId: z.string().min(1),
  type: z.literal("number"),
  value: z.number().finite()
});

const stringAnswerSchema = z.object({
  questionId: z.string().min(1),
  type: z.literal("string"),
  value: z.string().max(1000)
});

export const customAnswerSchema = z.discriminatedUnion("type", [
  booleanAnswerSchema,
  numberAnswerSchema,
  stringAnswerSchema
]);

export const submitParticipantResponseSchema = z.object({
  nickname: z.string().trim().min(1).max(40),
  desiredNights: z.number().int().min(1).max(30),
  availabilityRanges: z.array(availabilityRangeSchema).min(1).max(20),
  answers: z.array(customAnswerSchema).default([])
});

export const adminLoginSchema = z.object({
  password: z.string().min(1).max(120)
});

export type QuestionType = z.infer<typeof questionTypeSchema>;
export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type AvailabilityRangeInput = z.infer<typeof availabilityRangeSchema>;
export type CustomAnswerInput = z.infer<typeof customAnswerSchema>;
export type SubmitParticipantResponseInput = z.infer<
  typeof submitParticipantResponseSchema
>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
