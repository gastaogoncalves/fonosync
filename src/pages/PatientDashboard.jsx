import { useState } from 'react';
import { AudioWaveform, ClipboardList, Gamepad2, Home, LogOut, MessageSquare, PersonStanding, School, Settings, Volume2 } from 'lucide-react';
import logoImg from '../assets/images/ModeloA_Semnome.jpg';
import A11yModal from '../components/A11yModal';
import { buttonClass } from '../components/buttonStyles';
import { useA11y } from '../hooks/useA11y';
import { useAuth } from '../hooks/useAuth';
import { displayName } from '../services/authService';

const navItems = [
  { id: 'inicio', label: 'Início', icon: Home },
  { id: 'atividades', label: 'Atividades', icon: Gamepad2 },
  { id: 'conta', label: 'Minha conta', icon: Settings },
];

const activities = [
  { icon: ClipboardList, title: 'Formulário de Marcos', age: '0 a 2 anos', desc: 'Perguntas sobre os primeiros marcos da fala.' },
  { icon: MessageSquare, title: 'Jogo da Palavra', age: '2 a 4 anos', desc: 'Dizer o nome das figuras para identificar trocas de sons.' },
  { icon: AudioWaveform, title: 'Jogo da Rima', age: '4 a 5 anos', desc: 'Descobrir se duas palavras rimam.' },
  { icon: School, title: 'Checklist do Professor', age: '6 anos ou mais', desc: 'Observação feita pelo professor em sala.' },
];

const cardClass = 'rounded-md border border-line bg-surface';

function ActivityList() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {activities.map(({ icon: Icon, title, age, desc }) => (
        <div key={title} className={`${cardClass} flex flex-col gap-3 p-5`}>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="font-bold text-navy">{title}</p>
              <p className="text-sm font-bold text-primary">{age}</p>
            </div>
          </div>
          <p className="flex-1 text-sm text-muted">{desc}</p>
          <div>
            <a href="#/triagem" className={buttonClass('primary')}>
              Começar
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [showA11y, setShowA11y] = useState(false);
  const { session, logout } = useAuth();
  const { isPlayerOpen, speakPageContent } = useA11y();

  const name = displayName(session);
  const firstName = session?.profile?.name?.split(' ')[0];

  const pageInfo = {
    inicio: { title: firstName ? `Olá, ${firstName}!` : 'Olá!', subtitle: 'Sua área de acompanhamento fonoaudiológico.' },
    atividades: { title: 'Atividades', subtitle: 'Triagens e jogos para praticar a fala.' },
    conta: { title: 'Minha conta', subtitle: 'Dados usados no seu acesso.' },
  };
  const info = pageInfo[activeTab];

  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans md:flex-row">
      <aside className="flex w-full shrink-0 flex-col justify-between bg-band p-5 text-white md:w-64">
        <div>
          <div className="mb-8 flex items-center gap-3">
            <img src={logoImg} alt="FonoSync Logo" className="h-9 w-auto rounded bg-white object-contain p-0.5" />
            <span className="font-serif text-xl font-bold text-white">FonoSync</span>
          </div>

          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-on-band-muted">Área do paciente</p>

          <nav aria-label="Áreas do paciente" className="flex flex-col gap-1">
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex min-h-11 w-full items-center gap-3 rounded-r-md border-l-4 px-3 text-left text-sm font-bold transition-colors ${
                    isActive
                      ? 'border-accent bg-white/10 text-white'
                      : 'border-transparent text-on-band-muted hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={18} className="shrink-0 text-accent" aria-hidden="true" />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-6 space-y-3 border-t border-white/15 pt-6">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setShowA11y(true)}
              className="flex items-center justify-center gap-1 rounded-md border border-white/30 px-2 py-2 text-[11px] font-bold text-white hover:bg-white/10"
            >
              <PersonStanding size={14} className="shrink-0" aria-hidden="true" /> Acessibilidade
            </button>
            <button
              type="button"
              aria-pressed={isPlayerOpen}
              onClick={() => speakPageContent()}
              className="flex items-center justify-center gap-1 rounded-md border border-white/30 px-2 py-2 text-[11px] font-bold text-white hover:bg-white/10"
            >
              <Volume2 size={14} className="shrink-0" aria-hidden="true" /> Ouvir página
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-md border border-white/15 bg-white/10 p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-primary font-serif text-xs font-bold text-on-primary">
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">{name}</p>
              <p className="text-[11px] text-on-band-muted">Paciente</p>
            </div>
            <button
              type="button"
              onClick={logout}
              aria-label="Sair para a página inicial"
              title="Sair para a página inicial"
              className="rounded p-1 text-on-band-muted hover:text-white"
            >
              <LogOut size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 space-y-6 overflow-y-auto p-4 md:p-8">
        <header className="border-b border-line pb-4">
          <h1 className="font-serif text-3xl font-bold text-navy">{info.title}</h1>
          <p className="text-sm text-muted">{info.subtitle}</p>
        </header>

        {activeTab === 'inicio' && (
          <>
            <section className={`${cardClass} flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between`}>
              <div>
                <h2 className="text-xl text-navy">Atividades de fala</h2>
                <p className="text-sm text-muted">Triagens e jogos separados por idade, com leitura em voz alta.</p>
              </div>
              <button type="button" onClick={() => setActiveTab('atividades')} className={buttonClass('primary')}>
                Ver atividades
              </button>
            </section>
            <section className={`${cardClass} flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between`}>
              <div>
                <h2 className="text-xl text-navy">Acessibilidade</h2>
                <p className="text-sm text-muted">Ajuste tamanho do texto, cores, contraste e leitura em voz alta.</p>
              </div>
              <button type="button" onClick={() => setShowA11y(true)} className={buttonClass('secondary')}>
                <PersonStanding size={16} aria-hidden="true" /> Abrir painel
              </button>
            </section>
          </>
        )}

        {activeTab === 'atividades' && <ActivityList />}

        {activeTab === 'conta' && (
          <section className={`${cardClass} max-w-xl p-5`}>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-bold text-ink">Nome</dt>
                <dd className="text-muted">{session?.profile?.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-bold text-ink">E-mail</dt>
                <dd className="break-all text-muted">{session?.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-bold text-ink">Telefone</dt>
                <dd className="text-muted">{session?.profile?.phone}</dd>
              </div>
            </dl>
          </section>
        )}
      </main>

      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />
    </div>
  );
}
