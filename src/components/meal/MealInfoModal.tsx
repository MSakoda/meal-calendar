import { Heart, Info, Pencil, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CalendarMember, Meal, Profile } from '../../types';

type MealInfoModalProps = {
  calendarOwnerId: string;
  assignmentNotes?: string;
  canEdit?: boolean;
  members: CalendarMember[];
  meal?: Meal;
  deleteConfirmText?: string;
  deleteConfirmTitle?: string;
  deleteLabel?: string;
  onClose: () => void;
  onDelete?: (mealId: string) => void;
  onEdit?: (meal: Meal) => void;
  onSaveAssignmentNotes?: (notes: string) => void;
  onToggleFavorite?: (mealId: string) => void;
  profile: Profile | null;
};

function getCreatorLabel(meal: Meal, profile: Profile | null, members: CalendarMember[], calendarOwnerId: string) {
  if (profile && meal.ownerId === profile.id) return `${profile.displayName} (${profile.email})`;
  if (meal.ownerId === calendarOwnerId) {
    const owner = members.find((member) => member.role === 'owner');
    return owner ? owner.email : 'Calendar owner';
  }
  return meal.ownerId;
}

export function MealInfoModal({
  calendarOwnerId,
  assignmentNotes,
  canEdit = false,
  deleteConfirmText,
  deleteConfirmTitle = 'Delete meal?',
  deleteLabel = 'Delete',
  members,
  meal,
  onClose,
  onDelete,
  onEdit,
  onSaveAssignmentNotes,
  onToggleFavorite,
  profile,
}: MealInfoModalProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');

  useEffect(() => {
    setNoteDraft(assignmentNotes ?? '');
  }, [assignmentNotes, meal?.id]);

  if (!meal) return null;

  const creator = getCreatorLabel(meal, profile, members, calendarOwnerId);
  const handleDelete = () => {
    if (!onDelete) return;
    onDelete(meal.id);
    setIsConfirmingDelete(false);
    onClose();
  };

  return (
    <div aria-modal="true" className="modal-backdrop" role="dialog">
      <section className="modal-panel">
        <div className="modal-header">
          <h2>
            <Info size={18} /> {meal.name}
          </h2>
          <button aria-label="Close meal details" className="icon-button" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <div className="meal-info-grid">
          <div>
            <span>Created by</span>
            <strong className="truncate-text" title={creator}>{creator}</strong>
          </div>
          <div>
            <span>Visibility</span>
            <strong>{meal.isPublic ? 'Public' : 'Private'}</strong>
          </div>
        </div>

        <section className="meal-info-section">
          <h3>Ingredients</h3>
          {meal.ingredients.length ? (
            <ul>
              {meal.ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          ) : (
            <p className="panel-note">No ingredients saved.</p>
          )}
        </section>

        {onSaveAssignmentNotes ? (
          <section className="meal-info-section">
            <h3>Notes for this calendar spot</h3>
            <textarea
              placeholder="Add notes for this planned meal"
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
            />
            <div className="modal-actions">
              <button className="primary-button" onClick={() => onSaveAssignmentNotes(noteDraft)} type="button">
                Save note
              </button>
            </div>
          </section>
        ) : (
          <section className="meal-info-section">
            <h3>Notes</h3>
            <p>{meal.notes || 'No notes saved.'}</p>
          </section>
        )}

        <div className="modal-actions">
          {onToggleFavorite && (
            <button onClick={() => onToggleFavorite(meal.id)} type="button">
              <Heart size={16} fill={meal.isFavorite ? 'currentColor' : 'none'} /> {meal.isFavorite ? 'Favorited' : 'Favorite'}
            </button>
          )}
          {canEdit && onDelete && (
            <button className="danger-button" onClick={() => setIsConfirmingDelete(true)} type="button">
              <Trash2 size={16} /> {deleteLabel}
            </button>
          )}
          {canEdit && onEdit && (
            <button className="primary-button" onClick={() => onEdit(meal)} type="button">
              <Pencil size={16} /> Edit meal
            </button>
          )}
        </div>
      </section>

      {isConfirmingDelete && (
        <div aria-modal="true" className="modal-backdrop nested-modal" role="dialog">
          <section className="modal-panel confirm-panel">
            <div className="modal-header">
              <h2>{deleteConfirmTitle}</h2>
              <button aria-label="Close delete confirmation" className="icon-button" onClick={() => setIsConfirmingDelete(false)} type="button">
                <X size={18} />
              </button>
            </div>
            <p>{deleteConfirmText || `This will remove "${meal.name}" from saved meals and planned assignments.`}</p>
            <div className="modal-actions">
              <button onClick={() => setIsConfirmingDelete(false)} type="button">
                Cancel
              </button>
              <button className="danger-button" onClick={handleDelete} type="button">
                <Trash2 size={16} /> {deleteLabel}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
