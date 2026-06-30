import { describe, expect, it } from "vitest";
import {
  createPlanSchema,
  submitParticipantResponseSchema
} from "./plan.schemas.js";

describe("createPlanSchema", () => {
  it("accepts custom boolean, number, and string questions", () => {
    const parsed = createPlanSchema.parse({
      title: "여름 휴가",
      adminPassword: "secret12",
      questions: [
        { label: "술먹고싶어?", type: "boolean" },
        { label: "인당 예산 얼마 생각해?", type: "number" },
        { label: "건의사항있어?", type: "string" }
      ]
    });

    expect(parsed.questions).toHaveLength(3);
  });

  it("rejects a short admin password", () => {
    expect(() =>
      createPlanSchema.parse({
        title: "여름 휴가",
        adminPassword: "123",
        questions: []
      })
    ).toThrow();
  });
});

describe("submitParticipantResponseSchema", () => {
  it("accepts multiple availability ranges and typed answers", () => {
    const parsed = submitParticipantResponseSchema.parse({
      nickname: "동동",
      desiredNights: 2,
      availabilityRanges: [
        { startDate: "2026-08-01", endDate: "2026-08-04" },
        { startDate: "2026-08-12", endDate: "2026-08-15" }
      ],
      answers: [
        { questionId: "question-1", type: "boolean", value: true },
        { questionId: "question-2", type: "number", value: 300000 },
        { questionId: "question-3", type: "string", value: "바다 좋아요" }
      ]
    });

    expect(parsed.availabilityRanges).toHaveLength(2);
  });

  it("rejects an invalid date range", () => {
    expect(() =>
      submitParticipantResponseSchema.parse({
        nickname: "동동",
        desiredNights: 2,
        availabilityRanges: [{ startDate: "2026-08-04", endDate: "2026-08-01" }],
        answers: []
      })
    ).toThrow();
  });
});

