import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreatePlanForm } from "./CreatePlanForm";
import { createPlan } from "../lib/api";

vi.mock("../lib/api", () => ({
  createPlan: vi.fn()
}));

describe("CreatePlanForm", () => {
  beforeEach(() => {
    vi.mocked(createPlan).mockReset();
    vi.mocked(createPlan).mockResolvedValue({
      id: "plan-1",
      handle: "abc123defg",
      title: "여름 휴가 언제 같이가지?",
      shareUrl: "/p/abc123defg",
      adminUrl: "/admin/abc123defg"
    });
  });

  it("shows a toast and does not submit when the admin password is shorter than 8 characters", async () => {
    render(<CreatePlanForm />);

    fireEvent.change(screen.getByLabelText("관리자 암호"), {
      target: { value: "123" }
    });
    fireEvent.click(screen.getByRole("button", { name: "계획 만들기" }));

    expect((await screen.findByRole("alert")).textContent).toBe(
      "관리자 암호는 8자 이상이어야 합니다."
    );
    expect(createPlan).not.toHaveBeenCalled();
  });

  it("submits when the admin password is at least 8 characters", async () => {
    render(<CreatePlanForm />);

    fireEvent.change(screen.getByLabelText("관리자 암호"), {
      target: { value: "secret12" }
    });
    fireEvent.click(screen.getByRole("button", { name: "계획 만들기" }));

    await waitFor(() => {
      expect(createPlan).toHaveBeenCalledWith({
        title: "여름 휴가 언제 같이가지?",
        adminPassword: "secret12",
        questions: []
      });
    });
  });
});
