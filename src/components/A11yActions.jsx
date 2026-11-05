import { useState } from 'react';
import AccessibilityPanel from './AccessibilityPanel';

const baseClass = 'px-3 py-1.5 text-xs font-bold border rounded-md transition-colors';

export default function A11yActions() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="a11y-painel"
        className={`${baseClass} border-primary bg-primary text-on-primary hover:brightness-[0.82]`}
      >
        Acessibilidade
      </button>

      {open && <AccessibilityPanel id="a11y-painel" onClose={() => setOpen(false)} />}
    </div>
  );
}