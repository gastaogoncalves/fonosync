import { useState } from 'react';
import {
  Accessibility,
  Activity,
  AlertCircle,
  ArrowUpRight,
  Calendar,
  CalendarPlus,
  Clock,
  FileText,
  Home,
  LogOut,
  Settings,
  Sparkles,
  UserPlus,
  Users,
  Volume2,
} from 'lucide-react';
import logoImg from '../assets/images/ModeloA_Semnome.jpg';
import { useA11y } from '../context/A11yContext';
import A11yModal from '../components/A11yModal';
import Button from '../components/Button';
import Notice from '../components/Notice';
import StatusBadge from '../components/StatusBadge';

import Patients from './professional/Patients';
import Tracking from './professional/Tracking';
import Schedule from './professional/Schedule';
import Reports from './professional/Reports';
import SettingsPage from './professional/SettingsPage';

const navItems = [
  { id: 'dashboard', label: 'Início', icon: Home },
  { id: 'pacientes', label: 'Pacientes', icon: Users },
  { id: 'acompanhamento', label: 'Acompanhamento', icon: Activity },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'relatorios', label: 'Relatórios', icon: FileText },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
];

const pageInfo = {
  dashboard: { title: 'Painel do Profissional 👋', subtitle: 'Bem-vinda de volta, Dra. Renata Lima.' },
  pacientes: { title: 'Gestão de Pacientes 👥', subtitle: 'Cadastre, busque e gerencie os prontuários ativos.' },
  acompanhamento: { title: 'Acompanhamento Clínico 📈', subtitle: 'Analise parâmetros fonéticos e registre evoluções.' },
  agenda: { title: 'Agenda de Atendimentos 📅', subtitle: 'Organize sessões presenciais e teleatendimentos.' },
  relatorios: { title: 'Relatórios e Documentos 📄', subtitle: 'Emita laudos, atestados e exportações acessíveis.' },
  configuracoes: { title: 'Configurações do Consultório ⚙️', subtitle: 'Gerencie seu perfil e credenciais profissionais.' },
};

const stats = [
  { label: 'Pacientes Ativos', value: '8', note: '+2 este mês', tone: 'success', arrow: true },
  { label: 'Sessões Hoje', value: '4', note: '2 concluídas', tone: 'muted' },
  { label: 'Evolução Média', value: '74%', note: '+12%', tone: 'success', arrow: true },
  { label: 'Alertas Clínicos', value: '1', note: 'Revisar Meta', tone: 'warning' },
];

const noteStyles = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  muted: 'text-muted',
};

