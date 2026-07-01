export type CalendarDay = {
  date: string;
  dayOfMonth: number;
  inMonth: boolean;
};

export type DateRangeSelection = {
  startDate: string;
  endDate: string;
};

function parseMonth(month: string) {
  const [yearText, monthText] = month.split("-");
  const year = Number(yearText);
  const monthNumber = Number(monthText);

  if (!yearText || !monthText || !Number.isInteger(year) || !Number.isInteger(monthNumber)) {
    throw new Error(`Invalid month: ${month}`);
  }

  return {
    year,
    monthIndex: monthNumber - 1
  };
}

function formatDate(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function toMonth(date: string) {
  return date ? date.slice(0, 7) : formatDate(new Date()).slice(0, 7);
}

export function addMonths(month: string, amount: number) {
  const { year, monthIndex } = parseMonth(month);
  const nextDate = new Date(Date.UTC(year, monthIndex + amount, 1));

  return formatDate(nextDate).slice(0, 7);
}

export function buildMonthCalendar(month: string): CalendarDay[] {
  const { year, monthIndex } = parseMonth(month);
  const firstDay = new Date(Date.UTC(year, monthIndex, 1));
  const firstWeekday = firstDay.getUTCDay();
  const gridStart = new Date(Date.UTC(year, monthIndex, 1 - firstWeekday));
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const totalVisibleDays = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  return Array.from({ length: totalVisibleDays }, (_, dayOffset) => {
    const date = new Date(gridStart);
    date.setUTCDate(gridStart.getUTCDate() + dayOffset);

    return {
      date: formatDate(date),
      dayOfMonth: date.getUTCDate(),
      inMonth: date.getUTCMonth() === monthIndex
    };
  });
}

export function formatMonthLabel(month: string) {
  const { year, monthIndex } = parseMonth(month);

  return `${year}년 ${monthIndex + 1}월`;
}

export function isDateInRange(date: string, startDate: string, endDate: string) {
  return Boolean(startDate && endDate && startDate <= date && date <= endDate);
}

export function nextRangeSelection(
  startDate: string,
  endDate: string,
  selectedDate: string
): DateRangeSelection {
  if (!startDate || !endDate || startDate !== endDate || selectedDate < startDate) {
    return {
      startDate: selectedDate,
      endDate: selectedDate
    };
  }

  return {
    startDate,
    endDate: selectedDate
  };
}
