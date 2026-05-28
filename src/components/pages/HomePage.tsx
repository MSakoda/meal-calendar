import type { AssignmentStatus, Meal, MealAssignment, MealType, ViewMode } from '../../types';
import { PlannerCalendar } from '../calendar/PlannerCalendar';

type HomePageProps = {
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
  onOpenMealInfo: (mealId: string, assignmentId?: string) => void;
  onOpenSharedAccess: () => void;
  onPasteDay: (date: string) => void;
  onPastePeriod: () => void;
  onRemoveAssignment: (id: string) => void;
  onSetAnchor: (date: Date) => void;
  onSetEditMode: (isEditMode: boolean) => void;
  onSetView: (view: ViewMode) => void;
  onSkipAssignment: (id: string) => void;
  onUpdateStatus: (id: string, status: AssignmentStatus, skippedReason?: string) => void;
};

export function HomePage({
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
  onOpenMealInfo,
  onOpenSharedAccess,
  onPasteDay,
  onPastePeriod,
  onRemoveAssignment,
  onSetAnchor,
  onSetEditMode,
  onSetView,
  onSkipAssignment,
  onUpdateStatus,
}: HomePageProps) {
  return (
    <PlannerCalendar
      anchor={anchor}
      assignments={assignments}
      copiedSourceStart={copiedSourceStart}
      copiedType={copiedType}
      hasCopiedPlan={hasCopiedPlan}
      isEditMode={isEditMode}
      mealsById={mealsById}
      onAddSlot={onAddSlot}
      onCopyDay={onCopyDay}
      onCopyPeriod={onCopyPeriod}
      onMovePeriod={onMovePeriod}
      onOpenMealInfo={onOpenMealInfo}
      onOpenSharedAccess={onOpenSharedAccess}
      onPasteDay={onPasteDay}
      onPastePeriod={onPastePeriod}
      onRemoveAssignment={onRemoveAssignment}
      onSetAnchor={onSetAnchor}
      onSetEditMode={onSetEditMode}
      onSetView={onSetView}
      onSkipAssignment={onSkipAssignment}
      onUpdateStatus={onUpdateStatus}
      view={view}
      visibleDays={visibleDays}
    />
  );
}
