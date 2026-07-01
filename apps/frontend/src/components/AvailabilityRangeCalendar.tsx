"use client";

import { useState } from "react";
import {
  addMonths,
  buildMonthCalendar,
  formatMonthLabel,
  isDateInRange,
  nextRangeSelection,
  toMonth,
  type DateRangeSelection
} from "../lib/date-range-calendar";

type AvailabilityRangeCalendarProps = {
  index: number;
  startDate: string;
  endDate: string;
  canRemove: boolean;
  onChange: (nextRange: DateRangeSelection) => void;
  onRemove: () => void;
};

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

export function AvailabilityRangeCalendar({
  index,
  startDate,
  endDate,
  canRemove,
  onChange,
  onRemove
}: AvailabilityRangeCalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState(toMonth(startDate));
  const days = buildMonthCalendar(visibleMonth);

  function selectDate(date: string) {
    onChange(nextRangeSelection(startDate, endDate, date));
  }

  return (
    <article className="availability-card">
      <div className="range-header">
        <div>
          <p className="range-kicker">가능한 일정 {index + 1}</p>
          <p className="range-summary">
            {startDate && endDate
              ? `선택한 일정: ${startDate} ~ ${endDate}`
              : "캘린더에서 시작일과 종료일을 선택하세요."}
          </p>
        </div>
        <button
          className="secondary compact-button"
          disabled={!canRemove}
          type="button"
          onClick={onRemove}
        >
          일정 삭제
        </button>
      </div>
      <div className="inline-calendar" aria-label={`가능한 일정 ${index + 1} 캘린더`}>
        <div className="calendar-nav">
          <button
            className="secondary compact-button"
            type="button"
            onClick={() => setVisibleMonth(addMonths(visibleMonth, -1))}
          >
            이전 달
          </button>
          <strong>{formatMonthLabel(visibleMonth)}</strong>
          <button
            className="secondary compact-button"
            type="button"
            onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))}
          >
            다음 달
          </button>
        </div>
        <div className="calendar-grid" aria-hidden="true">
          {weekdays.map((weekday) => (
            <span className="calendar-weekday" key={weekday}>
              {weekday}
            </span>
          ))}
        </div>
        <div className="calendar-grid">
          {days.map((day) => {
            const isSelected = day.date === startDate || day.date === endDate;
            const isInsideRange = isDateInRange(day.date, startDate, endDate);
            const className = [
              "calendar-day",
              day.inMonth ? "" : "outside",
              isInsideRange ? "in-range" : "",
              isSelected ? "selected" : ""
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                aria-pressed={isInsideRange}
                className={className}
                key={day.date}
                type="button"
                onClick={() => selectDate(day.date)}
              >
                <span className="sr-only">{day.date} 선택</span>
                {day.dayOfMonth}
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}
