import { useState } from 'react';
import { Sun, Volume2 } from 'lucide-react';
import A11yModal from './A11yModal';

export default function A11yActions() {
  const [showA11y, setShowA11y] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowA11y(true)}
          className="px-3 py-1.5 text-xs font-bold border border-navy rounded-md text-navy hover:bg-mist flex items-center gap-1.5"
        >
          <Sun size={14} /> Acessibilidade
        </button>
        <button
          type="button"
          onClick={() => setShowA11y(true)}
          className="px-3 py-1.5 text-xs font-bold border border-line rounded-md text-navy hover:bg-mist flex items-center gap-1.5"
        >
          <Volume2 size={14} /> Ouvir página
        </button>
      </div>

      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />
    </>
  );
}