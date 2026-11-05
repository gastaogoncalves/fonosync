import { useEffect, useRef } from 'react';
import { Pause, Play, RotateCcw, Square } from 'lucide-react';
import { useA11y } from '../hooks/useA11y';

const speeds = [0.75, 1, 1.5, 2];

function formatTime(seconds) {
  const safe = Math.max(0, Math.round(seconds));
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
}

function ControlButton({ icon: Icon, label, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 text-xs font-bold transition-colors hover:bg-white/10 ${
        active ? 'text-accent' : 'text-white'
      }`}
    >
      <Icon size={16} aria-hidden="true" />
      {label}
    </button>
  );
}

export default function AudioPlayerBar() {
  const {
    isPlayerOpen,
    playerStatus,
    currentTime,
    duration,
    speed,
    volume,
    pageTitle,
    playAudio,
    pauseAudio,
    stopAudio,
    restartAudio,
    setSpeed,
    setVolume,
  } = useA11y();
  const barRef = useRef(null);

  // Abre espaço no fim da página para a barra não cobrir o conteúdo
  useEffect(() => {
    if (!isPlayerOpen) return undefined;
    const previous = document.body.style.paddingBottom;
    document.body.style.paddingBottom = `${barRef.current?.offsetHeight ?? 0}px`;
    return () => {
      document.body.style.paddingBottom = previous;
    };
  }, [isPlayerOpen]);

  if (!isPlayerOpen) return null;

  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <section
      ref={barRef}
      aria-label="Leitor de voz da página"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-band p-4 font-sans text-white shadow-2xl"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-sans text-sm font-bold">Ouvindo: {pageTitle}</h2>
          <p className="font-mono text-xs text-on-band-muted">
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>
        </div>

        <div
          role="progressbar"
          aria-label="Progresso da leitura"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          className="h-1.5 w-full overflow-hidden rounded-full bg-white/25"
        >
          <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1">
            <ControlButton icon={Play} label="Reproduzir" active={playerStatus === 'playing'} onClick={playAudio} />
            <ControlButton icon={Pause} label="Pausar" active={playerStatus === 'paused'} onClick={pauseAudio} />
            <ControlButton icon={Square} label="Parar" onClick={stopAudio} />
            <ControlButton icon={RotateCcw} label="Reiniciar" onClick={restartAudio} />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-on-band-muted">
            <div role="group" aria-label="Velocidade" className="flex items-center gap-1">
              <span>Velocidade</span>
              {speeds.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={speed === option}
                  onClick={() => setSpeed(option)}
                  className={`min-h-11 rounded px-2 ${speed === option ? 'font-bold text-accent underline' : 'hover:text-white'}`}
                >
                  {String(option).replace('.', ',')}×
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2">
              Volume
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="w-24 accent-accent"
              />
              <span className="w-10 text-right">{volume}%</span>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}