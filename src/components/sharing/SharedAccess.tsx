import { Share2 } from 'lucide-react';
import { FormEvent } from 'react';
import type { CalendarMember, MemberRole } from '../../types';
import { roleDescriptions } from '../../utils/constants';

type InviteDraft = {
  email: string;
  role: MemberRole;
};

type SharedAccessProps = {
  className?: string;
  inviteDraft: InviteDraft;
  members: CalendarMember[];
  onInvite: (event: FormEvent) => void;
  onInviteChange: (inviteDraft: InviteDraft) => void;
  onRemoveMember: (memberId: string) => void;
};

export function SharedAccess({ className = 'tool-panel', inviteDraft, members, onInvite, onInviteChange, onRemoveMember }: SharedAccessProps) {
  return (
    <form className={className} onSubmit={onInvite}>
      <h2>
        <Share2 size={18} /> Shared access
      </h2>
      <div className="field-row">
        <input placeholder="partner@example.com" value={inviteDraft.email} onChange={(event) => onInviteChange({ ...inviteDraft, email: event.target.value })} />
        <select value={inviteDraft.role} onChange={(event) => onInviteChange({ ...inviteDraft, role: event.target.value as MemberRole })}>
          <option value="editor">editor</option>
          <option value="viewer">viewer</option>
        </select>
      </div>
      <button className="primary-button" type="submit">
        Invite
      </button>
      {members.map((member) => (
        <div className="member-row" key={member.id}>
          <span>{member.email}</span>
          <small>{member.role} - {roleDescriptions[member.role]}</small>
          {member.role !== 'owner' && (
            <button onClick={() => onRemoveMember(member.id)} type="button">
              Remove
            </button>
          )}
        </div>
      ))}
    </form>
  );
}
