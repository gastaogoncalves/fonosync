import { useEffect, useRef } from 'react';
import { Activity, AudioWaveform, Bot, CalendarDays, FileText, LayoutDashboard, LogOut, Settings, Users } from 'lucide-react';
import A11yActions from '../components/A11yActions';
import Dashboard from './professional/Dashboard';
import Patients from './professional/Patients';
import Schedule from './professional/Schedule';
import Tracking from './professional/Tracking';
import Reports from './professional/Reports';
import SettingsPage from './professional/SettingsPage';
 import logoImg from '../assets/images/logofonoSemNome.png';

const sections = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: Dashboard },
  { key: 'pacientes', label: 'Pacientes', icon: Users, component: Patients },
  { key: 'agenda', label: 'Agenda', icon: CalendarDays, component: Schedule },
  { key: 'acompanhamento', label: 'Acompanhamento', icon: Activity, component: Tracking },
  { key: 'relatorios', label: 'Relatórios', icon: FileText, component: Reports },
  { key: 'configuracoes', label: 'Configurações', icon: Settings, component: SettingsPage },
];

function Sidebar({ current }) {
  return (
    <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col gap-5 bg-band px-4 py-5 text-white">
      <a href="#/" className="flex min-h-11 items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-md bg-primary text-on-primary">
         <img 
            src={logoImg} 
            alt="FonoSync Logo" 
            className="h-20 w-auto rounded-lg object-contain shadow-sm s" 
          />
        </span>
        <span className="font-serif text-2xl">FonoSync</span>
      </a>

      <p className="text-sm font-bold text-on-band-muted uppercase">Área do profissional</p>

      <nav aria-label="Área do profissional">
        <ul className="flex flex-col gap-0.75">
          {sections.map((section) => {
            const active = section.key === current;
            return (
              <li key={section.key}>
                <a
                  href={`#/profissional/${section.key}`}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-11 items-center gap-2.5 border-l-3 px-2.5 text-sm transition-colors ${
                    active ? 'border-accent bg-white/12 font-bold' : 'border-transparent font-medium hover:bg-white/8'
                  }`}
                >
                  <section.icon size={16} aria-hidden="true" />
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto flex flex-col gap-1">
        <button type="button" className="flex min-h-11 items-center gap-2 rounded-md px-1 text-sm font-semibold hover:bg-white/8">
          <Bot size={18} aria-hidden="true" />
          FonoBot · ajuda
        </button>
        <p className="px-1 text-sm text-on-band-muted">Dra. Renata Lima</p>
        <a href="#/" className="flex min-h-11 items-center gap-2 rounded-md px-1 text-sm hover:bg-white/8">
          <LogOut size={16} aria-hidden="true" />
          Sair
        </a>
      </div>
    </aside>
  );
}

export default function ProfessionalDashboard({ section }) {
  const current = sections.find((item) => item.key === section) ?? sections[0];
  const Content = current.component;
  const titleRef = useRef(null);

  useEffect(() => {
    document.title = `${current.label} · FonoSync`;
    window.scrollTo(0, 0);
    titleRef.current?.focus();
  }, [current]);

  return (
    <div className="flex min-h-screen">
      <Sidebar current={current.key} />

      <div className="flex min-w-0 flex-1 flex-col bg-canvas">
        <header className="flex h-18 items-center justify-between border-b border-line bg-surface px-6">
          <h1 ref={titleRef} tabIndex={-1} className="text-[26px] text-navy">
            {current.label}
          </h1>
          <A11yActions />
        </header>

        <main className="flex flex-col gap-4.5 p-6">
          <Content />
        </main>
      </div>
    </div>
  );
}
