import { useEffect, useState } from 'react';
import {
  Activity,
  Calendar,
  FileText,
  Home,
  LogOut,
  PersonStanding,
  Settings,
  UserPlus,
  Users,
  Volume2,
} from 'lucide-react';
import logoImg from '../assets/images/ModeloA_Semnome.jpg';
import { useA11y } from '../hooks/useA11y';
import { useAuth } from '../hooks/useAuth';
import A11yModal from '../components/A11yModal';
import Button from '../components/Button';

import Patients from './professional/Patients';
import Tracking from './professional/Tracking';
import Schedule from './professional/Schedule';
import Reports from './professional/Reports';
import SettingsPage from './professional/SettingsPage';
import { listPatients } from '../services/patientService';

const navItems = [
  { id: 'dashboard', label: 'Início', icon: Home },
  { id: 'pacientes', label: 'Pacientes', icon: Users },
  { id: 'acompanhamento', label: 'Acompanhamento', icon: Activity },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'relatorios', label: 'Relatórios', icon: FileText },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
];

const pageInfo = {
  dashboard: { title: 'Painel do Profissional', subtitle: '' },
  pacientes: { title: 'Gestão de Pacientes', subtitle: 'Cadastre, busque e gerencie os prontuários ativos.' },
  acompanhamento: { title: 'Acompanhamento Clínico', subtitle: 'Analise parâmetros fonéticos e registre evoluções.' },
  agenda: { title: 'Agenda de Atendimentos', subtitle: 'Organize sessões presenciais e teleatendimentos.' },
  relatorios: { title: 'Relatórios e Documentos', subtitle: 'Emita laudos, atestados e exportações acessíveis.' },
  configuracoes: { title: 'Configurações do Consultório', subtitle: 'Gerencie seu perfil e credenciais profissionais.' },
};

function authenticatedName(session) {
  return session?.name || session?.nome || session?.fullName || session?.user?.name ||
    session?.professional?.name || session?.email || session?.user?.email || 'Profissional';
}

function DashboardHome({ onNavigate, patients, loading, error }) {
  const activePatients = patients.filter((patient) => patient.patientStatus !== 'ARQUIVADO');
  const archivedPatients = patients.length - activePatients.length;
  const diagnosedPatients = patients.filter((patient) => patient.cid10).length;
  const stats = [
    { label: 'Pacientes ativos', value: activePatients.length },
    { label: 'Prontuários arquivados', value: archivedPatients },
    { label: 'Com CID-10 registrado', value: diagnosedPatients },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-line bg-surface p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <h2 className="font-serif text-xl font-bold text-navy">Resumo do seu dia</h2>
          <p className="mt-1 text-sm text-muted">Acesse os cadastros e prontuários dos pacientes da sua base.</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Button variant="primary" onClick={() => onNavigate('pacientes')}>
            <UserPlus size={16} aria-hidden="true" /> Novo paciente
          </Button>
          <Button variant="secondary" onClick={() => onNavigate('pacientes')}>
            <FileText size={16} aria-hidden="true" /> Ver prontuários
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-4 shadow-sm">
            <span className="text-xs font-bold uppercase text-muted">{stat.label}</span>
            <span className="font-serif text-2xl font-bold text-navy">{loading ? '—' : stat.value}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4 rounded-xl border border-line bg-surface p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
          <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-navy">
            <FileText size={18} className="text-primary" aria-hidden="true" /> Prontuários recentes
          </h3>
          <button type="button" onClick={() => onNavigate('pacientes')} className="text-xs font-bold text-primary underline-offset-4 hover:underline">
            Ver todos
          </button>
        </div>
        {loading ? (
          <p className="py-4 text-sm text-muted" role="status">Carregando prontuários...</p>
        ) : error ? (
          <p className="py-4 text-sm font-bold text-danger" role="alert">{error}</p>
        ) : patients.length === 0 ? (
          <p className="py-4 text-sm text-muted">Ainda não há pacientes cadastrados.</p>
        ) : (
          <div className="divide-y divide-line">
            {patients.slice(0, 5).map((patient) => (
              <button
                key={patient.id}
                type="button"
                onClick={() => onNavigate('pacientes')}
                className="flex w-full flex-wrap items-center justify-between gap-3 py-3 text-left hover:bg-canvas"
              >
                <span className="font-bold text-ink">{patient.name}</span>
                <span className="text-sm text-muted">{patient.cid10 ? `CID-10 ${patient.cid10}` : 'CID-10 não informado'}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfessionalDashboard({ section = 'dashboard' }) {
  const activeSection = section;
  const [showA11y, setShowA11y] = useState(false);
  const { speakPageContent } = useA11y();
  const { logout, session } = useAuth();
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientsError, setPatientsError] = useState('');

  useEffect(() => {
    listPatients()
      .then(setPatients)
      .catch((error) => setPatientsError(error.message))
      .finally(() => setPatientsLoading(false));
  }, []);

  const navigateTo = (newSection) => {
    window.location.assign(`#/profissional/${newSection}`);
  };


  const info = pageInfo[activeSection] ?? pageInfo.dashboard;
  const professionalName = authenticatedName(session);
  const professionalInitials = professionalName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans md:flex-row">
      <aside className="flex w-full shrink-0 flex-col justify-between bg-band p-5 text-white md:w-64">
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
              <PersonStanding size={14} className="shrink-0" aria-hidden="true" /> Acessibilidade
            </button>
            <button
              type="button"
              onClick={() => speakPageContent()}
              className="flex items-center justify-center gap-1 rounded-md border border-white/30 px-2 py-2 text-[11px] font-bold text-white hover:bg-white/10"
            >
              <Volume2 size={14} className="shrink-0" aria-hidden="true" /> Ouvir página
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-md border border-white/15 bg-white/10 p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-primary font-serif text-xs font-bold text-on-primary">
              {professionalInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">{professionalName}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-on-band-muted">
                <span className="size-1.5 animate-pulse rounded-full bg-accent" aria-hidden="true" /> Conta autenticada
              </span>
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
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy">{info.title}</h1>
            <p className="text-sm text-muted">{activeSection === 'dashboard' ? `Olá, ${professionalName}.` : info.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-primary bg-primary/10 px-4 py-2">
            <Users className="text-primary" size={18} aria-hidden="true" />
            <span className="text-xs font-bold text-navy">
              {patientsLoading || patientsError ? '—' : patients.filter((patient) => patient.patientStatus !== 'ARQUIVADO').length} Pacientes Ativos
            </span>
          </div>
        </header>

        {activeSection === 'dashboard' && (
          <DashboardHome onNavigate={navigateTo} patients={patients} loading={patientsLoading} error={patientsError} />
        )}
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