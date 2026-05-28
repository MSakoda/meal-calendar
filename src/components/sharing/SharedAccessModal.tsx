import { X } from 'lucide-react';
import { FormEvent } from 'react';
import type { CalendarMember, MemberRole } from '../../types';
import { SharedAccess } from './SharedAccess';

type InviteDraft = {
  email: string;
  role: MemberRole;
};

type SharedAccessModalProps = {
  inviteDraft: InviteDraft;
  isOpen: boolean;
  members: CalendarMember[];
  onClose: () => void;
  onInvite: (event: FormEvent) => void;
  onInviteChange: (inviteDraft: InviteDraft) => void;
  onRemoveMember: (memberId: string) => void;
};

export function SharedAccessModal({
  inviteDraft,
  isOpen,
  members,
  onClose,
  onInvite,
  onInviteChange,
  onRemoveMember,
}: SharedAccessModalProps) {
  if (!isOpen) return null;

  return (
    <div aria-modal="true" className="modal-backdrop" role="dialog">
      <div className="modal-shell">
        <button aria-label="Close shared access modal" className="icon-button modal-close" onClick={onClose} type="button">
          <X size={18} />
        </button>
        <SharedAccess
          className="modal-panel"
          inviteDraft={inviteDraft}
          members={members}
          onInvite={onInvite}
          onInviteChange={onInviteChange}
          onRemoveMember={onRemoveMember}
        />
      </div>
    </div>
  );
}
