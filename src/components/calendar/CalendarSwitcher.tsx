import { Plus, Trash2 } from 'lucide-react';
import type { MealCalendar } from '../../types';

type CalendarSwitcherProps = {
  calendars: MealCalendar[];
  currentCalendarId: string;
  onCreateCalendar: () => void;
  onDeleteCalendar: () => void;
  onSwitchCalendar: (id: string) => void;
};

export function CalendarSwitcher({ calendars, currentCalendarId, onCreateCalendar, onDeleteCalendar, onSwitchCalendar }: CalendarSwitcherProps) {
  return (
    <div className="calendar-switcher">
      <label>
        Calendar
        <select value={currentCalendarId} onChange={(event) => onSwitchCalendar(event.target.value)}>
          {calendars.map((calendar) => (
            <option key={calendar.id} value={calendar.id}>
              {calendar.name}
            </option>
          ))}
        </select>
      </label>
      <button aria-label="Create calendar" className="icon-button" data-tooltip="Create calendar" onClick={onCreateCalendar}>
        <Plus size={16} />
      </button>
      <button
        aria-label="Delete current calendar"
        className="icon-button calendar-delete-button"
        data-tooltip-align="right"
        disabled={calendars.length <= 1}
        onClick={onDeleteCalendar}
        data-tooltip={calendars.length <= 1 ? 'Keep at least one calendar' : 'Delete current calendar'}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
