import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  AudioWaveform,
  CircleCheck,
  ClipboardList,
  House,
  MessageSquare,
  PersonStanding,
  School,
  TriangleAlert,
  Volume2,
  VolumeX,
} from 'lucide-react';
import logoImg from '../assets/images/ModeloA_Semnome.jpg';
import A11yModal from './A11yModal';
import Notice from './Notice';
import { buttonClass } from './buttonStyles';
import { useA11y } from '../hooks/useA11y';

const modalities = [
  {
    id: 'form02',
    age: '0 a 2 anos',
    icon: ClipboardList,
    title: 'Formulário de Marcos',
    desc: 'Respondido pelo responsável. Avalia marcos como balbucio, primeiras palavras e reação a sons.',
  },
  {
    id: 'game24',
    age: '2 a 4 anos',
    icon: MessageSquare,
    title: 'Jogo da Palavra',
    desc: 'O responsável digita o que a criança disse ao ver uma imagem e o sistema aponta trocas de fonemas.',
  },
  {
    id: 'rima45',
    age: '4 a 5 anos',
    icon: AudioWaveform,
    title: 'Jogo da Rima',
    desc: 'A criança diz se duas palavras rimam. Avalia a consciência fonológica.',
  },
  {
    id: 'check6',
    age: '6 anos ou mais',
    icon: School,
    title: 'Checklist do Professor',
    desc: 'Respondido pelo professor. Identifica comportamentos que merecem encaminhamento.',
  },
];

const formOptions = [
  { value: 'sim', label: 'Sim', points: 0, status: 'Esperado' },
  { value: 'parcial', label: 'Às vezes', points: 1, status: 'Atenção' },
  { value: 'nao', label: 'Ainda não', points: 2, status: 'Abaixo do esperado' },
];

const formQuestions = [
  { id: 1, category: 'Comunicação verbal', question: 'A criança fala pelo menos 10 palavras reconhecíveis (ex.: mamãe, água, não, dá)?' },
  { id: 2, category: 'Compreensão', question: 'A criança entende ordens simples sem gestos, como "pega a bola" ou "vem aqui"?' },
  { id: 3, category: 'Imitação vocal', question: 'A criança imita sons ou palavras que o adulto fala, mesmo com a pronúncia errada?' },
  { id: 4, category: 'Atenção auditiva', question: 'A criança reage quando o nome dela é chamado em tom normal, sem gritar?' },
  { id: 5, category: 'Combinação de palavras', question: 'A criança já junta duas palavras para formar frases simples (ex.: "quer água", "cadê mamãe")?' },
  { id: 6, category: 'Intenção comunicativa', question: 'A criança aponta, gesticula ou usa outros recursos para pedir o que quer, além de chorar?' },
];

const formLevels = [
  {
    max: 24,
    tone: 'success',
    label: 'Risco baixo',
    text: 'As respostas indicam marcos de linguagem dentro do esperado para a idade.',
    advice: 'Continue acompanhando o desenvolvimento e repita a triagem se surgirem dúvidas.',
  },
  {
    max: 49,
    tone: 'warning',
    label: 'Risco moderado',
    text: 'Alguns marcos ainda não aparecem com frequência.',
    advice: 'Observe a criança nas próximas semanas e procure uma avaliação fonoaudiológica se os sinais continuarem.',
  },
  {
    max: 100,
    tone: 'danger',
    label: 'Risco elevado',
    text: 'Vários marcos esperados para a idade ainda não aparecem.',
    advice: 'Procure uma avaliação fonoaudiológica. UBSs e CAPSi oferecem atendimento gratuito pelo SUS.',
  },
];

