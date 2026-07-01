"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchPlanResults, type PlanResults } from "../../../../lib/api";
import { PrivacyNotice } from "../../../../components/PrivacyNotice";
import {
  buildParticipantCalendarEvents,
  buildVisibleCalendarEvents
} from "../../../../lib/calendar-events";

export default function PublicResultsPage() {
  const params = useParams<{ handle: string }>();
  const [results, setResults] = useState<PlanResults | null>(null);
  const [enabledIds, setEnabledIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    void fetchPlanResults(params.handle).then((nextResults) => {
      setResults(nextResults);
      setEnabledIds((current) => {
        if (current.size > 0) {
          return current;
        }
        return new Set(
          nextResults.participants.map((participant) => participant.id)
        );
      });
    });
  }, [params.handle]);

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">답변 현황</p>
        <h1>{results?.plan.title ?? "답변을 모으는 중"}</h1>
      </section>
      <PrivacyNotice />
      <section className="panel">
        {!results ? <p>불러오는 중입니다.</p> : null}
        {results && results.participants.length === 0 ? (
          <p className="lead">
            아직 다른 친구는 답변하지 않았어요. 톡방에 알려주세요.
          </p>
        ) : null}
        {results && results.participants.length > 0 ? (
          <>
            <div className="row">
              {results.participants.map((participant) => (
                <label className="row" key={participant.id}>
                  <input
                    checked={enabledIds.has(participant.id)}
                    type="checkbox"
                    onChange={(event) => {
                      setEnabledIds((current) => {
                        const next = new Set(current);
                        if (event.target.checked) {
                          next.add(participant.id);
                        } else {
                          next.delete(participant.id);
                        }
                        return next;
                      });
                    }}
                  />
                  {participant.nickname}
                </label>
              ))}
            </div>
            <div className="calendar-wrap">
              <FullCalendar
                height="auto"
                initialView="dayGridMonth"
                plugins={[dayGridPlugin, interactionPlugin]}
                events={buildVisibleCalendarEvents(
                  buildParticipantCalendarEvents(results.participants),
                  enabledIds
                )}
              />
            </div>
            <ul className="list">
              {results.participants.map((participant) => (
                <li className="item" key={participant.id}>
                  <h3>{participant.nickname}</h3>
                  <p>희망 숙박수: {participant.desiredNights}박</p>
                  <p>
                    가능 일정:{" "}
                    {participant.availabilityRanges
                      .map((range) => `${range.startDate}~${range.endDate}`)
                      .join(", ")}
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </section>
    </main>
  );
}
