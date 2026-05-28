import { ClipboardPaste, Copy } from 'lucide-react';
import type { AssignmentStatus, Meal, MealAssignment, MealType } from '../../types';
import { mealTypes } from '../../utils/constants';
import { prettyDay, toDateKey } from '../../utils/date';
import { MealSlot } from './MealSlot';

type CalendarDayColumnProps = {
  assignments: MealAssignment[];
  day: Date;
  dayState: 'past' | 'today' | 'future';
  hasCopiedPlan: boolean;
  isEditMode: boolean;
  isCopySource: boolean;
  mealsById: Map<string, Meal>;
  onAddSlot: (date: string, slot: MealType) => void;
  onCopyDay: (date: string) => void;
  onOpenMealInfo: (mealId: string, assignmentId?: string) => void;
  onPasteDay: (date: string) => void;
  onRemoveAssignment: (id: string) => void;
  onSkipAssignment: (id: string) => void;
  onUpdateStatus: (id: string, status: AssignmentStatus, skippedReason?: string) => void;
};

export function CalendarDayColumn({
  assignments,
  day,
  dayState,
  hasCopiedPlan,
  isEditMode,
  isCopySource,
  mealsById,
  onAddSlot,
  onCopyDay,
  onOpenMealInfo,
  onPasteDay,
  onRemoveAssignment,
  onSkipAssignment,
  onUpdateStatus,
}: CalendarDayColumnProps) {
  const dateKey = toDateKey(day);
  const dayAssignments = assignments.filter((assignment) => assignment.date === dateKey);
  const visibleSlots = isEditMode ? mealTypes : mealTypes.filter((slot) => dayAssignments.some((item) => item.slot === slot));
  const dayTone = day.getDate() % 2 === 0 ? 'even-day' : 'odd-day';

  return (
    <article className={`day-column ${dayState} ${dayTone}`} data-date={dateKey}>
      <div className="day-column-header">
        <h3>{prettyDay(day)}</h3>
        {isEditMode && (
          <div className="day-copy-actions">
            <button aria-label="Copy day meals" className="day-action-button" data-tooltip="Copy day" onClick={() => onCopyDay(dateKey)}>
              <Copy size={13} />
            </button>
            {hasCopiedPlan && !isCopySource && (
              <button aria-label="Paste copied meals to day" className="day-action-button" data-tooltip="Paste here" onClick={() => onPasteDay(dateKey)}>
                <ClipboardPaste size={13} />
              </button>
            )}
          </div>
        )}
      </div>
      {!isEditMode && !dayAssignments.length && <p className="day-empty-note">No meals planned</p>}
      {visibleSlots.map((slot) => {
        const assignment = dayAssignments.find((item) => item.slot === slot);
        const meal = assignment ? mealsById.get(assignment.mealId) : undefined;
        return (
          <MealSlot
            assignment={assignment}
            dateKey={dateKey}
            isEditMode={isEditMode}
            key={slot}
            meal={meal}
            onAddSlot={onAddSlot}
            onOpenMealInfo={onOpenMealInfo}
            onRemoveAssignment={onRemoveAssignment}
            onSkipAssignment={onSkipAssignment}
            onUpdateStatus={onUpdateStatus}
            slot={slot}
          />
        );
      })}
    </article>
  );
}
