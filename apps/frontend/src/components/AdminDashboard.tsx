"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import {
  adminLogin,
  fetchAdminResponses,
  type AdminResponses
} from "../lib/api";
import { buildVisibleCalendarEvents } from "../lib/calendar-events";

export function AdminDashboard({ handle }: { handle: string }) {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [responses, setResponses] = useState<AdminResponses | null>(null);
  const [enabledIds, setEnabledIds] = useState<Set<string>>(new Set());

  async function loadResponses() {
    const nextResponses = await fetchAdminResponses(handle);
    setResponses(nextResponses);
    setEnabledIds((current) => {
      if (current.size > 0) {
        return current;
      }
      return new Set(
        nextResponses.participants.map((participant) => participant.id)
      );
    });
  }

  useEffect(() => {
    if (!authenticated) {
      return;
    }

    void loadResponses();
    const timer = window.setInterval(() => {
      void loadResponses();
    }, 5000);

    return () => window.clearInterval(timer);
  }, [authenticated, handle]);

  async function onLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await adminLogin(handle, password);
    setAuthenticated(true);
  }

  if (!authenticated) {
    return (
      <form className="panel" onSubmit={onLogin}>
        <label>
          관리자 암호
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button>관리자로 보기</button>
      </form>
    );
  }

  return (
    <section className="panel">
      <h2>{responses?.plan.title ?? "응답 불러오는 중"}</h2>
      <div className="row">
        {responses?.participants.map((participant) => (
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
            responses?.calendarEvents ?? [],
            enabledIds
          )}
        />
      </div>
      <ul className="list">
        {responses?.participants.map((participant) => (
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
    </section>
  );
}

