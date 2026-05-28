import type { MealCalendar } from '../../types';
import { CalendarSwitcher } from '../calendar/CalendarSwitcher';

type AppHeaderProps = {
  calendars: MealCalendar[];
  childName: string;
  currentCalendarId: string;
  onCreateCalendar: () => void;
  onDeleteCalendar: () => void;
  onSwitchCalendar: (id: string) => void;
};

export function AppHeader({ calendars, childName, currentCalendarId, onCreateCalendar, onDeleteCalendar, onSwitchCalendar }: AppHeaderProps) {
  return (
    <header className="topbar app-header">
      <div>
        <p className="eyebrow">Meal planner</p>
        <h1>{childName}'s food calendar</h1>
      </div>
      <CalendarSwitcher
        calendars={calendars}
        currentCalendarId={currentCalendarId}
        onCreateCalendar={onCreateCalendar}
        onDeleteCalendar={onDeleteCalendar}
        onSwitchCalendar={onSwitchCalendar}
      />
    </header>
  );
}
