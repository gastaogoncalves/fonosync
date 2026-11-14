import { useEffect, useState } from 'react';
import {
  Calendar,
  FileText,
  Home,
  LogOut,
  PersonStanding,
  Settings,
  Users,
  Volume2,
} from 'lucide-react';
import logoImg from '../assets/images/ModeloA_Semnome.jpg';
import { useA11y } from '../hooks/useA11y';
import { useAuth } from '../hooks/useAuth';
import A11yModal from '../components/A11yModal';

import Patients from './professional/Patients';
import MedicalRecordPage from './professional/MedicalRecordPage';
import Overview from './professional/Home';
import Schedule from './professional/Schedule';
import Reports from './professional/Reports';
import SettingsPage from './professional/SettingsPage';
import { listPatients } from '../services/patientService';

const navItems = [
  { id: 'dashboard', label: 'Início', icon: Home },
  { id: 'pacientes', label: 'Pacientes', icon: Users },
  { id: 'prontuario', label: 'Prontuário', icon: FileText },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'relatorios', label: 'Relatórios', icon: FileText },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
];

const pageInfo = {
  dashboard: { title: 'Painel do Profissional', subtitle: '' },
  pacientes: { title: 'Gestão de Pacientes', subtitle: 'Cadastre, busque e gerencie os prontuários ativos.' },
  prontuario: { title: 'Prontuário', subtitle: 'Acompanhe evolução, histórico de sessões, diagnóstico e exames.' },
  agenda: { title: 'Agenda de Atendimentos', subtitle: 'Organize sessões presenciais e teleatendimentos.' },
  relatorios: { title: 'Relatórios e Documentos', subtitle: 'Emita laudos, atestados e exportações acessíveis.' },
  configuracoes: { title: 'Configurações do Consultório', subtitle: 'Gerencie seu perfil e credenciais profissionais.' },
};

function authenticatedName(session) {
  return session?.name || session?.nome || session?.fullName || session?.user?.name ||
    session?.professional?.name || session?.email || session?.user?.email || 'Profissional';
}

export default function ProfessionalDashboard({ section = 'dashboard', recordId }) {
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
  }, [activeSection]);

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
          <Overview onNavigate={navigateTo} />
        )}
        {activeSection === 'pacientes' && (
          <Patients
            onOpenProntuario={(patient) => {
              setSelectedProntuarioPatientId(patient.id);
              navigateTo(`prontuario/${patient.id}`);
            }}
          />
        )}
        {activeSection === 'prontuario' && (
          <MedicalRecordPage
            key={recordId || selectedProntuarioPatientId || 'primeiro'}
            patients={patients}
            selectedPatientId={recordId || selectedProntuarioPatientId}
            onSelectPatient={(patient) => setSelectedProntuarioPatientId(patient.id)}
            onNavigate={navigateTo}
          />
        )}
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