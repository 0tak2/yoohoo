import { describe, expect, it } from "vitest";
import {
  buildMonthCalendar,
  formatMonthLabel,
  nextRangeSelection
} from "./date-range-calendar";

describe("date range calendar helpers", () => {
  it("builds a padded month grid for visible calendar rows", () => {
    const days = buildMonthCalendar("2026-08");

    expect(days[0]).toMatchObject({ date: "2026-07-26", inMonth: false });
    expect(days.find((day) => day.date === "2026-08-01")).toMatchObject({
      inMonth: true
    });
    expect(days.length % 7).toBe(0);
  });

  it("selects start and end dates from calendar clicks", () => {
    expect(nextRangeSelection("", "", "2026-08-01")).toEqual({
      startDate: "2026-08-01",
      endDate: "2026-08-01"
    });
    expect(nextRangeSelection("2026-08-01", "2026-08-01", "2026-08-04")).toEqual({
      startDate: "2026-08-01",
      endDate: "2026-08-04"
    });
  });

  it("starts a new range when the next selected date is before the start date", () => {
    expect(nextRangeSelection("2026-08-04", "2026-08-04", "2026-08-01")).toEqual({
      startDate: "2026-08-01",
      endDate: "2026-08-01"
    });
  });

  it("formats the visible month label", () => {
    expect(formatMonthLabel("2026-08")).toBe("2026년 8월");
  });
});

