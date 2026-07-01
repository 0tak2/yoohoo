import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ParticipantResponseForm } from "./ParticipantResponseForm";
import { fetchPublicPlan, submitParticipantResponse } from "../lib/api";

vi.mock("../lib/api", () => ({
  fetchPublicPlan: vi.fn(),
  submitParticipantResponse: vi.fn()
}));

describe("ParticipantResponseForm", () => {
  beforeEach(() => {
    vi.mocked(fetchPublicPlan).mockReset();
    vi.mocked(submitParticipantResponse).mockReset();
    vi.mocked(fetchPublicPlan).mockResolvedValue({
      id: "plan-1",
      handle: "abc123defg",
      title: "여름 휴가 언제 같이가지?",
      questions: [
        {
          id: "question-1",
          label: "술먹고싶어?",
          type: "boolean",
          sortOrder: 0
        },
        {
          id: "question-2",
          label: "인당 예산 얼마 생각해?",
          type: "number",
          sortOrder: 1
        },
        {
          id: "question-3",
          label: "건의사항있어?",
          type: "string",
          sortOrder: 2
        }
      ]
    });
    vi.mocked(submitParticipantResponse).mockResolvedValue({
      participant: {
        id: "participant-1",
        nickname: "동동",
        desiredNights: 2,
        availabilityRanges: [
          {
            startDate: "2026-07-10",
            endDate: "2026-07-12"
          }
        ]
      }
    });
  });

  it("renders custom questions and submits typed answers", async () => {
    render(<ParticipantResponseForm handle="abc123defg" />);

    expect(await screen.findByText("술먹고싶어?")).toBeTruthy();
    expect(screen.getByText("인당 예산 얼마 생각해?")).toBeTruthy();
    expect(screen.getByText("건의사항있어?")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("닉네임"), {
      target: { value: "동동" }
    });
    fireEvent.click(screen.getByRole("button", { name: /2026-07-10 선택/ }));
    fireEvent.click(screen.getByRole("button", { name: /2026-07-12 선택/ }));
    fireEvent.change(screen.getByLabelText("술먹고싶어?"), {
      target: { value: "true" }
    });
    fireEvent.change(screen.getByLabelText("인당 예산 얼마 생각해?"), {
      target: { value: "300000" }
    });
    fireEvent.change(screen.getByLabelText("건의사항있어?"), {
      target: { value: "바다 가까운 곳이면 좋겠어." }
    });
    fireEvent.click(screen.getByRole("button", { name: "답변 제출" }));

    await waitFor(() => {
      expect(submitParticipantResponse).toHaveBeenCalledWith("abc123defg", {
        nickname: "동동",
        desiredNights: 2,
        availabilityRanges: [
          {
            startDate: "2026-07-10",
            endDate: "2026-07-12"
          }
        ],
        answers: [
          {
            questionId: "question-1",
            type: "boolean",
            value: true
          },
          {
            questionId: "question-2",
            type: "number",
            value: 300000
          },
          {
            questionId: "question-3",
            type: "string",
            value: "바다 가까운 곳이면 좋겠어."
          }
        ]
      });
    });
  });

  it("does not submit when availability ranges overlap", async () => {
    render(<ParticipantResponseForm handle="abc123defg" />);

    await screen.findByText("술먹고싶어?");

    fireEvent.change(screen.getByLabelText("닉네임"), {
      target: { value: "동동" }
    });
    fireEvent.click(screen.getByRole("button", { name: /2026-07-10 선택/ }));
    fireEvent.click(screen.getByRole("button", { name: /2026-07-12 선택/ }));
    fireEvent.click(screen.getByRole("button", { name: "일정 추가" }));
    fireEvent.click(
      screen.getAllByRole("button", { name: /2026-07-12 선택/ })[1] as Element
    );
    fireEvent.click(
      screen.getAllByRole("button", { name: /2026-07-15 선택/ })[1] as Element
    );
    fireEvent.click(screen.getByRole("button", { name: "답변 제출" }));

    expect((await screen.findByRole("alert")).textContent).toContain(
      "가능 일정은 서로 겹칠 수 없습니다."
    );
    expect(submitParticipantResponse).not.toHaveBeenCalled();
  });
});