function DashboardHome({ onNavigate }) {
  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-line bg-surface p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <h2 className="font-serif text-xl font-bold text-navy">Resumo do seu dia</h2>
          <p className="mt-1 text-sm text-muted">
            Você tem 4 consultas agendadas para hoje e 2 relatórios pendentes de validação.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Button variant="primary" onClick={() => onNavigate('pacientes')}>
            <UserPlus size={16} aria-hidden="true" /> Novo paciente
          </Button>
          <Button variant="secondary" onClick={() => onNavigate('agenda')}>
            <CalendarPlus size={16} aria-hidden="true" /> Agendar sessão
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-4 shadow-sm">
            <span className="text-xs font-bold uppercase text-muted">{stat.label}</span>
            <div className="flex items-baseline justify-between gap-2">
              <span className={`font-serif text-2xl font-bold ${stat.tone === 'warning' ? 'text-warning' : 'text-navy'}`}>
                {stat.value}
              </span>
              <span className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${noteStyles[stat.tone]}`}>
                {stat.note}
                {stat.arrow && <ArrowUpRight size={12} aria-hidden="true" />}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-xl border border-line bg-surface p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-navy">
              <Clock size={18} className="text-primary" aria-hidden="true" /> Agenda de hoje
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('agenda')}
              className="text-xs font-bold text-primary underline-offset-4 hover:underline"
            >
              Ver agenda completa →
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-canvas p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full border border-success bg-success/10 text-xs font-bold text-success">
                ML
              </div>
              <div>
                <p className="text-sm font-bold text-navy">Maria Luiza Ferreira</p>
                <p className="text-xs text-muted">09:00 · Presencial (Desvio Fonológico)</p>
              </div>
            </div>
            <StatusBadge tone="success">Concluída</StatusBadge>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-line bg-surface p-6 shadow-sm">
          <h3 className="flex items-center gap-2 border-b border-line pb-2 font-serif text-lg font-bold text-navy">
            <AlertCircle size={18} className="text-warning" aria-hidden="true" /> Notas e alertas
          </h3>
          <Notice tone="warning" title="Ana Clara Souza">
            Apresentou oscilação na taxa de fluência nas últimas duas sessões.
          </Notice>
        </div>
      </div>
    </div>
  );
}

export default function ProfessionalDashboard({ section = 'dashboard' }) {
  const activeSection = section;
  const [showA11y, setShowA11y] = useState(false);
  const { speakPageContent } = useA11y();

  const navigateTo = (newSection) => {
    window.location.hash = `#/profissional/${newSection}`;
  };

  const handleLogout = () => {
    window.location.hash = '#/';
  };

  const info = pageInfo[activeSection] ?? pageInfo.dashboard;

  return (
    <div className="flex min-h-screen bg-canvas font-sans">
      <aside className="flex w-64 shrink-0 flex-col justify-between bg-band p-5 text-white">
        <div>
          <div className="mb-8 flex items-center gap-3">
            <img src={logoImg} alt="FonoSync Logo" className="h-9 w-auto rounded bg-white object-contain p-0.5" />
            <span className="font-serif text-xl font-bold text-white">FonoSync</span>
          </div>

          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-on-band-muted">Área do profissional</p>

          <nav aria-label="Áreas do profissional" className="flex flex-col gap-1">
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => navigateTo(id)}
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

        <div className="space-y-3 border-t border-white/15 pt-6">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setShowA11y(true)}
              className="flex items-center justify-center gap-1 rounded-md border border-white/30 px-2 py-2 text-[11px] font-bold text-white hover:bg-white/10"
            >
              <Accessibility size={14} aria-hidden="true" /> Acessibilidade
            </button>
            <button
              type="button"
              onClick={() => speakPageContent()}
              className="flex items-center justify-center gap-1 rounded-md border border-white/30 px-2 py-2 text-[11px] font-bold text-white hover:bg-white/10"
            >
              <Volume2 size={14} aria-hidden="true" /> Ouvir página
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-md border border-white/15 bg-white/10 p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-primary font-serif text-xs font-bold text-on-primary">
              RL
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">Dra. Renata Lima</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-on-band-muted">
                <span className="size-1.5 animate-pulse rounded-full bg-accent" aria-hidden="true" /> CRFa 2-19876
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Sair para a página inicial"
              title="Sair para a página inicial"
              className="rounded p-1 text-on-band-muted hover:text-white"
            >
              <LogOut size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 space-y-6 overflow-y-auto p-8">
        <header className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy">{info.title}</h1>
            <p className="text-sm text-muted">{info.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-primary bg-primary/10 px-4 py-2">
            <Sparkles className="text-primary" size={18} aria-hidden="true" />
            <span className="text-xs font-bold text-navy">8 Pacientes Ativos</span>
          </div>
        </header>

        {activeSection === 'dashboard' && <DashboardHome onNavigate={navigateTo} />}
        {activeSection === 'pacientes' && <Patients />}
        {activeSection === 'acompanhamento' && <Tracking />}
        {activeSection === 'agenda' && <Schedule />}
        {activeSection === 'relatorios' && <Reports />}
        {activeSection === 'configuracoes' && <SettingsPage />}
      </main>

      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />
    </div>
  );
}