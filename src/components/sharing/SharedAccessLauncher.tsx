import { Share2 } from 'lucide-react';

type SharedAccessLauncherProps = {
  memberCount: number;
  onOpen: () => void;
};

export function SharedAccessLauncher({ memberCount, onOpen }: SharedAccessLauncherProps) {
  return (
    <section className="tool-panel compact-panel">
      <h2>
        <Share2 size={18} /> Shared access
      </h2>
      <p className="panel-note">{memberCount} members can access this calendar.</p>
      <button className="primary-button" onClick={onOpen} type="button">
        <Share2 size={18} /> Manage access
      </button>
    </section>
  );
}
