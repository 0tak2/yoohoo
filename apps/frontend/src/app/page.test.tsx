import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LandingPage from "./page";

describe("LandingPage", () => {
  it("presents the service name in a restrained tone", () => {
    render(<LandingPage />);

    expect(
      screen.getByRole("heading", { name: "유리들의 후가" })
    ).toBeTruthy();
    expect(screen.getByText("우리들의 휴가를 비튼 이름입니다.")).toBeTruthy();
  });
});
