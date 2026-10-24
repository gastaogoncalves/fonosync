import { useState } from 'react';
import Button from '../../components/Button';
import Notice from '../../components/Notice';
import Panel from '../../components/Panel';
import Switch from '../../components/Switch';

const settingsSections = ['Perfil', 'Sistema', 'Privacidade / LGPD', 'Backup', 'Segurança / 2FA'];

const privacyOptions = [
  { key: 'consent', label: 'Solicitar consentimento antes de compartilhar' },
  { key: 'anonymize', label: 'Anonimizar dados em pesquisa' },
  { key: 'accessLog', label: 'Registrar log de acesso' },
];

const retentionOptions = [
  '20 anos após o último registro',
  '10 anos após o último registro',
  '5 anos após o último registro',
];

function PrivacySettings() {
  const [options, setOptions] = useState({ consent: true, anonymize: true, accessLog: true });
  const [retention, setRetention] = useState(retentionOptions[0]);
  const [saved, setSaved] = useState(false);

  function change(key, value) {
    setOptions((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  return (
    <Panel title="Privacidade e LGPD" className="flex-1">
      {privacyOptions.map((option) => (
        <Switch
          key={option.key}
          id={`privacidade-${option.key}`}
          label={option.label}
          checked={options[option.key]}
          onChange={(checked) => change(option.key, checked)}
        />
      ))}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="retencao-prontuarios" className="text-sm font-bold text-ink">
          Retenção de prontuários
        </label>
        <select
          id="retencao-prontuarios"
          value={retention}
          onChange={(event) => {
            setRetention(event.target.value);
            setSaved(false);
          }}
          className="min-h-11 w-full rounded-md border border-muted/60 bg-surface px-3 text-sm text-ink"
        >
          {retentionOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <Notice tone="success" title="Dados protegidos">
        Último backup criptografado: hoje, 02:00. 2FA ativo para esta conta.
      </Notice>

      <div className="flex flex-col items-start gap-3.5">
        <Button variant="primary" onClick={() => setSaved(true)}>
          Salvar configurações
        </Button>
        <Button variant="secondary">Exportar dados da conta</Button>
      </div>

      <div role="status">{saved && <Notice tone="success" title="Configurações salvas" />}</div>
    </Panel>
  );
}

export default function SettingsPage() {
  const [current, setCurrent] = useState('Privacidade / LGPD');

  return (
    <div className="flex items-start gap-4.5">
      <nav aria-label="Seções das configurações" className="w-55 shrink-0">
        <ul className="flex flex-col gap-0.5">
          {settingsSections.map((section) => (
            <li key={section}>
              <button
                type="button"
                aria-current={current === section ? 'true' : undefined}
                onClick={() => setCurrent(section)}
                className={`flex min-h-11 w-full items-center px-3 text-left text-sm text-ink transition-colors hover:bg-primary/15 ${
                  current === section ? 'bg-mist font-bold' : 'bg-surface font-medium'
                }`}
              >
                {section}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {current === 'Privacidade / LGPD' ? (
        <PrivacySettings />
      ) : (
        <Panel title={current} className="flex-1" />
      )}
    </div>
  );
}
