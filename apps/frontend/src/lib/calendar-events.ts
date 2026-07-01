import type { AdminCalendarEvent, Participant } from "./api";

const participantPalette: [string, ...string[]] = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#9333ea",
  "#d97706",
  "#0891b2"
];

export function buildParticipantCalendarEvents(participants: Participant[]) {
  return participants.flatMap((participant, participantIndex) =>
    participant.availabilityRanges.map((range) => ({
      id: `${participant.id}:${range.startDate}:${range.endDate}`,
      participantId: participant.id,
      participantNickname: participant.nickname,
      start: range.startDate,
      end: range.endDate,
      color: getParticipantColor(participantIndex)
    }))
  );
}

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

function getParticipantColor(index: number) {
  return participantPalette[index % participantPalette.length] ?? participantPalette[0];
}
