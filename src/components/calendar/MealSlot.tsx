import type { AssignmentStatus, Meal, MealAssignment, MealType } from '../../types';
import { MealChip } from './MealChip';

type MealSlotProps = {
  assignment?: MealAssignment;
  dateKey: string;
  isEditMode: boolean;
  meal?: Meal;
  slot: MealType;
  onAddSlot: (date: string, slot: MealType) => void;
  onOpenMealInfo: (mealId: string, assignmentId?: string) => void;
  onRemoveAssignment: (id: string) => void;
  onSkipAssignment: (id: string) => void;
  onUpdateStatus: (id: string, status: AssignmentStatus, skippedReason?: string) => void;
};

export function MealSlot({
  assignment,
  dateKey,
  isEditMode,
  meal,
  slot,
  onAddSlot,
  onOpenMealInfo,
  onRemoveAssignment,
  onSkipAssignment,
  onUpdateStatus,
}: MealSlotProps) {
  return (
    <div className="slot">
      <span>{slot}</span>
      {meal && assignment ? (
        <MealChip
          assignment={assignment}
          isEditMode={isEditMode}
          meal={meal}
          onOpenMealInfo={onOpenMealInfo}
          onRemoveAssignment={onRemoveAssignment}
          onSkipAssignment={onSkipAssignment}
          onUpdateStatus={onUpdateStatus}
        />
      ) : isEditMode ? (
        <button className="empty-slot" onClick={() => onAddSlot(dateKey, slot)}>
          Add
        </button>
      ) : (
        <span className="empty-slot-placeholder" />
      )}
    </div>
  );
}
