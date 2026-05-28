type AppToastProps = {
  message: string;
  onDismiss: () => void;
};

export function AppToast({ message, onDismiss }: AppToastProps) {
  if (!message) return null;

  return (
    <div className="app-toast" role="status">
      <span>{message}</span>
      <button aria-label="Dismiss message" onClick={onDismiss} type="button">
        Dismiss
      </button>
    </div>
  );
}