const animals = [
  {
    picture: '🐄',
    name: 'vaca',
    phonemes: '/v/ /a/ /k/ /a/',
    alts: {
      faca: 'Troca de /v/ por /f/ (ensurdecimento).',
      baca: 'Troca de /v/ por /b/.',
      vaa: 'Omissão do /k/.',
    },
  },
  {
    picture: '🐍',
    name: 'cobra',
    phonemes: '/k/ /o/ /b/ /r/ /a/',
    alts: {
      coba: 'Omissão do /r/ no encontro consonantal, comum até os 4 anos.',
      corra: 'Troca de /b/ por /r/.',
      cobla: 'Troca de /r/ por /l/ no encontro consonantal.',
    },
  },
  {
    picture: '🌸',
    name: 'flor',
    phonemes: '/f/ /l/ /o/ /r/',
    alts: {
      for: 'Redução do encontro /fl/ para /f/, processo fonológico típico.',
      fror: 'Troca de /fl/ por /fr/.',
      flo: 'Omissão do /r/ final.',
    },
  },
  {
    picture: '🚂',
    name: 'trem',
    phonemes: '/t/ /r/ /e/ /m/',
    alts: {
      tem: 'Redução do encontro /tr/, muito comum até os 5 anos.',
      crem: 'Troca de /t/ por /k/.',
    },
  },
];

const rimaPairs = [
  { w1: 'gato', p1: '🐱', w2: 'pato', p2: '🦆', rima: true },
  { w1: 'bola', p1: '⚽', w2: 'mola', p2: '🌀', rima: true },
  { w1: 'casa', p1: '🏠', w2: 'peixe', p2: '🐟', rima: false },
  { w1: 'carro', p1: '🚗', w2: 'jarro', p2: '🏺', rima: true },
  { w1: 'pato', p1: '🦆', w2: 'elefante', p2: '🐘', rima: false },
];

const checklistItems = [
  { text: 'Evita falar em voz alta ou participar de atividades orais', detail: 'Vergonha, recusa a ler em voz alta, não responde quando chamada.' },
  { text: 'Troca sons que colegas da mesma idade não trocam', detail: 'Ex.: "cacholo" no lugar de "cachorro".' },
  { text: 'Tem dificuldade em rimar palavras ou identificar sons iniciais', detail: 'Atividades de consciência fonológica bem abaixo dos colegas.' },
  { text: 'Apresenta gagueira ou travamentos frequentes na fala', detail: 'Repetição de sílabas, prolongamentos, bloqueios ao falar.' },
  { text: 'Tem dificuldade em seguir instruções verbais da aula', detail: 'Precisa de repetição constante e perde o fio da explicação oral.' },
  { text: 'Tem desempenho muito abaixo dos colegas na alfabetização', detail: 'Dificuldade persistente em relacionar letra e som.' },
];

const toneText = { success: 'text-success', warning: 'text-warning', danger: 'text-danger' };

function normalize(text) {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function analyzeWord(animal, typed) {
  const guess = normalize(typed);
  if (!guess) return null;
  const target = animal.name;
  const letters = Array.from({ length: Math.max(target.length, guess.length) }, (_, index) => ({
    char: guess[index] ?? '–',
    ok: guess[index] === target[index],
  }));
  if (guess === target) return { correct: true, letters, text: 'Pronúncia correta. Nenhuma troca identificada nesta palavra.' };
  if (animal.alts[guess]) return { correct: false, letters, text: animal.alts[guess] };
  const diff = letters.filter((letter) => !letter.ok).length;
  return {
    correct: false,
    letters,
    text: `${diff} diferença(s) entre "${target}" e "${guess}". Possível troca ou omissão de fonemas.`,
  };
}

function ScreenHeader({ title, age, onBack }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={onBack} className={buttonClass('tertiary')}>
        <ArrowLeft size={16} aria-hidden="true" /> Voltar
      </button>
      <h2 className="text-2xl text-navy">{title}</h2>
      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{age}</span>
    </div>
  );
}

