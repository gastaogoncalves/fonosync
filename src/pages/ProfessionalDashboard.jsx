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

import Patients from './professional/Patients';
import MedicalRecordPage from './professional/MedicalRecordPage';
import Tracking from './professional/Tracking';
import Schedule from './professional/Schedule';
import Reports from './professional/Reports';
import SettingsPage from './professional/SettingsPage';
import { listPatients } from '../services/patientService';

const navItems = [
  { id: 'dashboard', label: 'Início', icon: Home },
  { id: 'pacientes', label: 'Pacientes', icon: Users },
  { id: 'prontuario', label: 'Prontuário', icon: FileText },
  { id: 'acompanhamento', label: 'Acompanhamento', icon: Activity },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'relatorios', label: 'Relatórios', icon: FileText },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
];

const pageInfo = {
  dashboard: { title: 'Painel do Profissional', subtitle: '' },
  pacientes: { title: 'Gestão de Pacientes', subtitle: 'Cadastre, busque e gerencie os prontuários ativos.' },
  prontuario: { title: 'Prontuário', subtitle: 'Acompanhe evolução, histórico de sessões, diagnóstico e exames.' },
  acompanhamento: { title: 'Acompanhamento Clínico', subtitle: 'Analise parâmetros fonéticos e registre evoluções.' },
  agenda: { title: 'Agenda de Atendimentos', subtitle: 'Organize sessões presenciais e teleatendimentos.' },
  relatorios: { title: 'Relatórios e Documentos', subtitle: 'Emita laudos, atestados e exportações acessíveis.' },
  configuracoes: { title: 'Configurações do Consultório', subtitle: 'Gerencie seu perfil e credenciais profissionais.' },
};

function authenticatedName(session) {
  return session?.name || session?.nome || session?.fullName || session?.user?.name ||
    session?.professional?.name || session?.email || session?.user?.email || 'Profissional';
}

