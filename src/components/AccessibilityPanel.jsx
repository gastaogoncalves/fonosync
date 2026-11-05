import { useEffect, useRef } from 'react';
import { RotateCcw, Save, Volume2, VolumeX, X } from 'lucide-react';
import Button from './Button';
import Notice from './Notice';
import Switch from './Switch';
import { useA11y } from '../context/A11yContext';
import {
  BUTTON_OPTIONS,
  COLOR_MODE_OPTIONS,
  FONT_MAX,
  FONT_MIN,
  FONT_STEP,
  LEADING_OPTIONS,
  SPEECH_RATE_MAX,
  SPEECH_RATE_MIN,
  SPEECH_RATE_STEP,
  TEXT_OPTIONS,
  TRACKING_OPTIONS,
  VOICE_OPTIONS,
} from '../utils/constants';

const toggles = [
  { key: 'highContrast', label: 'Alto contraste' },
  { key: 'darkMode', label: 'Modo escuro' },
  { key: 'reduceMotion', label: 'Reduzir animações' },
  { key: 'largeTargets', label: 'Aumentar elementos interativos' },
];

const formatRate = (rate) => `${String(rate).replace('.', ',')}×`;

const fieldClass = 'min-h-11 w-full rounded-md border border-muted/60 bg-surface px-3 text-sm text-ink';

