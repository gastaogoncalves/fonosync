import { useState } from 'react';
import {
  AudioLines,
  Award,
  CalendarDays,
  CheckCircle2,
  ClipboardClock,
  Gamepad2,
  Home,
  Sparkles,
  Users,
} from 'lucide-react';
import DataTable from './DataTable';
import MetricCard from './MetricCard';
import Panel from './Panel';
import StatusBadge from './StatusBadge';
import Reveal from './Reveal';
import { buttonClass } from './buttonStyles';

/* ---------- Dados da prévia (copiados dos painéis reais) ---------- */
const profiles = [
  {
    id: 'profissional',
    label: 'Área do profissional',
    url: 'fonosync.app/profissional/dashboard',
    text: 'Pacientes, sessões e evoluções em um único painel, com o que precisa de atenção em destaque.',
  },
  {
    id: 'paciente',
    label: 'Área do paciente',
    url: 'fonosync.app/paciente',
    text: 'Jogos prescritos, próximas consultas e conquistas, em uma área simples e motivadora. Clique no menu para explorar.',
  },
];

const metrics = [
  { icon: Users, label: 'Pacientes ativos', value: 34, note: '+3 este mês' },
  { icon: CalendarDays, label: 'Sessões esta semana', value: 12, note: 'Próxima às 09:00' },
  { icon: ClipboardClock, label: 'Evoluções pendentes', value: 5, note: 'Requer revisão' },
  { icon: AudioLines, label: 'Análises IA', value: 8, note: '3 aguardam validação' },
];

const recentColumns = [
  { key: 'name', label: 'Paciente' },
  { key: 'goal', label: 'Objetivo' },
  { key: 'progress', label: 'Evolução' },
];

const recentPatients = [
  { id: 1, name: 'Maria Luiza Ferreira', goal: 'Fluência', progress: '+8%' },
  { id: 2, name: 'João Pedro Santos', goal: 'Fonema /r/', progress: 'Estável' },
  { id: 3, name: 'Ana Clara Souza', goal: 'Linguagem', progress: 'Revisar' },
];

const todaySessions = [
  { time: '09:00', patient: 'Maria Luiza', confirmed: true },
  { time: '11:30', patient: 'João Pedro', confirmed: true },
  { time: '15:00', patient: 'Ana Clara', confirmed: false },
];

const patientNav = [
  { id: 'inicio', label: 'Início', icon: Home },
  { id: 'jogos', label: 'Meus Jogos', icon: Gamepad2 },
  { id: 'conquistas', label: 'Conquistas', icon: Award },
];

const patientViews = {
  inicio: { title: 'Olá, Maria Luiza! 👋', subtitle: 'Pronta para treinar suas missões de hoje?' },
  jogos: { title: 'Jogos Terapêuticos 🎮', subtitle: 'Exercícios recomendados pela Dra. Renata.' },
  conquistas: { title: 'Suas Conquistas 🏆', subtitle: 'Selos por praticar os exercícios.' },
};

const games = [
  { emoji: '🎯', name: 'Caça-Sons: Fonema /r/', desc: 'Identifique palavras com o som vibrante.' },
  { emoji: '🧩', name: 'Jogo da Rima', desc: 'Combine pares de palavras com terminação igual.' },
];

const badges = [
  { emoji: '🌟', name: 'Primeira Triagem', desc: 'Concluiu o primeiro teste de fala.' },
  { emoji: '🔥', name: '7 Dias Seguidos', desc: 'Treinou a articulação a semana toda!' },
];

const cardClass = 'rounded-xl border border-line bg-surface shadow-sm';

// Deixa o conteúdo da prévia sem foco/clique (evita links reais dentro da demonstração).
const setInert = (inactive) => (el) => {
  if (el) el.inert = inactive;
};

