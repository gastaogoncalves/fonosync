import { useRef, useState } from 'react';
import AccessibilityPanel from './AccessibilityPanel';
import PageReader from './PageReader';
import { buttonClass } from './buttonStyles';
import { useSpeech } from '../hooks/useSpeech';

export default function A11yActions({ onDark = false }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [readerTitle, setReaderTitle] = useState(null);
  const panelButtonRef = useRef(null);
  const readerButtonRef = useRef(null);
  const speech = useSpeech();

  function closePanel() {
    setPanelOpen(false);
    panelButtonRef.current?.focus();
  }

  function openReader() {
    const heading = document.querySelector('main h1') ?? document.querySelector('h1');
    setReaderTitle(heading?.innerText.trim() || document.title);
    speech.restart();
  }

  function closeReader() {
    speech.stop();
    setReaderTitle(null);
    readerButtonRef.current?.focus();
  }

  const readerOpen = readerTitle !== null;

  return (
    <div className="relative flex items-center gap-2" data-no-read>
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
        <button
          ref={readerButtonRef}
          type="button"
          aria-pressed={readerOpen}
          onClick={() => (readerOpen ? closeReader() : openReader())}
          className={buttonClass(readerOpen ? 'primary' : onDark ? 'tertiaryOnDark' : 'tertiary')}
        >
          Ouvir página
        </button>
      </span>

      {panelOpen && <AccessibilityPanel id="painel-acessibilidade" onClose={closePanel} />}
      {readerOpen && <PageReader speech={speech} title={readerTitle} onClose={closeReader} />}
    </div>
  );
}
