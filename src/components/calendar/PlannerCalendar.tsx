import { isBefore, isSameDay, startOfDay } from 'date-fns';
import type { AssignmentStatus, Meal, MealAssignment, MealType, ViewMode } from '../../types';
import { toDateKey } from '../../utils/date';
import { CalendarDayColumn } from './CalendarDayColumn';
import { CalendarHeader } from './CalendarHeader';

type PlannerCalendarProps = {
  anchor: Date;
  assignments: MealAssignment[];
  copiedSourceStart?: string;
  copiedType?: ViewMode | 'day';
  hasCopiedPlan: boolean;
  isEditMode: boolean;
  mealsById: Map<string, Meal>;
  view: ViewMode;
  visibleDays: Date[];
  onAddSlot: (date: string, slot: MealType) => void;
  onCopyDay: (date: string) => void;
  onCopyPeriod: () => void;
  onMovePeriod: (direction: -1 | 1) => void;
  onRemoveAssignment: (id: string) => void;
  onOpenMealInfo: (mealId: string, assignmentId?: string) => void;
  onOpenSharedAccess: () => void;
  onPasteDay: (date: string) => void;
  onPastePeriod: () => void;
  onSetEditMode: (isEditMode: boolean) => void;
  onSetAnchor: (date: Date) => void;
  onSetView: (view: ViewMode) => void;
  onSkipAssignment: (id: string) => void;
  onUpdateStatus: (id: string, status: AssignmentStatus, replacementMeal?: string) => void;
};

export function PlannerCalendar({
  anchor,
  assignments,
  copiedSourceStart,
  copiedType,
  hasCopiedPlan,
  isEditMode,
  mealsById,
  view,
  visibleDays,
  onAddSlot,
  onCopyDay,
  onCopyPeriod,
  onMovePeriod,
  onRemoveAssignment,
  onOpenMealInfo,
  onOpenSharedAccess,
  onPasteDay,
  onPastePeriod,
  onSetEditMode,
  onSetAnchor,
  onSetView,
  onSkipAssignment,
  onUpdateStatus,
}: PlannerCalendarProps) {
  const todayKey = toDateKey(new Date());
  const today = startOfDay(new Date());
  const includesToday = visibleDays.some((day) => toDateKey(day) === todayKey);
  const periodStart = toDateKey(visibleDays[0]);
  const hasPeriodCopy = hasCopiedPlan && copiedType === view;
  const hasDayCopy = hasCopiedPlan && copiedType === 'day';
  const isPeriodCopySource = copiedType === view && copiedSourceStart === periodStart;

  return (
    <section className="planner">
      <CalendarHeader
        anchor={anchor}
        includesToday={includesToday}
        isEditMode={isEditMode}
        hasCopiedPlan={hasPeriodCopy}
        isPeriodCopySource={isPeriodCopySource}
        onCopyPeriod={onCopyPeriod}
        onMovePeriod={onMovePeriod}
        onOpenSharedAccess={onOpenSharedAccess}
        onPastePeriod={onPastePeriod}
        onSetAnchor={onSetAnchor}
        onSetEditMode={onSetEditMode}
        onSetView={onSetView}
        view={view}
      />
      <div className={view === 'week' ? 'week-grid' : 'month-grid'}>
        {visibleDays.map((day) => {
          const dayState = isSameDay(day, today) ? 'today' : isBefore(day, today) ? 'past' : 'future';
          const dateKey = toDateKey(day);
          return (
            <CalendarDayColumn
              assignments={assignments}
              day={day}
              dayState={dayState}
              hasCopiedPlan={hasDayCopy}
              isEditMode={isEditMode}
              isCopySource={copiedType === 'day' && copiedSourceStart === dateKey}
              key={dateKey}
              mealsById={mealsById}
              onAddSlot={onAddSlot}
              onCopyDay={onCopyDay}
              onOpenMealInfo={onOpenMealInfo}
              onPasteDay={onPasteDay}
              onRemoveAssignment={onRemoveAssignment}
              onSkipAssignment={onSkipAssignment}
              onUpdateStatus={onUpdateStatus}
            />
          );
        })}
      </div>
    </section>
  );
}
