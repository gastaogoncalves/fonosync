import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Save, X } from 'lucide-react';
import Button from './Button';
import Notice from './Notice';
import Switch from './Switch';
import { useA11y } from '../hooks/useA11y';

const toggles = [
  { key: 'highContrast', label: 'Alto contraste' },
  { key: 'darkMode', label: 'Modo escuro' },
  { key: 'reduceMotion', label: 'Reduzir animações' },
  { key: 'largeTargets', label: 'Aumentar elementos interativos' },
];

const leadingOptions = [
  { value: 'normal', label: 'Normal' },
  { value: '1.5', label: '1,5×' },
  { value: '2', label: '2×' },
];

const trackingOptions = [
  { value: 'normal', label: 'Normal' },
  { value: '0.05em', label: 'Ampliado' },
  { value: '0.12em', label: 'Máximo' },
];

const fieldClass = 'min-h-11 w-full rounded-md border border-muted/60 bg-surface px-3 text-sm text-ink';

function ColorField({ id, label, value, fallback, onChange }) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold text-ink">{label}</label>
      <div className={`flex items-center gap-2 ${fieldClass}`}>
        <input
          id={id}
          type="color"
          value={value || fallback}
          onChange={(event) => onChange(event.target.value)}
          className="size-7 shrink-0 cursor-pointer rounded-sm border border-line bg-transparent"
        />
        <span className={value ? 'uppercase' : 'text-muted'}>{value || 'Padrão'}</span>
      </div>
    </div>
  );
}

function SelectField({ id, label, value, options, onChange }) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold text-ink">{label}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}

export default function AccessibilityPanel({ id, onClose }) {
  const a11y = useA11y();
  const { settings } = a11y;
  const titleRef = useRef(null);
  const [saveResult, setSaveResult] = useState(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function change(action) {
    action();
    setSaveResult(null);
  }

  return (
    <div
      id={id}
      role="dialog"
      aria-labelledby={`${id}-titulo`}
      onKeyDown={(event) => event.key === 'Escape' && onClose()}
      className="absolute top-[calc(100%+14px)] right-0 z-50 flex max-h-[calc(100vh-112px)] w-97.5 flex-col gap-3.5 overflow-y-auto rounded-[10px] border-2 border-navy bg-surface p-5 shadow-[0_8px_24px_rgba(13,51,71,0.09)]"
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

      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-bold text-ink">
          Tamanho do texto <span className="font-normal text-muted">· {a11y.fontPercent}%</span>
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => change(a11y.decreaseFont)} disabled={!a11y.canDecreaseFont}>
            − Reduzir
          </Button>
          <Button variant="secondary" onClick={() => change(a11y.increaseFont)} disabled={!a11y.canIncreaseFont}>
            + Aumentar
          </Button>
        </div>
      </div>

      {toggles.map((toggle) => (
        <Switch
          key={toggle.key}
          id={`${id}-${toggle.key}`}
          label={toggle.label}
          checked={settings[toggle.key]}
          onChange={(checked) => change(() => a11y.update(toggle.key, checked))}
        />
      ))}

      <div className="flex gap-2.5">
        <ColorField
          id={`${id}-fundo`}
          label="Cor de fundo"
          value={settings.bgColor}
          fallback="#ffffff"
          onChange={(color) => change(() => a11y.update('bgColor', color))}
        />
        <ColorField
          id={`${id}-texto`}
          label="Cor do texto"
          value={settings.textColor}
          fallback="#172c3a"
          onChange={(color) => change(() => a11y.update('textColor', color))}
        />
      </div>

      <div className="flex gap-2.5">
        <SelectField
          id={`${id}-linhas`}
          label="Entre linhas"
          value={settings.leading}
          options={leadingOptions}
          onChange={(value) => change(() => a11y.update('leading', value))}
        />
        <SelectField
          id={`${id}-letras`}
          label="Entre letras"
          value={settings.tracking}
          options={trackingOptions}
          onChange={(value) => change(() => a11y.update('tracking', value))}
        />
      </div>

      <div className="flex flex-col items-start gap-1">
        <Button variant="primary" onClick={() => setSaveResult(a11y.save())}>
          <Save size={17} aria-hidden="true" />
          Salvar preferências
        </Button>
        <Button variant="tertiary" onClick={() => change(a11y.reset)}>
          <RotateCcw size={17} aria-hidden="true" />
          Restaurar padrão
        </Button>
      </div>

      <div role="status">
        {saveResult === true && (
          <Notice tone="success" title="Preferências salvas">
            Serão aplicadas sempre que você voltar ao site neste navegador.
          </Notice>
        )}
        {saveResult === false && (
          <Notice tone="warning" title="Não foi possível salvar">
            Este navegador bloqueou o armazenamento. As mudanças valem até você fechar a página.
          </Notice>
        )}
      </div>
    </div>
  );
}
