import { addDays, endOfMonth, endOfWeek, format, isSameDay, isToday, startOfMonth, startOfWeek } from 'date-fns';

export const toDateKey = (date: Date) => format(date, 'yyyy-MM-dd');
export const prettyDay = (date: Date) => format(date, 'EEE d');
export const monthTitle = (date: Date) => format(date, 'MMMM yyyy');

export function getWeekDays(anchor: Date) {
  const start = startOfWeek(anchor, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export function getMonthGrid(anchor: Date) {
  const start = startOfWeek(startOfMonth(anchor), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(anchor), { weekStartsOn: 1 });
  const days: Date[] = [];
  for (let day = start; day <= end; day = addDays(day, 1)) {
    days.push(day);
  }
  return days;
}

export function isSameDate(a: Date, b: Date) {
  return isSameDay(a, b);
}

export function dayBadge(date: Date) {
  return isToday(date) ? 'Today' : format(date, 'MMM d');
}
