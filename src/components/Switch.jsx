export default function Switch({ id, label, checked, onChange }) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-4">
      <label htmlFor={id} className="text-sm text-ink">{label}</label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.75 transition-colors hover:ring-2 hover:ring-primary/40 ${checked ? 'justify-end bg-primary' : 'justify-start bg-muted/60'}`}
      >
        <span className="size-4.5 rounded-full bg-surface" />
      </button>
    </div>
  );
}