/* ---------- Prévia: profissional ---------- */
function ProfessionalPreview() {
  return (
    <div ref={setInert(true)} className="space-y-4 p-5 select-none">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="flex flex-col items-start gap-4 lg:flex-row">
        <Panel title="Pacientes recentes" className="w-full flex-1">
          <DataTable caption="Pacientes recentes" columns={recentColumns} rows={recentPatients} />
        </Panel>

        <Panel title="Sessões de hoje" className="w-full shrink-0 lg:w-80">
          <ul className="flex flex-col">
            {todaySessions.map((session) => (
              <li key={session.time} className="flex min-h-13 items-center justify-between gap-3">
                <div className="flex flex-col gap-0.75">
                  <span className="text-sm font-bold text-navy">{session.time}</span>
                  <span className="text-sm text-muted">{session.patient}</span>
                </div>
                <StatusBadge tone={session.confirmed ? 'success' : 'warning'}>
                  {session.confirmed ? 'Confirmada' : 'A confirmar'}
                </StatusBadge>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

/* ---------- Prévia: paciente (menu clicável) ---------- */
function PatientPreview() {
  const [view, setView] = useState('inicio');
  const info = patientViews[view];

  return (
    <div className="flex min-h-96 flex-col sm:flex-row">
      <aside className="shrink-0 bg-band p-3 text-white sm:w-52 sm:p-4">
        <p className="mb-2 hidden px-3 text-[11px] font-bold tracking-wider text-on-band-muted uppercase sm:block">
          Área do paciente
        </p>
        <nav aria-label="Prévia da área do paciente" className="flex gap-1 sm:flex-col">
          {patientNav.map(({ id, label, icon: Icon }) => {
            const isActive = view === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex min-h-11 flex-1 items-center gap-2 rounded-r-md border-l-4 px-3 text-left text-sm font-bold transition-colors sm:flex-none sm:gap-3 ${
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
      </aside>

      <div className="flex-1 space-y-5 bg-canvas p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-navy">{info.title}</h3>
            <p className="text-sm text-muted">{info.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-warning bg-warning/10 px-4 py-2">
            <Sparkles className="text-warning" size={18} aria-hidden="true" />
            <span className="text-xs font-bold text-navy">120 Pontos acumulados</span>
          </div>
        </div>

        {view === 'inicio' && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className={`${cardClass} space-y-3 p-5`}>
              <h4 className="font-serif text-lg font-bold text-navy">Sua Próxima Consulta</h4>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-mist p-4">
                <div>
                  <p className="text-sm font-bold text-ink">Segunda-feira, 09:00</p>
                  <p className="text-xs text-muted">Com Dra. Renata Lima</p>
                </div>
                <span className="rounded-full border border-primary bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  Presencial
                </span>
              </div>
            </div>
            <div className={`${cardClass} space-y-3 p-5`}>
              <h4 className="font-serif text-lg font-bold text-navy">Treino da Semana</h4>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-ink">Jogo da Rima (Nível 2)</span>
                <span className="flex items-center gap-1 text-success">
                  <CheckCircle2 size={14} aria-hidden="true" /> Concluído
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-line" aria-hidden="true">
                <div className="h-full w-full bg-success" />
              </div>
            </div>
          </div>
        )}

        {view === 'jogos' && (
          <div className="grid gap-4 sm:grid-cols-2">
            {games.map((game) => (
              <div key={game.name} className={`${cardClass} space-y-3 p-5`}>
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-xl" aria-hidden="true">
                  {game.emoji}
                </div>
                <h4 className="font-bold text-navy">{game.name}</h4>
                <p className="text-xs text-muted">{game.desc}</p>
                <span className={`${buttonClass('primary')} w-full`} aria-hidden="true">Jogar agora</span>
              </div>
            ))}
          </div>
        )}

        {view === 'conquistas' && (
          <div className="grid gap-4 sm:grid-cols-2">
            {badges.map((badge) => (
              <div key={badge.name} className={`${cardClass} space-y-2 p-5 text-center`}>
                <span className="text-4xl" aria-hidden="true">{badge.emoji}</span>
                <h4 className="text-sm font-bold text-navy">{badge.name}</h4>
                <p className="text-xs text-muted">{badge.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Seção Sobre ---------- */
export default function About() {
  const [profile, setProfile] = useState('profissional');
  const current = profiles.find((p) => p.id === profile);

  const panelClass = (id) =>
    `col-start-1 row-start-1 transition-opacity duration-300 ${
      profile === id ? 'opacity-100' : 'pointer-events-none opacity-0'
    }`;

  return (
    <section id="sobre" className="mx-auto max-w-360 scroll-mt-24 px-6 md:px-18 pt-20">
      <Reveal className="mb-10 max-w-3xl">
        <span className="mb-4 block text-sm font-bold tracking-wider text-primary uppercase">Sobre o FonoSync</span>
        <h2 className="mb-5 text-3xl text-navy md:text-4xl">Terapia fonoaudiológica em um só lugar</h2>
        <p className="mb-4 text-lg text-muted">
          O FonoSync é um sistema de apoio à fonoaudiologia que reúne prontuário digital, agenda e jogos terapêuticos.
          O profissional acompanha a evolução de cada paciente; o paciente
          e a família praticam em casa, de forma leve e acompanhada.
        </p>
        <p className="text-lg text-muted">
          O projeto nasceu como TCC na FATEC Ferraz de Vasconcelos, com foco em uso clínico real e em
          conformidade com a LGPD.
        </p>
      </Reveal>

      <Reveal>
        <div role="tablist" aria-label="Prévia das áreas do FonoSync" className="mb-3 inline-flex rounded-xl border border-line bg-surface p-1">
          {profiles.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              id={`tab-${p.id}`}
              aria-selected={profile === p.id}
              aria-controls={`preview-${p.id}`}
              onClick={() => setProfile(p.id)}
              className={`rounded-lg px-5 py-2 text-sm font-bold transition-colors ${
                profile === p.id ? 'bg-primary text-on-primary' : 'text-muted hover:text-primary'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="mb-6 max-w-2xl text-muted">{current.text}</p>

        <div className="overflow-hidden rounded-2xl border border-line bg-canvas shadow-lg">
          <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-3">
            <span className="size-2.5 rounded-full bg-line" />
            <span className="size-2.5 rounded-full bg-line" />
            <span className="size-2.5 rounded-full bg-line" />
            <span className="ml-2 flex-1 truncate rounded-md bg-mist px-3 py-1 text-xs text-muted">{current.url}</span>
          </div>

          {/* Os dois painéis ocupam a mesma célula: a altura não "pula" ao trocar de aba */}
          <div className="grid">
            <div
              role="tabpanel"
              id="preview-profissional"
              aria-labelledby="tab-profissional"
              ref={setInert(profile !== 'profissional')}
              className={panelClass('profissional')}
            >
              <ProfessionalPreview />
            </div>
            <div
              role="tabpanel"
              id="preview-paciente"
              aria-labelledby="tab-paciente"
              ref={setInert(profile !== 'paciente')}
              className={panelClass('paciente')}
            >
              <PatientPreview />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}