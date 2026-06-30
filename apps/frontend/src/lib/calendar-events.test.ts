import { describe, expect, it } from "vitest";
import { buildVisibleCalendarEvents } from "./calendar-events";

describe("buildVisibleCalendarEvents", () => {
  it("filters calendar events by enabled participant ids", () => {
    const events = buildVisibleCalendarEvents(
      [
        {
          id: "a:2026-08-01:2026-08-04",
          participantId: "a",
          participantNickname: "동동",
          start: "2026-08-01",
          end: "2026-08-04",
          color: "#2563eb"
        },
        {
          id: "b:2026-08-03:2026-08-05",
          participantId: "b",
          participantNickname: "모모",
          start: "2026-08-03",
          end: "2026-08-05",
          color: "#16a34a"
        }
      ],
      new Set(["b"])
    );

    expect(events).toEqual([
      {
        id: "b:2026-08-03:2026-08-05",
        title: "모모",
        start: "2026-08-03",
        end: "2026-08-05",
        backgroundColor: "#16a34a",
        borderColor: "#16a34a"
      }
    ]);
  });
});