function DashboardHome({ onNavigate, onSelectPatient, patients, loading, error, professionalName }) {
  const activePatients = patients.filter((patient) => patient.patientStatus !== 'ARQUIVADO');

  // Pacientes Recentes (Fiel à Imagem do Dashboard da Referência)
  const recentPatients = [
    {
      id: 'p-1',
      name: 'Maria Luiza Ferreira',
      initials: 'ML',
      subtitle: '7 anos · Disfluência (gagueira)',
      status: 'Em tratamento',
      statusClass: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'p-2',
      name: 'Carlos Silva',
      initials: 'CS',
      subtitle: '42 anos · Disfagia orofaríngea',
      status: 'Avaliação',
      statusClass: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'p-3',
      name: 'Ana Rita Costa',
      initials: 'AR',
      subtitle: '5 anos · Atraso de linguagem',
      status: 'Em tratamento',
      statusClass: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'p-4',
      name: 'João Pedro Alves',
      initials: 'JP',
      subtitle: '12 anos · Dislalia funcional',
      status: 'Em tratamento',
      statusClass: 'bg-emerald-100 text-emerald-800',
    },
  ];

  // Sessões de Hoje (Fiel à Imagem do Dashboard da Referência)
  const todaySessions = [
    {
      time: '08:00',
      patient: 'Ana Rita Costa',
      therapy: 'Terapia linguagem · 45 min',
      status: 'Confirmada',
      statusClass: 'bg-emerald-100 text-emerald-800',
    },
    {
      time: '09:00',
      patient: 'Carlos Silva',
      therapy: 'Avaliação disfagia · 60 min',
      status: 'Pendente',
      statusClass: 'bg-amber-100 text-amber-800',
    },
    {
      time: '10:30',
      patient: 'Maria Luiza Ferreira',
      therapy: 'Sessão fluência · 50 min',
      status: 'Confirmada',
      statusClass: 'bg-emerald-100 text-emerald-800',
    },
    {
      time: '14:00',
      patient: 'Patrícia Gomes',
      therapy: 'Voz profissional · 45 min',
      status: 'Agendada',
      statusClass: 'bg-slate-100 text-slate-700',
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* -------------------------------------------------------------- */}
      {/* CABEÇALHO DO DASHBOARD (FIEL À REFERÊNCIA)                     */}
      {/* -------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#172C3A]">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Bem-vinda, {professionalName || 'Dra. Renata'} — Qua, 19 mar. 2025
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('agenda')}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0284C7] hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
        >
          <UserPlus size={15} /> + Nova Sessão
        </button>
      </div>

      {/* -------------------------------------------------------------- */}
      {/* 4 CARDS DE MÉTRICAS (SEM IA - CONFORME INSTRUÇÃO)              */}
      {/* -------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pacientes Ativos */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pacientes Ativos</span>
          <div className="text-3xl font-serif font-bold text-[#172C3A]">
            {loading ? '—' : activePatients.length > 0 ? activePatients.length : 34}
          </div>
          <p className="text-xs font-bold text-emerald-600 pt-1">+2 este mês</p>
        </div>

        {/* Card 2: Sessões esta Semana */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sessões esta Semana</span>
          <div className="text-3xl font-serif font-bold text-[#172C3A]">12</div>
          <p className="text-xs font-semibold text-slate-500 pt-1">3 pendentes</p>
        </div>

        {/* Card 3: Evoluções Pendentes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Evoluções Pendentes</span>
          <div className="text-3xl font-serif font-bold text-[#172C3A]">5</div>
          <p className="text-xs font-bold text-amber-600 pt-1">Registrar hoje</p>
        </div>

        {/* Card 4: Taxa de Frequência / Assiduidade (Substitui Análises IA) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Taxa de Frequência</span>
          <div className="text-3xl font-serif font-bold text-[#172C3A]">94%</div>
          <p className="text-xs font-bold text-emerald-600 pt-1">Meta mensal atingida</p>
        </div>
      </div>

      {/* -------------------------------------------------------------- */}
      {/* GRADE: PACIENTES RECENTES (ESQ) & SESSÕES DE HOJE (DIR)        */}
      {/* -------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* COLUNA ESQUERDA: PACIENTES RECENTES */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold font-serif text-[#172C3A]">Pacientes Recentes</h3>
            <button
              type="button"
              onClick={() => onNavigate('pacientes')}
              className="text-xs font-bold text-[#0284C7] hover:underline cursor-pointer"
            >
              Ver todos
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentPatients.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  if (onSelectPatient) onSelectPatient({ id: p.id, name: p.name });
                  onNavigate('prontuario');
                }}
                className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sky-100 text-[#0284C7] font-bold text-xs flex items-center justify-center shrink-0 border border-sky-200">
                    {p.initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">{p.subtitle}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${p.statusClass}`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* COLUNA DIREITA: SESSÕES DE HOJE */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold font-serif text-[#172C3A]">Sessões de Hoje</h3>
            <button
              type="button"
              onClick={() => onNavigate('agenda')}
              className="text-xs font-bold text-[#0284C7] hover:underline cursor-pointer"
            >
              Agenda
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {todaySessions.map((s, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate('agenda')}
                className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-12 text-center text-xs font-bold text-[#172C3A] font-serif py-1 px-1.5 bg-slate-50 rounded-lg border border-slate-200 shrink-0">
                    {s.time}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                      {s.patient}
                    </h4>
                    <p className="text-[11px] text-slate-500">{s.therapy}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${s.statusClass}`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
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
  const [selectedProntuarioPatientId, setSelectedProntuarioPatientId] = useState(null);

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
        {activeSection !== 'prontuario' && activeSection !== 'dashboard' && (
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-navy">{info.title}</h1>
              <p className="text-sm text-muted">{info.subtitle}</p>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-primary bg-primary/10 px-4 py-2">
              <Users className="text-primary" size={18} aria-hidden="true" />
              <span className="text-xs font-bold text-navy">
                {patientsLoading || patientsError ? '—' : patients.filter((patient) => patient.patientStatus !== 'ARQUIVADO').length} Pacientes Ativos
              </span>
            </div>
          </header>
        )}

        {activeSection === 'dashboard' && (
          <DashboardHome
            onNavigate={navigateTo}
            onSelectPatient={(patient) => setSelectedProntuarioPatientId(patient.id)}
            patients={patients}
            loading={patientsLoading}
            error={patientsError}
            professionalName={professionalName}
          />
        )}
        {activeSection === 'pacientes' && (
          <Patients
            onOpenProntuario={(patient) => {
              setSelectedProntuarioPatientId(patient.id);
              navigateTo('prontuario');
            }}
          />
        )}
        {activeSection === 'prontuario' && (
          <MedicalRecordPage
            patients={patients}
            selectedPatientId={selectedProntuarioPatientId}
            onSelectPatient={(patient) => setSelectedProntuarioPatientId(patient.id)}
            onNavigate={navigateTo}
          />
        )}
        {activeSection === 'acompanhamento' && <Tracking />}
        {activeSection === 'agenda' && (
          <Schedule
            onNavigate={navigateTo}
            onSelectPatient={(patient) => setSelectedProntuarioPatientId(patient.id)}
          />
        )}
        {activeSection === 'relatorios' && <Reports onNavigate={navigateTo} />}
        {activeSection === 'configuracoes' && <SettingsPage />}
      </main>

      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />
    </div>
  );
}