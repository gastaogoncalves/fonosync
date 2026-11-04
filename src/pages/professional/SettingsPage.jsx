import { useState } from 'react';
import Button from '../../components/Button';
import Notice from '../../components/Notice';
import Panel from '../../components/Panel';

const settingsSections = ['Perfil', 'Sistema'];

function ProfileSettings() {
  const [profile, setProfile] = useState({
    name: 'Dra. Renata Lima',
    crfa: 'CRFa 2-19876',
    email: 'renata.lima@fonosync.com.br',
    phone: '(11) 98765-4321',
  });
  const [saved, setSaved] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <Panel title="Perfil do Profissional" className="flex-1">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-ink mb-1">Nome Completo</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full p-3 border border-muted/60 rounded-md text-sm text-ink bg-surface"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-ink mb-1">Registro Profissional (CRFa)</label>
            <input
              type="text"
              value={profile.crfa}
              onChange={(e) => setProfile({ ...profile, crfa: e.target.value })}
              className="w-full p-3 border border-muted/60 rounded-md text-sm text-ink bg-surface"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-ink mb-1">Telefone Comercial</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full p-3 border border-muted/60 rounded-md text-sm text-ink bg-surface"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-ink mb-1">E-mail Profissional</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full p-3 border border-muted/60 rounded-md text-sm text-ink bg-surface"
          />
        </div>

        <div className="pt-2">
          <Button variant="primary" type="submit">
            Salvar Perfil
          </Button>
        </div>

        {saved && <Notice tone="success" title="Perfil atualizado com sucesso!" />}
      </form>
    </Panel>
  );
}

function SystemSettings() {
  return (
    <Panel title="Configurações do Sistema" className="flex-1">
      <div className="space-y-4 text-sm text-ink">
        <p>Configurações de exibição de prontuário, preferências de notificação por e-mail e layout do painel.</p>
        <div className="p-4 bg-mist rounded-xl border border-line">
          <p className="font-bold text-navy">Versão do Sistema: FonoSync 2.4.0</p>
          <p className="text-xs text-muted">Última atualização: Outubro de 2026</p>
        </div>
      </div>
    </Panel>
  );
}

export default function SettingsPage() {
  const [current, setCurrent] = useState('Perfil');

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

      {current === 'Perfil' && <ProfileSettings />}
      {current === 'Sistema' && <SystemSettings />}
    </div>
  );
}