function Card({ title, subtitle, icon: Icon, children }) {
  return (
    <section className="rounded-md border border-line bg-surface">
      <div className="flex items-start gap-3 border-b border-line p-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon size={20} aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-xl text-navy">{title}</h3>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-col gap-6 p-5 md:p-6">{children}</div>
    </section>
  );
}

function Counter({ label, value, active }) {
  return (
    <span className={`rounded-full px-3 py-1.5 text-sm font-bold ${active ? 'bg-primary text-on-primary' : 'bg-mist text-navy'}`}>
      {label}: {value}
    </span>
  );
}

export default function TriagemGame() {
  const [screen, setScreen] = useState('home');
  const [showA11y, setShowA11y] = useState(false);
  const { isPlayerOpen, speakPageContent, stopSpeaking, speakText } = useA11y();

  const [formAnswers, setFormAnswers] = useState({});
  const [formResult, setFormResult] = useState(null);
  const [formWarning, setFormWarning] = useState(false);

  const [animalIndex, setAnimalIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [wordStats, setWordStats] = useState({ correct: 0, swaps: 0 });

  const [rimaIndex, setRimaIndex] = useState(0);
  const [rimaStats, setRimaStats] = useState({ hits: 0, misses: 0 });
  const [rimaFeedback, setRimaFeedback] = useState(null);

  const [checked, setChecked] = useState({});
  const [checkResult, setCheckResult] = useState(null);

  const animal = animals[animalIndex];
  const analysis = analyzeWord(animal, typed);
  const rimaPair = rimaPairs[rimaIndex];
  const answeredCount = Object.keys(formAnswers).length;

  const goTo = (id) => {
    setScreen(id);
    window.scrollTo({ top: 0 });
  };

  const showFormResult = () => {
    if (answeredCount < formQuestions.length) {
      setFormWarning(true);
      return;
    }
    const points = formQuestions.reduce(
      (sum, item) => sum + formOptions.find((option) => option.value === formAnswers[item.id]).points,
      0,
    );
    const percent = Math.round((points / (formQuestions.length * 2)) * 100);
    setFormWarning(false);
    setFormResult({ percent, level: formLevels.find((level) => percent <= level.max) });
  };

  const nextAnimal = () => {
    if (analysis) {
      setWordStats((stats) => (analysis.correct ? { ...stats, correct: stats.correct + 1 } : { ...stats, swaps: stats.swaps + 1 }));
    }
    setAnimalIndex((index) => (index + 1) % animals.length);
    setTyped('');
  };

  const answerRima = (answer) => {
    const correct = answer === rimaPair.rima;
    setRimaStats((stats) => (correct ? { ...stats, hits: stats.hits + 1 } : { ...stats, misses: stats.misses + 1 }));
    setRimaFeedback({
      correct,
      text: `${correct ? 'Resposta correta.' : 'Não foi dessa vez.'} "${rimaPair.w1}" e "${rimaPair.w2}" ${rimaPair.rima ? 'rimam' : 'não rimam'}.`,
    });
  };

  const nextRima = () => {
    setRimaIndex((index) => (index + 1) % rimaPairs.length);
    setRimaFeedback(null);
  };

  const showCheckResult = () => {
    const total = Object.values(checked).filter(Boolean).length;
    if (total <= 1) {
      setCheckResult({ total, tone: 'success', text: 'Perfil dentro do esperado. Nenhum encaminhamento necessário no momento. Reavaliar em 30 dias.' });
    } else if (total <= 3) {
      setCheckResult({
        total,
        tone: 'warning',
        text: 'Alguns comportamentos persistentes foram identificados. Comunique a família e observe por mais 2 semanas. Se continuar, encaminhe para triagem fonoaudiológica.',
      });
    } else {
      setCheckResult({
        total,
        tone: 'danger',
        text: 'Vários sinais de risco identificados. Recomenda-se encaminhar para avaliação fonoaudiológica e informar a coordenação e a família.',
      });
    }
  };

  const tabs = [{ id: 'home', title: 'Início', icon: House }, ...modalities];

  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-surface/95 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <a href="#/" className="flex items-center gap-3">
            <img src={logoImg} alt="FonoSync Logo" className="h-9 w-auto rounded bg-white object-contain" />
            <span className="font-serif text-xl font-bold text-navy">FonoSync</span>
            <span className="hidden text-sm text-muted sm:inline">Triagem</span>
          </a>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowA11y(true)} className={buttonClass('secondary')}>
              <PersonStanding size={16} aria-hidden="true" />
              <span className="hidden sm:inline">Acessibilidade</span>
            </button>
            <button
              type="button"
              aria-pressed={isPlayerOpen}
              onClick={() => (isPlayerOpen ? stopSpeaking() : speakPageContent())}
              className={buttonClass(isPlayerOpen ? 'primary' : 'tertiary')}
            >
              {isPlayerOpen ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
              <span className="hidden sm:inline">{isPlayerOpen ? 'Parar leitura' : 'Ouvir página'}</span>
            </button>
          </div>
        </div>
      </header>

      <nav aria-label="Modalidades da triagem" className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 sm:px-6">
          {tabs.map(({ id, title, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-current={screen === id ? 'page' : undefined}
              onClick={() => goTo(id)}
              className={`-mb-px flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-bold transition-colors ${
                screen === id ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-navy'
              }`}
            >
              <Icon size={16} aria-hidden="true" />
              {title}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
        {screen === 'home' && (
          <>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl text-navy md:text-4xl">Triagem fonoaudiológica</h1>
              <p className="max-w-2xl text-muted">
                Escolha a atividade de acordo com a idade da criança. Cada uma leva poucos minutos.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {modalities.map(({ id, age, icon: Icon, title, desc }) => (
                <div key={id} className="flex flex-col gap-3 rounded-md border border-line bg-surface p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-lg font-bold text-navy">{title}</p>
                      <p className="text-sm font-bold text-primary">{age}</p>
                    </div>
                  </div>
                  <p className="flex-1 text-sm text-muted">{desc}</p>
                  <div>
                    <button type="button" onClick={() => goTo(id)} className={buttonClass('primary')}>
                      Começar <ArrowRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {screen === 'form02' && (
          <>
            <ScreenHeader title="Formulário de Marcos" age="0 a 2 anos" onBack={() => goTo('home')} />
            <Card
              title="Desenvolvimento da linguagem"
              subtitle="Responda com base no comportamento da criança nas últimas semanas."
              icon={ClipboardList}
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm text-muted">
                  <span>Progresso</span>
                  <span>
                    {answeredCount} de {formQuestions.length} respondidas
                  </span>
                </div>
                <div className="h-2 rounded-full bg-line" aria-hidden="true">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{ width: `${(answeredCount / formQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {formQuestions.map((item, index) => (
                <fieldset key={item.id} className="flex flex-col gap-3">
                  <legend className="mb-2">
                    <span className="block text-xs font-bold uppercase tracking-wider text-primary">
                      Pergunta {index + 1} · {item.category}
                    </span>
                    <span className="text-base font-bold text-ink">{item.question}</span>
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {formOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={formAnswers[item.id] === option.value}
                        onClick={() => {
                          setFormAnswers({ ...formAnswers, [item.id]: option.value });
                          setFormResult(null);
                        }}
                        className={buttonClass(formAnswers[item.id] === option.value ? 'primary' : 'secondary')}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}

              <div role="status">
                {formWarning && (
                  <Notice tone="warning" title="Responda todas as perguntas para ver o resultado." />
                )}
              </div>

              <div>
                <button type="button" onClick={showFormResult} className={buttonClass('primary')}>
                  Ver resultado <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </Card>

            {formResult && (
              <section className="flex flex-col gap-5 rounded-md border border-line bg-surface p-5 md:p-6" aria-live="polite">
                <div className="flex flex-wrap items-center gap-5">
                  <div className="flex size-24 shrink-0 flex-col items-center justify-center rounded-full border-4 border-line">
                    <span className={`font-serif text-2xl font-bold ${toneText[formResult.level.tone]}`}>{formResult.percent}%</span>
                    <span className="text-xs text-muted">de risco</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`text-2xl ${toneText[formResult.level.tone]}`}>{formResult.level.label}</h3>
                    <p className="text-muted">{formResult.level.text}</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-120 text-left text-sm">
                    <thead>
                      <tr className="border-b border-line text-muted">
                        <th className="py-2 pr-4 font-bold">Marco avaliado</th>
                        <th className="py-2 pr-4 font-bold">Resposta</th>
                        <th className="py-2 font-bold">Situação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formQuestions.map((item) => {
                        const option = formOptions.find((current) => current.value === formAnswers[item.id]);
                        return (
                          <tr key={item.id} className="border-b border-line last:border-0">
                            <td className="py-2.5 pr-4 font-bold text-ink">{item.category}</td>
                            <td className="py-2.5 pr-4">{option.label}</td>
                            <td
                              className={`py-2.5 font-bold ${
                                option.points === 0 ? 'text-success' : option.points === 1 ? 'text-warning' : 'text-danger'
                              }`}
                            >
                              {option.status}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <Notice tone={formResult.level.tone} title="Próximo passo">
                  {formResult.level.advice}
                </Notice>
              </section>
            )}
          </>
        )}

        {screen === 'game24' && (
          <>
            <ScreenHeader title="Jogo da Palavra" age="2 a 4 anos" onBack={() => goTo('home')} />
            <Card
              title="Identificação de trocas de fonemas"
              subtitle="Mostre a imagem, pergunte o que é e digite exatamente como a criança falou."
              icon={MessageSquare}
            >
              <div className="flex flex-wrap gap-2">
                <Counter label="Rodada" value={`${animalIndex + 1} de ${animals.length}`} active />
                <Counter label="Corretas" value={wordStats.correct} />
                <Counter label="Com trocas" value={wordStats.swaps} />
              </div>

              <div className="flex flex-col items-center gap-2 rounded-md bg-mist p-6 text-center">
                <span className="text-7xl" role="img" aria-label={animal.name}>
                  {animal.picture}
                </span>
                <p className="font-serif text-3xl font-bold uppercase tracking-widest text-navy">{animal.name}</p>
                <p className="text-sm text-muted">{animal.phonemes}</p>
                <button type="button" onClick={() => speakText(animal.name)} className={buttonClass('tertiary')}>
                  <Volume2 size={16} aria-hidden="true" /> Ouvir a palavra
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="triagem-palavra" className="text-sm font-bold text-ink">
                  O que a criança disse
                </label>
                <input
                  id="triagem-palavra"
                  type="text"
                  autoComplete="off"
                  value={typed}
                  onChange={(event) => setTyped(event.target.value)}
                  placeholder="ex.: faca, baca"
                  className="min-h-12 w-full rounded-md border border-line bg-surface px-4 text-lg text-ink"
                />
              </div>

              {analysis && (
                <div className="flex flex-col gap-3" aria-live="polite">
                  <div className="flex flex-wrap gap-2" aria-hidden="true">
                    {analysis.letters.map((letter, index) => (
                      <span
                        key={index}
                        className={`min-w-10 rounded-md border px-3 py-2 text-center text-xl font-bold ${
                          letter.ok ? 'border-success bg-success/10 text-success' : 'border-danger bg-danger/10 text-danger'
                        }`}
                      >
                        {letter.char}
                      </span>
                    ))}
                  </div>
                  <Notice tone={analysis.correct ? 'success' : 'warning'} title={analysis.text} />
                </div>
              )}

              <div>
                <button type="button" onClick={nextAnimal} disabled={!analysis} className={buttonClass('primary')}>
                  Registrar e ir para a próxima <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </Card>
          </>
        )}

        {screen === 'rima45' && (
          <>
            <ScreenHeader title="Jogo da Rima" age="4 a 5 anos" onBack={() => goTo('home')} />
            <Card
              title="Consciência fonológica"
              subtitle="Mostre as duas imagens e pergunte se as palavras rimam."
              icon={AudioWaveform}
            >
              <div className="flex flex-wrap gap-2">
                <Counter label="Par" value={`${rimaIndex + 1} de ${rimaPairs.length}`} active />
                <Counter label="Acertos" value={rimaStats.hits} />
                <Counter label="Erros" value={rimaStats.misses} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  [rimaPair.p1, rimaPair.w1],
                  [rimaPair.p2, rimaPair.w2],
                ].map(([picture, word]) => (
                  <div key={word} className="flex flex-col items-center gap-2 rounded-md bg-mist p-5 text-center">
                    <span className="text-6xl" role="img" aria-label={word}>
                      {picture}
                    </span>
                    <p className="font-serif text-2xl font-bold uppercase text-navy">{word}</p>
                    <button type="button" onClick={() => speakText(word)} className={buttonClass('tertiary')}>
                      <Volume2 size={16} aria-hidden="true" /> Ouvir
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-center text-lg font-bold text-ink">
                "{rimaPair.w1}" e "{rimaPair.w2}" rimam?
              </p>

              {!rimaFeedback ? (
                <div className="flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={() => answerRima(true)} className={buttonClass('primary')}>
                    Sim, rimam
                  </button>
                  <button type="button" onClick={() => answerRima(false)} className={buttonClass('secondary')}>
                    Não rimam
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3" aria-live="polite">
                  <Notice tone={rimaFeedback.correct ? 'success' : 'warning'} title={rimaFeedback.text} />
                  <button type="button" onClick={nextRima} className={buttonClass('primary')}>
                    Próximo par <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              )}
            </Card>
          </>
        )}

        {screen === 'check6' && (
          <>
            <ScreenHeader title="Checklist do Professor" age="6 anos ou mais" onBack={() => goTo('home')} />
            <Card
              title="Observação em sala de aula"
              subtitle="Marque os comportamentos observados com frequência nas últimas 3 semanas."
              icon={School}
            >
              <div className="flex flex-col gap-3">
                {checklistItems.map((item, index) => (
                  <label
                    key={item.text}
                    className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 transition-colors ${
                      checked[index] ? 'border-primary bg-primary/5' : 'border-line hover:border-primary'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!checked[index]}
                      onChange={() => {
                        setChecked({ ...checked, [index]: !checked[index] });
                        setCheckResult(null);
                      }}
                      className="mt-1 size-5 shrink-0 accent-primary"
                    />
                    <span>
                      <span className="block font-bold text-ink">{item.text}</span>
                      <span className="text-sm text-muted">{item.detail}</span>
                    </span>
                  </label>
                ))}
              </div>

              <div>
                <button type="button" onClick={showCheckResult} className={buttonClass('primary')}>
                  Ver resultado <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>

              {checkResult && (
                <div aria-live="polite" className="flex flex-col gap-2">
                  <p className={`flex items-center gap-2 text-lg font-bold ${toneText[checkResult.tone]}`}>
                    {checkResult.tone === 'success' ? (
                      <CircleCheck size={20} aria-hidden="true" />
                    ) : (
                      <TriangleAlert size={20} aria-hidden="true" />
                    )}
                    {checkResult.total} de {checklistItems.length} sinais marcados
                  </p>
                  <p className="text-muted">{checkResult.text}</p>
                </div>
              )}
            </Card>
          </>
        )}
      </main>

      <footer className="border-t border-line bg-surface px-4 py-4 text-center text-sm text-muted">
        A triagem não substitui a avaliação de um fonoaudiólogo.
      </footer>

      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />
    </div>
  );
}
