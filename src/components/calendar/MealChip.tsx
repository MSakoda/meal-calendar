import { Check, CircleSlash, Info, StickyNote, Trash2 } from 'lucide-react';
import type { AssignmentStatus, Meal, MealAssignment } from '../../types';

type MealChipProps = {
  assignment: MealAssignment;
  isEditMode: boolean;
  meal: Meal;
  onOpenMealInfo: (mealId: string, assignmentId?: string) => void;
  onRemoveAssignment: (id: string) => void;
  onSkipAssignment: (id: string) => void;
  onUpdateStatus: (id: string, status: AssignmentStatus, skippedReason?: string) => void;
};

export function MealChip({
  assignment,
  isEditMode,
  meal,
  onOpenMealInfo,
  onRemoveAssignment,
  onSkipAssignment,
  onUpdateStatus,
}: MealChipProps) {
  return (
    <div className="meal-chip" style={{ borderLeftColor: meal.color }}>
      <div className="meal-chip-header">
        <strong>{meal.name}</strong>
        <div className="meal-chip-icons">
          <button aria-label={`View details for ${meal.name}`} className="meal-info-button" data-tooltip="Meal details" onClick={() => onOpenMealInfo(meal.id, assignment.id)}>
            <Info size={15} />
          </button>
          {assignment.skippedReason && (
            <span className="note-tooltip" tabIndex={0}>
              <StickyNote size={15} />
              <span role="tooltip">{assignment.skippedReason}</span>
            </span>
          )}
        </div>
      </div>
      <div className="chip-actions">
        <button
          aria-label="Mark meal followed"
          className={assignment.status === 'followed' ? 'status-icon followed active' : 'status-icon followed'}
          data-tooltip="Mark meal followed"
          onClick={() => onUpdateStatus(assignment.id, 'followed')}
        >
          <Check size={14} />
        </button>
        <button
          aria-label="Mark meal skipped"
          className={assignment.status === 'skipped' ? 'status-icon skipped active' : 'status-icon skipped'}
          data-tooltip="Mark meal skipped"
          onClick={() => onSkipAssignment(assignment.id)}
        >
          <CircleSlash size={14} />
        </button>
        {isEditMode && (
          <button aria-label="Remove meal assignment" className="status-icon" data-tooltip="Remove meal" onClick={() => onRemoveAssignment(assignment.id)}>
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <div className="print-checks">
        <span>Followed</span>
        <span>Skipped</span>
      </div>
    </div>
  );
}
