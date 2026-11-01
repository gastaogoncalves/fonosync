import { Pause, Play, RotateCcw, Square, X } from 'lucide-react';

const speeds = [0.75, 1, 1.5, 2];

const statusText = {
  idle: 'Leitura parada',
  playing: 'Lendo a página',
  paused: 'Leitura pausada',
};

function formatTime(seconds) {
  const total = Math.max(0, Math.round(seconds));
  const minutes = String(Math.floor(total / 60)).padStart(2, '0');
  return `${minutes}:${String(total % 60).padStart(2, '0')}`;
}

function formatSpeed(value) {
  return `${String(value).replace('.', ',')}×`;
}

const controlClass =
  'flex min-h-11 items-center gap-2 rounded-md px-3 text-sm text-white transition-colors hover:bg-white/15 disabled:pointer-events-none disabled:opacity-40';

export default function PageReader({ speech, title, onClose }) {
  return (
    <section
      aria-label="Leitor da página"
      data-no-read
      className="fixed right-6 bottom-6 z-50 flex w-120 max-w-[calc(100vw-2rem)] flex-col gap-3 bg-band p-4 text-white shadow-[0_8px_24px_rgba(13,51,71,0.25)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold">Ouvindo: {title}</p>
          <p className="text-sm text-on-band-muted">
            {formatTime(speech.elapsed)} / {formatTime(speech.duration)}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar leitor da página"
          className="flex size-11 shrink-0 items-center justify-center rounded-md hover:bg-white/15"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      {!speech.supported && (
        <p className="text-sm text-on-band-muted">
          Este navegador não tem leitura em voz alta. Use o Chrome, o Edge ou o Safari.
        </p>
      )}

      <div className="h-1 bg-white/20" aria-hidden="true">
        <div className="h-1 bg-accent" style={{ width: `${Math.min(100, speech.progress * 100)}%` }} />
      </div>

      <p className="sr-only" role="status">
        {statusText[speech.status]}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-1">
        <button
          type="button"
          onClick={speech.play}
          disabled={!speech.supported || speech.status === 'playing'}
          className={controlClass}
        >
          <Play size={16} aria-hidden="true" />
          Reproduzir
        </button>
        <button
          type="button"
          onClick={speech.pause}
          disabled={speech.status !== 'playing'}
          className={controlClass}
        >
          <Pause size={16} aria-hidden="true" />
          Pausar
        </button>
        <button
          type="button"
          onClick={speech.stop}
          disabled={speech.status === 'idle'}
          className={controlClass}
        >
          <Square size={16} aria-hidden="true" />
          Parar
        </button>
        <button type="button" onClick={speech.restart} disabled={!speech.supported} className={controlClass}>
          <RotateCcw size={16} aria-hidden="true" />
          Reiniciar
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center gap-1" role="group" aria-label="Velocidade">
          <span className="mr-1">Velocidade</span>
          {speeds.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={speech.rate === value}
              onClick={() => speech.setRate(value)}
              className={`min-h-11 rounded-md px-2 transition-colors ${
                speech.rate === value ? 'bg-white font-bold text-band' : 'hover:bg-white/15'
              }`}
            >
              {formatSpeed(value)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="leitor-volume">Volume</label>
          <input
            id="leitor-volume"
            type="range"
            min="0"
            max="100"
            step="10"
            value={Math.round(speech.volume * 100)}
            onChange={(event) => speech.setVolume(Number(event.target.value) / 100)}
            className="w-24 accent-accent"
          />
          <span className="w-10 tabular-nums">{Math.round(speech.volume * 100)}%</span>
        </div>
      </div>
    </section>
  );
}
