import { useEffect, useRef } from 'react';
import { Check, RotateCcw, Save, Sliders, UserCheck, Volume2, VolumeX, X } from 'lucide-react';
import Button from './Button';
import Notice from './Notice';
import Switch from './Switch';
import { useA11y } from '../hooks/useA11y';
import {
  BACKGROUND_OPTIONS,
  COLOR_VISION_OPTIONS,
  FONT_MAX,
  FONT_MIN,
  FONT_STEP,
  LEADING_OPTIONS,
  SPEECH_RATES,
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

const fieldClass = 'min-h-11 w-full rounded-md border border-muted/60 bg-surface px-3 text-sm text-ink';

function SelectField({ id, label, value, options, onChange, icon: Icon }) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-bold text-ink">
        {Icon && <Icon size={14} aria-hidden="true" />}
        {label}
      </label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Preview({ kind, color }) {
  if (kind === 'text') {
    return (
      <span aria-hidden="true" className="w-6 shrink-0 text-center font-serif text-lg font-bold leading-none" style={{ color }}>
        Aa
      </span>
    );
  }
  return <span aria-hidden="true" className="size-5 shrink-0 rounded-full border border-muted" style={{ backgroundColor: color }} />;
}

// Grupo de opções de cor: radios nativos (setas do teclado funcionam e leitores de tela anunciam o grupo)
function SwatchGroup({ legend, name, options, value, onChange, kind, locked }) {
  return (
    <fieldset disabled={locked} className={`min-w-0 ${locked ? 'opacity-55' : ''}`}>
      <legend className="mb-1.5 text-sm font-bold text-ink">{legend}</legend>
      <div className="flex flex-col gap-1.5">
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <label
              key={option.id}
              className={`flex min-h-11 items-center gap-2.5 rounded-md border-2 px-2.5 text-sm text-ink has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus ${
                selected ? 'border-primary bg-primary/10 font-bold' : 'border-line bg-surface hover:border-muted'
              } ${locked ? '' : 'cursor-pointer'}`}
            >
              <input
                type="radio"
                name={name}
                value={option.id}
                checked={selected}
                onChange={() => onChange(option.id)}
                className="sr-only"
              />
              <Preview kind={kind} color={option.preview} />
              <span className="flex-1">{option.label}</span>
              {selected && <Check size={16} className="shrink-0 text-primary" aria-hidden="true" />}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function A11yModal({ isOpen, onClose }) {
  const {
    draft,
    updateDraft,
    hasUnsavedChanges,
    discardDraft,
    savePreferences,
    resetDefaults,
    saveStatus,
    isPlaying,
    voiceGender,
    setVoiceGender,
    speechRate,
    setSpeechRate,
    speakPageContent,
    stopSpeaking,
  } = useA11y();

  const dialogRef = useRef(null);
  const titleRef = useRef(null);

  // Ao abrir: foco no título. Ao fechar: descarta o que não foi salvo e devolve o foco ao botão que abriu.
  useEffect(() => {
    if (!isOpen) return undefined;

    const trigger = document.activeElement;
    titleRef.current?.focus();

    return () => {
      discardDraft();
      trigger?.focus?.();
    };
  }, [isOpen, discardDraft]);

  if (!isOpen) return null;

  const colorsLocked = draft.darkMode || draft.highContrast;

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      onClose();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = [...dialogRef.current.querySelectorAll('button:not(:disabled), select:not(:disabled), input:not(:disabled)')];
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
        aria-labelledby="a11y-titulo"
        onKeyDown={handleKeyDown}
        className="relative flex max-h-[90vh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-[10px] border-2 border-navy bg-surface p-5 shadow-[0_8px_24px_rgba(13,51,71,0.18)]"
      >
        <div className="flex items-center justify-between">
          <h2 id="a11y-titulo" ref={titleRef} tabIndex={-1} className="text-[22px] text-navy">
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

        {/* Leitor de voz: vale na hora */}
        <section aria-labelledby="a11y-leitor" className="flex flex-col gap-3 rounded-md border border-line bg-mist p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 id="a11y-leitor" className="flex items-center gap-1.5 font-sans text-sm font-bold text-navy">
              <Volume2 size={16} className="text-primary" aria-hidden="true" />
              Leitor de voz da página
            </h3>
            <Button variant={isPlaying ? 'danger' : 'primary'} onClick={() => (isPlaying ? stopSpeaking() : speakPageContent())}>
              {isPlaying ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
              {isPlaying ? 'Parar leitura' : 'Ouvir agora'}
            </Button>
          </div>

          <div className="flex gap-2.5">
            <SelectField
              id="a11y-voz"
              label="Voz"
              icon={UserCheck}
              value={voiceGender}
              options={VOICE_OPTIONS}
              onChange={setVoiceGender}
            />
            <SelectField
              id="a11y-velocidade"
              label="Velocidade"
              icon={Sliders}
              value={speechRate}
              options={SPEECH_RATES}
              onChange={(value) => setSpeechRate(Number(value))}
            />
          </div>
        </section>

        {/* Ajustes visuais: só valem depois de salvar */}
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-bold text-ink">
            Tamanho do texto <span className="font-normal text-muted">· {draft.fontPercent}%</span>
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => updateDraft({ fontPercent: Math.max(FONT_MIN, draft.fontPercent - FONT_STEP) })}
              disabled={draft.fontPercent <= FONT_MIN}
            >
              − Reduzir
            </Button>
            <Button
              variant="secondary"
              onClick={() => updateDraft({ fontPercent: Math.min(FONT_MAX, draft.fontPercent + FONT_STEP) })}
              disabled={draft.fontPercent >= FONT_MAX}
            >
              + Aumentar
            </Button>
          </div>
        </div>

        <div className="flex flex-col">
          {toggles.map((toggle) => (
            <Switch
              key={toggle.key}
              id={`a11y-${toggle.key}`}
              label={toggle.label}
              checked={draft[toggle.key]}
              onChange={(checked) => updateDraft({ [toggle.key]: checked })}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <SwatchGroup
              legend="Cor de fundo"
              name="a11y-fundo"
              kind="bg"
              options={BACKGROUND_OPTIONS}
              value={draft.bgColor}
              locked={colorsLocked}
              onChange={(id) => updateDraft({ bgColor: id })}
            />
            <SwatchGroup
              legend="Cor do texto"
              name="a11y-texto"
              kind="text"
              options={TEXT_OPTIONS}
              value={draft.textColor}
              locked={colorsLocked}
              onChange={(id) => updateDraft({ textColor: id })}
            />
          </div>
          {colorsLocked && (
            <p className="text-xs text-muted">
              Cores personalizadas ficam indisponíveis com o modo escuro ou o alto contraste ligados.
            </p>
          )}
        </div>

        <SelectField
          id="a11y-daltonismo"
          label="Modo de cor (daltonismo)"
          value={draft.colorVision}
          options={COLOR_VISION_OPTIONS}
          onChange={(value) => updateDraft({ colorVision: value })}
        />

        <div className="flex gap-2.5">
          <SelectField
            id="a11y-linhas"
            label="Entre linhas"
            value={draft.leading}
            options={LEADING_OPTIONS}
            onChange={(value) => updateDraft({ leading: value })}
          />
          <SelectField
            id="a11y-letras"
            label="Entre letras"
            value={draft.tracking}
            options={TRACKING_OPTIONS}
            onChange={(value) => updateDraft({ tracking: value })}
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
              Foram aplicadas e serão mantidas sempre que você voltar ao site neste navegador.
            </Notice>
          )}
          {saveStatus === 'warning' && (
            <Notice tone="warning" title="Não foi possível salvar">
              Este navegador bloqueou o armazenamento. As mudanças valem até você fechar a página.
            </Notice>
          )}
          {saveStatus === 'reset' && (
            <Notice tone="info" title="Padrão restaurado">
              As preferências salvas neste navegador foram removidas.
            </Notice>
          )}
          {!saveStatus && hasUnsavedChanges && (
            <Notice tone="info" title="Alterações ainda não aplicadas">
              Clique em “Salvar preferências” para aplicar ao site.
            </Notice>
          )}
        </div>
      </div>
    </div>
  );
}