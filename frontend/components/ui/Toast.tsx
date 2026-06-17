interface ToastProps {
  type: 'info' | 'success' | 'error';
  message: string;
  onClose: () => void; // new prop
  body?: React.ReactNode; // optional body content
}

export function Toast({ type, message, onClose, body }: ToastProps) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`alert alert-${type} shadow-lg flex items-center gap-2`}>
        <span>{message}</span>
       {body}
        <button
          className="btn btn-sm btn-circle btn-ghost ml-auto"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
