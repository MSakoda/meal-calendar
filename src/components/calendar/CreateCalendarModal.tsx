import { FormEvent, useState } from 'react';
import { X } from 'lucide-react';

type CreateCalendarModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => boolean;
};

export function CreateCalendarModal({ isOpen, onClose, onSubmit }: CreateCalendarModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nextName = name.trim();
    if (!nextName) return;
    const wasCreated = onSubmit(nextName);
    if (!wasCreated) {
      setError('A calendar with this name already exists.');
      return;
    }
    setName('');
    setError('');
    onClose();
  };

  const close = () => {
    setName('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-shell">
        <button aria-label="Close create calendar modal" className="icon-button modal-close" onClick={close}>
          <X size={16} />
        </button>
        <form className="modal-panel" onSubmit={submit}>
          <div className="modal-header">
            <h2>Create calendar</h2>
          </div>
          <label>
            Calendar name
            <input
              aria-describedby={error ? 'calendar-name-error' : undefined}
              aria-invalid={Boolean(error)}
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError('');
              }}
              placeholder="Demo"
              autoFocus
            />
          </label>
          {error && (
            <p className="form-error" id="calendar-name-error">
              {error}
            </p>
          )}
          <div className="modal-actions">
            <button className="primary-button" type="submit" disabled={!name.trim()}>
              Create calendar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
