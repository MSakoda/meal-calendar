import { CircleSlash, X } from 'lucide-react';
import { FormEvent } from 'react';

const skipReasons = ['Ordered out', 'Skipped meal', 'Other'];

type SkipDraft = {
  assignmentId: string;
  reason: string;
  note: string;
};

type SkipReasonModalProps = {
  draft: SkipDraft;
  isOpen: boolean;
  onChange: (draft: SkipDraft) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
};

export function SkipReasonModal({ draft, isOpen, onChange, onClose, onSubmit }: SkipReasonModalProps) {
  if (!isOpen) return null;

  return (
    <div aria-modal="true" className="modal-backdrop" role="dialog">
      <form className="modal-panel" onSubmit={onSubmit}>
        <div className="modal-header">
          <h2>
            <CircleSlash size={18} /> Why skip this meal?
          </h2>
          <button aria-label="Close skip reason modal" className="icon-button" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <div className="reason-options">
          {skipReasons.map((reason) => (
            <button
              className={draft.reason === reason ? 'reason-option selected' : 'reason-option'}
              key={reason}
              onClick={() => onChange({ ...draft, reason })}
              type="button"
            >
              {reason}
            </button>
          ))}
        </div>

        {draft.reason === 'Other' && (
          <textarea
            autoFocus
            placeholder="Add a short note"
            value={draft.note}
            onChange={(event) => onChange({ ...draft, note: event.target.value })}
          />
        )}

        <div className="modal-actions">
          <button onClick={onClose} type="button">
            Cancel
          </button>
          <button className="primary-button" type="submit">
            Save reason
          </button>
        </div>
      </form>
    </div>
  );
}
