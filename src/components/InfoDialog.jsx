import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

export default function InfoDialog({ isOpen, onClose, title, children, footer = true }) {
  const dialogRef = useRef(null);
  const titleRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;
    const trigger = document.activeElement;
    titleRef.current?.focus();
    return () => trigger?.focus?.();
  }, [isOpen]);

  if (!isOpen) return null;

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      onClose();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = [...dialogRef.current.querySelectorAll('button:not(:disabled), select:not(:disabled), input:not(:disabled), textarea:not(:disabled)')];
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === titleRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-band/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-[10px] border-2 border-navy bg-surface p-6 shadow-[0_8px_24px_rgba(13,51,71,0.18)]"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} ref={titleRef} tabIndex={-1} className="text-[22px] text-navy">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex size-11 shrink-0 items-center justify-center rounded-md text-navy hover:bg-primary/15 hover:text-primary"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-3 text-sm leading-relaxed text-ink">{children}</div>

        {footer && (
          <div className="flex justify-end">
            <Button variant="secondary" onClick={onClose}>
              Fechar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}