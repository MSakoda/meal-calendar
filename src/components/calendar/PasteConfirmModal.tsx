import { X } from 'lucide-react';

type PasteConfirmModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function PasteConfirmModal({ isOpen, onCancel, onConfirm }: PasteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-shell">
        <button aria-label="Close paste confirmation" className="icon-button modal-close" onClick={onCancel}>
          <X size={16} />
        </button>
        <section className="modal-panel confirm-panel" role="dialog" aria-modal="true" aria-labelledby="paste-confirm-title">
          <div className="modal-header">
            <h2 id="paste-confirm-title">Replace planned meals?</h2>
          </div>
          <p className="panel-note">This target already has meals planned. Pasting will replace the meals in that selection.</p>
          <div className="modal-actions">
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
            <button className="primary-button" type="button" onClick={onConfirm}>
              Paste meals
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
