import { useState } from 'react';
import {
  Accessibility,
  Award,
  Calendar,
  CheckCircle2,
  Gamepad2,
  Home,
  Lock,
  LogOut,
  Mail,
  Phone,
  Save,
  Settings,
  Sparkles,
  User,
} from 'lucide-react';
import logoImg from '../../assets/images/ModeloA_Semnome.jpg';
import A11yModal from "../../components/A11yModal";
import Button from "../../components/Button";
import Notice from "../../components/Notice";
import StatusBadge from "../../components/StatusBadge";
import { buttonClass } from "../../components/buttonStyles";

const navItems = [
  { id: 'inicio', label: 'Início', icon: Home },
  { id: 'jogos', label: 'Meus Jogos', icon: Gamepad2 },
  { id: 'consultas', label: 'Consultas', icon: Calendar },
  { id: 'conquistas', label: 'Conquistas', icon: Award },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
];

const pageInfo = {
  inicio: { title: 'Olá, Maria Luiza! 👋', subtitle: 'Pronta para treinar suas missões de hoje?' },
  jogos: { title: 'Jogos Terapêuticos Prescritos 🎮', subtitle: 'Exercícios divertidos recomendados pela Dra. Renata.' },
  consultas: { title: 'Minhas Consultas e Agendamentos 📅', subtitle: 'Histórico e próximos horários confirmados.' },
  conquistas: { title: 'Suas Conquistas e Prêmios 🏆', subtitle: 'Acompanhe seus selos por praticar os exercícios.' },
  configuracoes: { title: 'Configurações do Perfil ⚙️', subtitle: 'Atualize seus dados pessoais e preferências.' },
};

const initialExercises = [
  { id: 'respiracao', title: 'Respiração diafragmática', minutes: 4, done: true },
  { id: 'r-medial', title: 'Palavras com /r/ medial', minutes: 6, done: true },
  { id: 'leitura', title: 'Leitura ritmada', minutes: 8, done: false },
  { id: 'fala', title: 'Fala espontânea', minutes: 4, done: false },
];

const POINTS_PER_EXERCISE = 10;
const cardClass = 'rounded-xl border border-line bg-surface shadow-sm';

function Field({ id, label, icon: Icon, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-bold uppercase text-navy">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-md border border-line bg-surface p-3 text-sm focus-within:outline-3 focus-within:outline-focus">
        {Icon && <Icon size={16} className="shrink-0 text-muted" aria-hidden="true" />}
        <input id={id} className="w-full bg-transparent font-semibold text-ink outline-none" {...props} />
      </div>
    </div>
  );
}

