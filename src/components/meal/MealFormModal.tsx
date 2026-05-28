import { X } from 'lucide-react';
import { FormEvent } from 'react';
import type { MealInput } from '../../types';
import { MealForm } from './MealForm';

type MealFormModalProps = {
  canAddMeal: boolean;
  draft: MealInput;
  isEditing: boolean;
  isOpen: boolean;
  onChange: (draft: MealInput) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
};

export function MealFormModal({ canAddMeal, draft, isEditing, isOpen, onChange, onClose, onSubmit }: MealFormModalProps) {
  if (!isOpen) return null;

  return (
    <div aria-modal="true" className="modal-backdrop" role="dialog">
      <div className="modal-shell">
        <button aria-label="Close meal form modal" className="icon-button modal-close" onClick={onClose} type="button">
          <X size={18} />
        </button>
        <MealForm
          canAddMeal={canAddMeal}
          className="modal-panel"
          draft={draft}
          isEditing={isEditing}
          onCancel={onClose}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
