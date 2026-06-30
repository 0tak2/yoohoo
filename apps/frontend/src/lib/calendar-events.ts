import type { AdminCalendarEvent } from "./api";

export function buildVisibleCalendarEvents(
  events: AdminCalendarEvent[],
  enabledParticipantIds: Set<string>
) {
  return events
    .filter((event) => enabledParticipantIds.has(event.participantId))
    .map((event) => ({
      id: event.id,
      title: event.participantNickname,
      start: event.start,
      end: event.end,
      backgroundColor: event.color,
      borderColor: event.color
    }));
}