function NextAppointment({ confirmed, onConfirm }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-mist p-4">
        <div>
          <p className="text-sm font-bold text-ink">Segunda-feira, 09:00</p>
          <p className="text-xs text-muted">Com Dra. Renata Lima · Presencial</p>
        </div>
        <StatusBadge tone={confirmed ? 'success' : 'warning'}>{confirmed ? 'Confirmada' : 'A confirmar'}</StatusBadge>
      </div>
      {!confirmed && (
        <Button variant="primary" onClick={onConfirm}>
          <CheckCircle2 size={16} aria-hidden="true" /> Confirmar presença
        </Button>
      )}
    </div>
  );
}

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [showA11y, setShowA11y] = useState(false);
  const [exercises, setExercises] = useState(initialExercises);
  const [points, setPoints] = useState(120);
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);

  const [patientData, setPatientData] = useState({
    name: 'Maria Luiza Ferreira',
    age: '8 anos',
    responsible: 'Clara Ferreira (Mãe)',
    phone: '(11) 98765-4321',
    email: 'clara.ferreira@email.com',
  });
  const [savedNotice, setSavedNotice] = useState(false);

  const doneCount = exercises.filter((exercise) => exercise.done).length;
  const allDone = doneCount === exercises.length;

  const toggleExercise = (id) => {
    const target = exercises.find((exercise) => exercise.id === id);
    setExercises((list) => list.map((exercise) => (exercise.id === id ? { ...exercise, done: !exercise.done } : exercise)));
    setPoints((value) => value + (target.done ? -POINTS_PER_EXERCISE : POINTS_PER_EXERCISE));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleLogout = () => {
    window.location.hash = '#/';
  };

  const info = pageInfo[activeTab];
  const bind = (field) => ({
    value: patientData[field],
    onChange: (e) => setPatientData({ ...patientData, [field]: e.target.value }),
  });

  const badges = [
    { id: 'triagem', emoji: '🌟', title: 'Primeira Triagem', text: 'Concluiu o primeiro teste de fala.', earned: true },
    { id: 'sequencia', emoji: '🔥', title: '7 Dias Seguidos', text: 'Treinou a articulação a semana toda!', earned: true },
    { id: 'treino', emoji: '🏅', title: 'Treino do dia completo', text: 'Conclua os 4 exercícios do dia.', earned: allDone },
  ];

  return (
    <div className="flex min-h-screen bg-canvas font-sans">
      <aside className="flex w-64 shrink-0 flex-col justify-between bg-band p-5 text-white">
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

        <div className="space-y-3 border-t border-white/15 pt-6">
          <button
            type="button"
            onClick={() => setShowA11y(true)}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-white/30 px-3 py-2 text-xs font-bold text-white hover:bg-white/10"
          >
            <Accessibility size={16} aria-hidden="true" /> Acessibilidade
          </button>

          <div className="flex items-center gap-3 rounded-md border border-white/15 bg-white/10 p-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-white/30 bg-primary font-serif text-sm font-bold text-on-primary">
              ML
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">{patientData.name}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-on-band-muted">
                <span className="size-1.5 animate-pulse rounded-full bg-accent" aria-hidden="true" /> Ativo
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
          <div className="flex items-center gap-2 rounded-md border border-warning bg-warning/10 px-4 py-2">
            <Sparkles className="text-warning" size={18} aria-hidden="true" />
            <span className="text-xs font-bold text-navy">{points} Pontos acumulados</span>
          </div>
        </header>

        {activeTab === 'inicio' && (
          <section className="grid gap-6 md:grid-cols-2">
            <div className={`${cardClass} space-y-4 p-6`}>
              <h2 className="font-serif text-lg font-bold text-navy">Sua Próxima Consulta</h2>
              <NextAppointment confirmed={appointmentConfirmed} onConfirm={() => setAppointmentConfirmed(true)} />
            </div>

            <div className={`${cardClass} space-y-4 p-6`}>
              <div className="flex items-end justify-between gap-3">
                <h2 className="font-serif text-lg font-bold text-navy">Exercícios do dia</h2>
                <span className="text-sm text-muted">{doneCount} de {exercises.length} concluídos</span>
              </div>

              <div
                role="progressbar"
                aria-label="Exercícios concluídos"
                aria-valuemin={0}
                aria-valuemax={exercises.length}
                aria-valuenow={doneCount}
                className="h-2 w-full overflow-hidden rounded-full bg-line"
              >
                <div className="h-full bg-success transition-all" style={{ width: `${(doneCount / exercises.length) * 100}%` }} />
              </div>

              <ul className="flex flex-col divide-y divide-line">
                {exercises.map((exercise) => (
                  <li key={exercise.id} className="flex items-center justify-between gap-3">
                    <label className="flex min-h-11 flex-1 cursor-pointer items-center gap-3 text-sm text-ink">
                      <input
                        type="checkbox"
                        checked={exercise.done}
                        onChange={() => toggleExercise(exercise.id)}
                        className="size-5 accent-primary"
                      />
                      <span className={exercise.done ? 'text-muted line-through' : ''}>{exercise.title}</span>
                    </label>
                    <span className="text-xs text-muted">{exercise.minutes} min</span>
                  </li>
                ))}
              </ul>

              <div role="status">
                {allDone && (
                  <Notice tone="success" title="Treino do dia completo">
                    Você ganhou um selo novo em Conquistas.
                  </Notice>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'jogos' && (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className={`${cardClass} space-y-3 p-5`}>
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-xl" aria-hidden="true">🎯</div>
              <h3 className="font-bold text-navy">Caça-Sons: Fonema /r/</h3>
              <p className="text-xs text-muted">Identifique palavras com o som vibrante.</p>
              <a href="#/triagem" className={`${buttonClass('primary')} w-full`}>Jogar agora</a>
            </div>

            <div className={`${cardClass} space-y-3 p-5`}>
              <div className="flex size-12 items-center justify-center rounded-xl bg-warning/10 text-xl" aria-hidden="true">🧩</div>
              <h3 className="font-bold text-navy">Jogo da Rima</h3>
              <p className="text-xs text-muted">Combine pares de palavras com terminação igual.</p>
              <a href="#/triagem" className={`${buttonClass('primary')} w-full`}>Jogar agora</a>
            </div>
          </section>
        )}

        {activeTab === 'consultas' && (
          <section className="space-y-6">
            <div className={`${cardClass} space-y-4 p-6`}>
              <h2 className="font-serif text-lg font-bold text-navy">Próxima consulta</h2>
              <NextAppointment confirmed={appointmentConfirmed} onConfirm={() => setAppointmentConfirmed(true)} />
            </div>

            <div className={`${cardClass} space-y-4 p-6`}>
              <h2 className="font-serif text-lg font-bold text-navy">Histórico de Atendimentos</h2>
              <div className="flex items-center justify-between gap-3 rounded-xl bg-mist p-4 text-sm">
                <div>
                  <p className="font-bold text-navy">Sessão de Avaliação Fonética</p>
                  <p className="text-xs text-muted">04 de Novembro de 2026 - Dra. Renata Lima</p>
                </div>
                <StatusBadge tone="success">Realizada</StatusBadge>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'conquistas' && (
          <section className="grid gap-4 sm:grid-cols-3">
            {badges.map((badge) => (
              <div key={badge.id} className={`${cardClass} space-y-2 p-5 text-center ${badge.earned ? '' : 'opacity-70'}`}>
                <span className={`text-4xl ${badge.earned ? '' : 'grayscale'}`} aria-hidden="true">{badge.emoji}</span>
                <h3 className="text-sm font-bold text-navy">{badge.title}</h3>
                <p className="text-xs text-muted">{badge.text}</p>
                {badge.earned ? (
                  <StatusBadge tone="success">Conquistada</StatusBadge>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-muted">
                    <Lock size={14} aria-hidden="true" /> Bloqueada
                  </span>
                )}
              </div>
            ))}
          </section>
        )}

        {activeTab === 'configuracoes' && (
          <section className={`${cardClass} max-w-2xl p-6`}>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <Field id="pac-nome" label="Nome do Paciente" icon={User} type="text" {...bind('name')} />

              <div className="grid grid-cols-2 gap-3">
                <Field id="pac-idade" label="Idade" type="text" {...bind('age')} />
                <Field id="pac-responsavel" label="Responsável Legal" type="text" {...bind('responsible')} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field id="pac-telefone" label="Telefone / WhatsApp" icon={Phone} type="text" {...bind('phone')} />
                <Field id="pac-email" label="E-mail de Contato" icon={Mail} type="email" {...bind('email')} />
              </div>

              <div className="flex items-center justify-between border-t border-line pt-4">
                <span role="status" className="flex items-center gap-1 text-xs font-bold text-success">
                  {savedNotice && (
                    <>
                      <CheckCircle2 size={16} aria-hidden="true" /> Dados atualizados com sucesso!
                    </>
                  )}
                </span>

                <Button variant="primary" type="submit">
                  <Save size={16} aria-hidden="true" /> Salvar alterações
                </Button>
              </div>
            </form>
          </section>
        )}
      </main>

      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />
    </div>
  );
}