function SelectField({ id, label, value, options, onChange, className = 'flex-1' }) {
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-bold text-ink">{label}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}

function SwatchGroup({ legend, name, options, value, onChange, locked }) {
  const current = options.find((option) => option.id === value);

  return (
    <fieldset disabled={locked} className={`min-w-0 ${locked ? 'opacity-55' : ''}`}>
      <legend className="mb-1.5 text-sm font-bold text-ink">
        {legend} <span className="font-normal text-muted">· {current?.label}</span>
      </legend>
      <div className="flex flex-wrap items-center gap-1.5">
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <label
              key={option.id}
              className={`relative flex h-10 min-w-10 items-center justify-center rounded-md border-2 text-sm text-ink has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus ${
                option.hex ? 'px-0' : 'px-2.5'
              } ${selected ? 'border-navy' : 'border-transparent hover:border-line'} ${locked ? '' : 'cursor-pointer'}`}
            >
              <input
                type="radio"
                name={name}
                value={option.id}
                checked={selected}
                onChange={() => onChange(option.id)}
                className="sr-only"
              />
              {option.hex ? (
                <>
                  <span aria-hidden="true" className="size-7 rounded-full border border-muted/40" style={{ backgroundColor: option.hex }} />
                  <span className="sr-only">{option.label}</span>
                </>
              ) : (
                <span>{option.label}</span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function AccessibilityPanel({
  id = 'a11y-painel',
  onClose,
  className = 'absolute top-[calc(100%+14px)] right-0',
}) {
  const {
    settings,
    updateSettings,
    hasUnsavedChanges,
    savePreferences,
    resetDefaults,
    saveStatus,
    isPlaying,
    playerStatus,
    speakPageContent,
    stopSpeaking,
    voiceGender,
    setVoiceGender,
    speechRate,
    setSpeechRate,
    speechSupported,
  } = useA11y();
  const titleRef = useRef(null);

  useEffect(() => {
    const trigger = document.activeElement;
    titleRef.current?.focus();
    return () => trigger?.focus?.();
  }, []);

  const colorsLocked = settings.darkMode || settings.highContrast;

  return (
    <div
      id={id}
      role="dialog"
      data-a11y-skip
      aria-labelledby={`${id}-titulo`}
      onKeyDown={(event) => event.key === 'Escape' && onClose()}
      className={`${className} z-50 flex max-h-[calc(100vh-112px)] w-97.5 max-w-[calc(100vw-2rem)] flex-col gap-3.5 overflow-y-auto rounded-[10px] border-2 border-navy bg-surface p-5 shadow-[0_8px_24px_rgba(13,51,71,0.09)]`}
    >
      <div className="flex items-center justify-between">
        <h2 id={`${id}-titulo`} ref={titleRef} tabIndex={-1} className="text-[22px] text-navy">
          Acessibilidade
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar painel de acessibilidade"
          className="flex size-11 items-center justify-center rounded-md text-navy hover:bg-primary/15 hover:text-primary"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <section aria-labelledby={`${id}-leitor`} className="flex flex-col gap-3 rounded-md border border-line bg-mist p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 id={`${id}-leitor`} className="flex items-center gap-1.5 font-sans text-sm font-bold text-navy">
            <Volume2 size={16} className="text-primary" aria-hidden="true" />
            Leitor de voz
          </h3>
          <Button
            variant={isPlaying ? 'danger' : 'primary'}
            onClick={() => (isPlaying ? stopSpeaking() : speakPageContent())}
            disabled={!speechSupported}
          >
            {isPlaying ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
            {isPlaying ? 'Parar leitura' : 'Ouvir página'}
          </Button>
        </div>

        <SelectField
          id={`${id}-voz`}
          label="Voz"
          value={voiceGender}
          options={VOICE_OPTIONS}
          onChange={setVoiceGender}
          className="w-full"
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-velocidade`} className="text-sm font-bold text-ink">
            Velocidade da fala <span className="font-normal text-muted">· {formatRate(speechRate)}</span>
          </label>
          <input
            id={`${id}-velocidade`}
            type="range"
            min={SPEECH_RATE_MIN}
            max={SPEECH_RATE_MAX}
            step={SPEECH_RATE_STEP}
            value={speechRate}
            onChange={(event) => setSpeechRate(Number(event.target.value))}
            aria-valuetext={`${formatRate(speechRate)} (de ${formatRate(SPEECH_RATE_MIN)} a ${formatRate(SPEECH_RATE_MAX)})`}
            className="h-6 w-full accent-primary"
          />
        </div>

        <div role="status" className="text-xs text-muted">
          {!speechSupported && 'Este navegador não oferece leitura por voz.'}
          {speechSupported && playerStatus === 'playing' && 'Lendo a página…'}
          {speechSupported && playerStatus === 'paused' && 'Leitura pausada.'}
          {speechSupported && playerStatus === 'done' && 'Leitura concluída.'}
        </div>
      </section>

      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-bold text-ink">
          Tamanho do texto <span className="font-normal text-muted">· {settings.fontPercent}%</span>
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => updateSettings({ fontPercent: Math.max(FONT_MIN, settings.fontPercent - FONT_STEP) })}
            disabled={settings.fontPercent <= FONT_MIN}
          >
            − Reduzir
          </Button>
          <Button
            variant="secondary"
            onClick={() => updateSettings({ fontPercent: Math.min(FONT_MAX, settings.fontPercent + FONT_STEP) })}
            disabled={settings.fontPercent >= FONT_MAX}
          >
            + Aumentar
          </Button>
        </div>
      </div>

      <div className="flex flex-col">
        {toggles.map((toggle) => (
          <Switch
            key={toggle.key}
            id={`${id}-${toggle.key}`}
            label={toggle.label}
            checked={settings[toggle.key]}
            onChange={(checked) => updateSettings({ [toggle.key]: checked })}
          />
        ))}
      </div>

      <SelectField
        id={`${id}-daltonismo`}
        label="Modo de cor (daltonismo)"
        value={settings.colorMode}
        options={COLOR_MODE_OPTIONS}
        onChange={(value) => updateSettings({ colorMode: value })}
        className="w-full"
      />

      <div className="flex flex-col gap-2">
        <SwatchGroup
          legend="Cor do texto"
          name={`${id}-texto`}
          options={TEXT_OPTIONS}
          value={settings.textColor}
          locked={colorsLocked}
          onChange={(colorId) => updateSettings({ textColor: colorId })}
        />
        <SwatchGroup
          legend="Cor dos botões"
          name={`${id}-botoes`}
          options={BUTTON_OPTIONS}
          value={settings.buttonColor}
          locked={colorsLocked}
          onChange={(colorId) => updateSettings({ buttonColor: colorId })}
        />
      </div>

      <div className="flex gap-2.5">
        <SelectField
          id={`${id}-linhas`}
          label="Entre linhas"
          value={settings.leading}
          options={LEADING_OPTIONS}
          onChange={(value) => updateSettings({ leading: value })}
        />
        <SelectField
          id={`${id}-letras`}
          label="Entre letras"
          value={settings.tracking}
          options={TRACKING_OPTIONS}
          onChange={(value) => updateSettings({ tracking: value })}
        />
      </div>

      <div className="flex flex-col items-start gap-1">
        <Button variant="primary" onClick={savePreferences}>
          <Save size={17} aria-hidden="true" />
          Salvar preferências
        </Button>
        <Button variant="tertiary" onClick={resetDefaults}>
          <RotateCcw size={17} aria-hidden="true" />
          Restaurar padrão
        </Button>
      </div>

      <div role="status" className="flex flex-col gap-2">
        {saveStatus === 'success' && (
          <Notice tone="success" title="Preferências salvas">
            Serão aplicadas sempre que você voltar ao site.
          </Notice>
        )}
      </div>
    </div>
  );
}