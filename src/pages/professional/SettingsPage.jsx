import { useState } from 'react';
import { Save } from 'lucide-react';
import Button from '../../components/Button';
import Notice from '../../components/Notice';
import Panel from '../../components/Panel';
import { useAuth } from '../../hooks/useAuth';

const fields = [
  { key: 'name', label: 'Nome completo' },
  { key: 'crfa', label: 'Registro profissional (CRFa)' },
  { key: 'phone', label: 'Telefone / WhatsApp' },
  { key: 'specialty', label: 'Especialidade principal' },
];

export default function SettingsPage() {
  const { session, updateSession } = useAuth();
  const [profile, setProfile] = useState(() => ({
    name: session?.name ?? '',
    crfa: session?.crfa ?? '',
    phone: session?.phone ?? '',
    specialty: session?.specialty ?? '',
  }));
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSession(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Panel title="Perfil do profissional" className="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label htmlFor={`perfil-${key}`} className="text-sm font-bold text-ink">
                {label}
              </label>
              <input
                id={`perfil-${key}`}
                type="text"
                value={profile[key]}
                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                className="min-h-11 rounded-md border border-line bg-surface px-3 text-sm text-ink"
              />
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-bold text-ink">E-mail de acesso</span>
            <span className="flex min-h-11 items-center break-all rounded-md bg-mist px-3 text-sm text-muted">{session?.email}</span>
          </div>
        </div>

        <div>
          <Button type="submit">
            <Save size={16} aria-hidden="true" /> Salvar perfil
          </Button>
        </div>

        <div role="status">{saved && <Notice tone="success" title="Perfil atualizado." />}</div>
      </form>
    </Panel>
  );
}
