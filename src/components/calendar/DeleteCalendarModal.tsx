import { X } from 'lucide-react';
import type { MealCalendar } from '../../types';

type DeleteCalendarModalProps = {
  calendar: MealCalendar;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteCalendarModal({ calendar, isOpen, onClose, onConfirm }: DeleteCalendarModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-shell">
        <button aria-label="Close delete calendar modal" className="icon-button modal-close" onClick={onClose}>
          <X size={16} />
        </button>
        <section className="modal-panel confirm-panel" role="dialog" aria-modal="true" aria-labelledby="delete-calendar-title">
          <div className="modal-header">
            <h2 id="delete-calendar-title">Delete calendar?</h2>
          </div>
          <p className="panel-note">
            This will remove {calendar.name} and its planned meals from the demo calendar data.
          </p>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="danger-button" type="button" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
