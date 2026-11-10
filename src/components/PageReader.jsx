import { Pause, Play, RotateCcw, Square, X } from 'lucide-react';
import { useA11y } from '../hooks/useA11y';
import { VOICE_OPTIONS } from '../utils/constants';

const speeds = [0.75, 1, 1.5, 2];

const statusText = {
  idle: 'Leitura parada',
  playing: 'Lendo a página',
  paused: 'Leitura pausada',
  done: 'Leitura concluída',
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

const optionClass = (active) =>
  `min-h-11 rounded-md px-2 transition-colors ${active ? 'bg-white font-bold text-band' : 'hover:bg-white/15'}`;

export default function PageReader() {
  const {
    isPlayerOpen,
    playerStatus,
    pageTitle,
    elapsed,
    duration,
    progress,
    playAudio,
    pauseAudio,
    stopAudio,
    restartAudio,
    closePlayer,
    speechRate,
    setSpeechRate,
    volume,
    setVolume,
    voiceGender,
    setVoiceGender,
    speechSupported,
  } = useA11y();

  if (!isPlayerOpen) return null;

  return (
    <section
      aria-label="Leitor da página"
      data-a11y-skip
      className="fixed right-6 bottom-6 z-50 flex w-120 max-w-[calc(100vw-2rem)] flex-col gap-3 bg-band p-4 text-white shadow-[0_8px_24px_rgba(13,51,71,0.25)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold">Ouvindo: {pageTitle}</p>
          <p className="text-sm text-on-band-muted">
            {formatTime(elapsed)} / {formatTime(duration)}
          </p>
        </div>
        <button
          type="button"
          onClick={closePlayer}
          aria-label="Fechar leitor da página"
          className="flex size-11 shrink-0 items-center justify-center rounded-md hover:bg-white/15"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      {!speechSupported && (
        <p className="text-sm text-on-band-muted">
          Este navegador não tem leitura em voz alta. Use o Chrome, o Edge ou o Safari.
        </p>
      )}

      <div className="h-1 bg-white/20" aria-hidden="true">
        <div className="h-1 bg-accent" style={{ width: `${Math.min(100, progress * 100)}%` }} />
      </div>

      <p className="sr-only" role="status">
        {statusText[playerStatus]}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-1">
        <button type="button" onClick={playAudio} disabled={playerStatus === 'playing'} className={controlClass}>
          <Play size={16} aria-hidden="true" />
          Reproduzir
        </button>
        <button type="button" onClick={pauseAudio} disabled={playerStatus !== 'playing'} className={controlClass}>
          <Pause size={16} aria-hidden="true" />
          Pausar
        </button>
        <button type="button" onClick={stopAudio} disabled={playerStatus === 'idle'} className={controlClass}>
          <Square size={16} aria-hidden="true" />
          Parar
        </button>
        <button type="button" onClick={restartAudio} className={controlClass}>
          <RotateCcw size={16} aria-hidden="true" />
          Reiniciar
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center gap-1" role="group" aria-label="Voz">
          <span className="mr-1">Voz</span>
          {VOICE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={voiceGender === option.value}
              onClick={() => setVoiceGender(option.value)}
              className={optionClass(voiceGender === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1" role="group" aria-label="Velocidade">
          <span className="mr-1">Velocidade</span>
          {speeds.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={speechRate === value}
              onClick={() => setSpeechRate(value)}
              className={optionClass(speechRate === value)}
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
            value={Math.round(volume * 100)}
            onChange={(event) => setVolume(Number(event.target.value) / 100)}
            className="w-24 accent-accent"
          />
          <span className="w-10 tabular-nums">{Math.round(volume * 100)}%</span>
        </div>
      </div>
    </section>
  );
}
