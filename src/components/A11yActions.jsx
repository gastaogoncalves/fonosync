import { useRef, useState } from 'react';
import AccessibilityPanel from './AccessibilityPanel';
import { buttonClass } from './buttonStyles';

export default function A11yActions() {
  const [panelOpen, setPanelOpen] = useState(false);
  const panelButtonRef = useRef(null);

  function closePanel() {
    setPanelOpen(false);
    panelButtonRef.current?.focus();
  }

  return (
    <div className="relative flex items-center gap-2">
      <button
        ref={panelButtonRef}
        type="button"
        aria-expanded={panelOpen}
        aria-controls="painel-acessibilidade"
        onClick={() => (panelOpen ? closePanel() : setPanelOpen(true))}
        className={buttonClass(panelOpen ? 'primary' : 'secondary')}
      >
        Acessibilidade
      </button>
      <span className="hidden md:inline-flex">
        <button type="button" className={buttonClass('tertiary')}>
          Ouvir página
        </button>
      </span>

      {panelOpen && <AccessibilityPanel id="painel-acessibilidade" onClose={closePanel} />}
    </div>
  );
}
