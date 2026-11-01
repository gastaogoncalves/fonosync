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

const colorVisionOptions = [
  { value: 'normal', label: 'Padrão' },
  { value: 'red-green', label: 'Protanopia ou deuteranopia (vermelho e verde)' },
  { value: 'tritan', label: 'Tritanopia (azul e amarelo)' },
  { value: 'mono', label: 'Monocromático (sem cores)' },
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

// no claro, cores escuras; no escuro, cores claras
const textColors = {
  light: [
    { value: '#000000', label: 'Preto' },
    { value: '#172c3a', label: 'Grafite' },
    { value: '#0b2e4f', label: 'Azul-escuro' },
    { value: '#4a2c12', label: 'Marrom' },
    { value: '#5a1023', label: 'Vinho' },
  ],
  dark: [
    { value: '#ffffff', label: 'Branco' },
    { value: '#d7dde3', label: 'Cinza-claro' },
    { value: '#f5ecd7', label: 'Creme' },
    { value: '#fff3b0', label: 'Amarelo-claro' },
    { value: '#cfe6f7', label: 'Azul-claro' },
  ],
};

const buttonColors = {
  light: [
    { value: '#1f6f43', label: 'Verde' },
    { value: '#5b3fa0', label: 'Roxo' },
    { value: '#8a1c3c', label: 'Vinho' },
    { value: '#a3470d', label: 'Laranja' },
    { value: '#000000', label: 'Preto' },
  ],
  dark: [
    { value: '#7fd1a6', label: 'Verde-claro' },
    { value: '#b9a5ec', label: 'Lilás' },
    { value: '#f2a2bb', label: 'Rosa' },
    { value: '#f5b47a', label: 'Pêssego' },
    { value: '#ffffff', label: 'Branco' },
  ],
};

function SwatchField({ name, label, value, options, onChange }) {
  const selected = options.find((option) => option.value === value)?.label ?? 'Padrão';
  const optionClass =
    'flex min-h-11 cursor-pointer items-center justify-center rounded-md has-checked:ring-2 has-checked:ring-primary has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-focus';

  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-sm font-bold text-ink">
        {label} <span className="font-normal text-muted">· {selected}</span>
      </legend>
      <div className="flex gap-1">
        <label className={`${optionClass} px-3 text-sm text-ink`}>
          <input
            type="radio"
            name={name}
            className="sr-only"
            checked={!value}
            onChange={() => onChange('')}
          />
          Padrão
        </label>
        {options.map((option) => (
          <label key={option.value} className={`${optionClass} size-11`} title={option.label}>
            <input
              type="radio"
              name={name}
              className="sr-only"
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className="sr-only">{option.label}</span>
            <span
              className="size-8 rounded-full border border-muted/60"
              style={{ backgroundColor: option.value }}
              aria-hidden="true"
            />
          </label>
        ))}
      </div>
    </fieldset>
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
  const theme = settings.darkMode ? 'dark' : 'light';
  const textKey = settings.darkMode ? 'textDark' : 'textLight';
  const buttonKey = settings.darkMode ? 'buttonDark' : 'buttonLight';
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

      <div className="flex">
        <SelectField
          id={`${id}-daltonismo`}
          label="Modo de cor (daltonismo)"
          value={settings.colorVision}
          options={colorVisionOptions}
          onChange={(value) => change(() => a11y.update('colorVision', value))}
        />
      </div>

      <SwatchField
        name={`${id}-texto`}
        label="Cor do texto"
        value={settings[textKey]}
        options={textColors[theme]}
        onChange={(color) => change(() => a11y.update(textKey, color))}
      />
      <SwatchField
        name={`${id}-botoes`}
        label="Cor dos botões"
        value={settings[buttonKey]}
        options={buttonColors[theme]}
        onChange={(color) => change(() => a11y.update(buttonKey, color))}
      />

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
