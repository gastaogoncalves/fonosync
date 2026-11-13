import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  AudioWaveform,
  CheckCircle2,
  ClipboardList,
  Download,
  History,
  MessageSquare,
  School,
  Search,
  TriangleAlert,
  Volume2,
} from 'lucide-react';
import A11yModal from './A11yModal';
import DataTable from './DataTable';
import Notice from './Notice';
import { buttonClass } from './buttonStyles';
import { useA11y } from '../hooks/useA11y';

const modalities = [
  { id: '0-2', age: '0-2 anos', icon: ClipboardList, title: 'Formulário de Marcos', desc: 'Observação guiada de comunicação, compreensão e expressão.' },
  { id: '2-4', age: '2-4 anos', icon: MessageSquare, title: 'Jogo da Palavra', desc: 'Nomeação e repertório em tarefas breves com apoio do responsável.' },
  { id: '4-5', age: '4-5 anos', icon: AudioWaveform, title: 'Jogo da Rima', desc: 'Consciência fonológica com pares sonoros e instruções narradas.' },
  { id: '6+', age: '6+ anos', icon: School, title: 'Checklist do Professor', desc: 'Sinais funcionais observados em sala e recomendação de encaminhamento.' },
];

const words = [
  { word: 'casa', article: 'uma', emoji: '🏠' },
  { word: 'bola', article: 'uma', emoji: '⚽' },
  { word: 'gato', article: 'um', emoji: '🐱' },
  { word: 'flor', article: 'uma', emoji: '🌸' },
  { word: 'sol', article: 'o', emoji: '☀️' },
  { word: 'lua', article: 'a', emoji: '🌙' },
  { word: 'pato', article: 'um', emoji: '🦆' },
  { word: 'copo', article: 'um', emoji: '🥛' },
  { word: 'livro', article: 'um', emoji: '📖' },
  { word: 'peixe', article: 'um', emoji: '🐟' },
];

const responses = [
  { id: 'espontanea', label: 'Falou espontaneamente' },
  { id: 'ajuda', label: 'Falou com ajuda' },
  { id: 'nao', label: 'Não falou' },
];

const RISK_LEVELS = [
  {
    min: 70,
    label: 'Risco baixo',
    tone: 'success',
    text: 'Poucos sinais de dificuldade na nomeação nesta triagem.',
    advice: 'Continue acompanhando o desenvolvimento da fala e repita a triagem se surgirem dúvidas.',
  },
  {
    min: 40,
    label: 'Risco moderado',
    tone: 'warning',
    text: 'Sinais em nomeação pedem observação profissional.',
    advice: 'Agende avaliação fonoaudiológica para investigação da fala e leve este resumo à consulta.',
  },
  {
    min: 0,
    label: 'Risco elevado',
    tone: 'warning',
    text: 'Muitas palavras não foram nomeadas. Recomenda-se avaliação profissional.',
    advice: 'Procure avaliação fonoaudiológica o quanto antes e leve este resumo à consulta.',
  },
];

const toneStyles = {
  success: { box: 'border-success bg-success/10', text: 'text-success', icon: CheckCircle2 },
  warning: { box: 'border-warning bg-warning/10', text: 'text-warning', icon: TriangleAlert },
};

const historyColumns = [
  { key: 'date', label: 'Data' },
  { key: 'modality', label: 'Modalidade' },
  { key: 'spontaneous', label: 'Nomeação espontânea' },
  { key: 'risk', label: 'Classificação' },
];

const formQuestions = [
  { id: 1, category: 'Comunicação Verbal', question: 'A criança fala pelo menos 10 palavras reconhecíveis (ex.: mamãe, água, não, dá)?', options: [
    { value: 'sim', label: '✅ Sim, claramente' },
    { value: 'parcial', label: '⚠️ Algumas vezes' },
    { value: 'nao', label: '❌ Ainda não' },
  ]},
  { id: 2, category: 'Compreensão', question: 'A criança entende ordens simples sem gestos, como "pega a bola" ou "vem aqui"?', options: [
    { value: 'sim', label: '✅ Sim, sempre' },
    { value: 'parcial', label: '⚠️ Às vezes' },
    { value: 'nao', label: '❌ Raramente' },
  ]},
  { id: 3, category: 'Imitação Vocal', question: 'A criança imita sons ou palavras que o adulto fala, mesmo que com pronúncia diferente?', options: [
    { value: 'sim', label: '✅ Sim, com frequência' },
    { value: 'parcial', label: '⚠️ Raramente' },
    { value: 'nao', label: '❌ Não imita' },
  ]},
  { id: 4, category: 'Atenção Auditiva', question: 'A criança reage quando é chamada em tom normal (sem gritar)?', options: [
    { value: 'sim', label: '✅ Sempre reage' },
    { value: 'parcial', label: '⚠️ Às vezes ignora' },
    { value: 'nao', label: '❌ Quase não reage' },
  ]},
  { id: 5, category: 'Combinação de Palavras', question: 'A criança já junta duas palavras para formar frases simples (ex.: "quer água", "cadê mamãe")?', options: [
    { value: 'sim', label: '✅ Sim, com frequência' },
    { value: 'parcial', label: '⚠️ Começando agora' },
    { value: 'nao', label: '❌ Ainda não' },
  ]},
  { id: 6, category: 'Intenção Comunicativa', question: 'A criança aponta, gesticula ou usa outros recursos para pedir o que quer além de chorar?', options: [
    { value: 'sim', label: '✅ Sim, muito' },
    { value: 'parcial', label: '⚠️ Às vezes' },
    { value: 'nao', label: '❌ Quase nunca' },
  ]},
];

const animals = [
  { emoji: '🐄', name: 'VACA', phonemes: '/v/ + /a/ + /k/ + /a/', target: 'vaca', alts: { faca: 'Troca de /v/ → /f/ (Ensurdecimento de fricativa labiodental)', baca: 'Troca de /v/ → /b/ (Sonorização incorreta)', vaka: 'Escrita fonética — pronúncia correta do fonema', vaa: 'Omissão do /k/ medial' } },
  { emoji: '🐍', name: 'COBRA', phonemes: '/k/ + /o/ + /b/ + /r/ + /a/', target: 'cobra', alts: { coba: 'Omissão do /r/ em encontro consonantal (processo comum até 4a)', corra: 'Troca de /b/ → /r/', cobla: 'Metátese do encontro consonantal' } },
  { emoji: '🌸', name: 'FLOR', phonemes: '/f/ + /l/ + /o/ + /r/', target: 'flor', alts: { for: 'Redução do encontro consonantal /fl/ → /f/ (processo fonológico típico)', fror: 'Metátese /fl/ → /fr/ (variação no encontro consonantal)', flô: 'Omissão do /r/ final (regionalismo ou processo fonológico)' } },
  { emoji: '🚂', name: 'TREM', phonemes: '/t/ + /r/ + /e/ + /m/', target: 'trem', alts: { tem: 'Redução do encontro consonantal /tr/ (muito comum até 5a)', telen: 'Múltiplos processos fonológicos simultâneos', crem: 'Troca de /t/ → /k/ (assimilação velar)' } },
];

const rimaPairs = [
  { w1: 'GATO', e1: '🐱', w2: 'PATO', e2: '🦆', rima: true },
  { w1: 'BOLA', e1: '⚽', w2: 'MOLA', e2: '🌀', rima: true },
  { w1: 'CASA', e1: '🏠', w2: 'PEIXE', e2: '🐟', rima: false },
  { w1: 'CARRO', e1: '🚗', w2: 'JARRO', e2: '🏺', rima: true },
  { w1: 'PATO', e1: '🦆', w2: 'ELEFANTE', e2: '🐘', rima: false },
];

const checklistItems = [
  'A criança evita falar em voz alta ou participar de atividades orais',
  'Troca sons que colegas da mesma faixa etária não trocam',
  'Tem dificuldade em rimar palavras ou identificar sons iniciais',
  'Apresenta gagueira ou travamentos frequentes na fala',
  'Demonstra dificuldade em seguir instruções verbais da aula',
  'Apresenta desempenho muito abaixo dos colegas na alfabetização',
];

function summarize(answers) {
  const total = answers.length;
  const spontaneous = answers.filter((answer) => answer === 'espontanea').length;
  const assisted = answers.filter((answer) => answer === 'ajuda').length;
  const spontaneousPct = Math.round((spontaneous / total) * 100);
  const helpedPct = Math.round(((spontaneous + assisted) / total) * 100);
  const risk = RISK_LEVELS.find((level) => spontaneousPct >= level.min) ?? RISK_LEVELS[RISK_LEVELS.length - 1];
  return { spontaneous, assisted, spontaneousPct, helpedPct, risk };
}

function StepProgress({ value }) {
  return (
    <div role="progressbar" aria-label="Progresso da triagem" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} className="h-1.5 w-full bg-line">
      <div className="h-full bg-primary transition-all duration-300" style={{ width: `${value}%` }} />
    </div>
  );
}

function ResultBar({ label, caption, value }) {
  return (
    <div className="flex flex-col gap-2 bg-mist p-4">
      <p className="text-xs font-bold text-navy">{label}</p>
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{caption}</span>
        <span className="font-bold text-navy">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-line" aria-hidden="true">
        <div className="h-2 rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function TriagemGame() {
  const [screenStack, setScreenStack] = useState(['home']);
  const [wordIndex, setWordIndex] = useState(0);
  const [answers, setAnswers] = useState(() => Array(words.length).fill(null));
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [downloaded, setDownloaded] = useState(false);
  const [showA11y, setShowA11y] = useState(false);
  const [formAnswers, setFormAnswers] = useState({});
  const [formResultVisible, setFormResultVisible] = useState(false);
  const [formWarningVisible, setFormWarningVisible] = useState(false);
  const [gameAnimalIndex, setGameAnimalIndex] = useState(0);
  const [gameResponse, setGameResponse] = useState('');
  const [gameAnalysis, setGameAnalysis] = useState('');
  const [gameComparison, setGameComparison] = useState([]);
  const [acertos, setAcertos] = useState(0);
  const [trocas, setTrocas] = useState(0);
  const [rimaIndex, setRimaIndex] = useState(0);
  const [rimaAcertos, setRimaAcertos] = useState(0);
  const [rimaErros, setRimaErros] = useState(0);
  const [rimaFeedback, setRimaFeedback] = useState('');
  const [checkListState, setCheckListState] = useState({});
  const [checkResultVisible, setCheckResultVisible] = useState(false);
  const { isPlayerOpen, speakPageContent, stopSpeaking, speakText } = useA11y();

  const activeScreen = screenStack[screenStack.length - 1];
  const total = words.length;
  const currentWord = words[wordIndex];
  const currentAnswer = answers[wordIndex];
  const modality = modalities[1];

  const currentAnimal = animals[gameAnimalIndex];
  const rimaPair = rimaPairs[rimaIndex];

  const completedForms = useMemo(() => Object.keys(formAnswers).length, [formAnswers]);
  const formTotal = formQuestions.length;
  const riskTone = result ? toneStyles[result.risk.tone] : null;

  const showScreen = (screenId) => {
    setScreenStack((prev) => {
      if (prev[prev.length - 1] === screenId) return prev;
      return [...prev, screenId];
    });
  };

  const goBack = () => {
    setScreenStack((prev) => (prev.length <= 1 ? ['home'] : prev.slice(0, -1)));
  };

  const answer = (id) => setAnswers((list) => list.map((value, index) => (index === wordIndex ? id : value)));

  const goNext = () => {
    if (wordIndex < total - 1) {
      setWordIndex((value) => value + 1);
      return;
    }

    const summary = summarize(answers);
    const record = {
      id: Date.now(),
      date: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      modality: `${modality.title} (${modality.age})`,
      answers,
      ...summary,
    };

    setResult(record);
    setHistory((list) => [record, ...list]);
    setDownloaded(false);
    setScreenStack((prev) => [...prev, 'result']);
  };

  const downloadResult = () => {
    if (!result) return;
    const answerLabel = Object.fromEntries(responses.map((response) => [response.id, response.label]));
    const lines = [
      'FonoSync · Resultado da triagem',
      `Data: ${result.date}`,
      `Modalidade: ${result.modality}`,
      '',
      `Classificação: ${result.risk.label}`,
      result.risk.text,
      '',
      'Desempenho',
      `- Nomeação espontânea: ${result.spontaneous} de ${total} palavras (${result.spontaneousPct}%)`,
      `- Nomeação com ou sem ajuda: ${result.spontaneous + result.assisted} de ${total} palavras (${result.helpedPct}%)`,
      '',
      'Registro por palavra',
      ...words.map((item, index) => `${index + 1}. ${item.word}: ${answerLabel[result.answers[index]]}`),
      '',
      'Recomendação',
      result.risk.advice,
      '',
      'Importante: esta triagem não substitui avaliação profissional e não produz diagnóstico.',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resultado-triagem-fonosync.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setDownloaded(true);
  };

  const historyRows = history.map((record) => ({
    id: record.id,
    date: record.date,
    modality: record.modality,
    spontaneous: `${record.spontaneous} de ${total}`,
    risk: record.risk.label,
  }));

  const selectFormOption = (questionId, value) => setFormAnswers((prev) => ({ ...prev, [questionId]: value }));

  const showFormResult = () => {
    const isComplete = Object.keys(formAnswers).length === formTotal;
    if (!isComplete) {
      setFormWarningVisible(true);
      return;
    }
    setFormWarningVisible(false);
    setFormResultVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const evaluateWordGuess = (guess) => {
    const normalizedGuess = guess.trim().toLowerCase();
    if (!normalizedGuess) {
      setGameAnalysis('');
      setGameComparison([]);
      return;
    }

    const target = currentAnimal.target;
    const maxLen = Math.max(target.length, normalizedGuess.length);
    const comparison = Array.from({ length: maxLen }, (_, index) => {
      const targetLetter = target[index] ?? '';
      const typedLetter = normalizedGuess[index] ?? '';
      return {
        char: typedLetter || '–',
        matched: targetLetter === typedLetter,
      };
    });

    setGameComparison(comparison);

    if (normalizedGuess === target) {
      setAcertos((value) => value + 1);
      setGameAnalysis('✅ Pronúncia correta! A criança reproduziu a palavra-alvo sem trocas fonéticas. Nenhum processo fonológico identificado nesta rodada.');
      return;
    }

    if (currentAnimal.alts[normalizedGuess]) {
      setTrocas((value) => value + 1);
      setGameAnalysis(`⚠️ Processo fonológico identificado: ${currentAnimal.alts[normalizedGuess]}`);
      return;
    }

    setTrocas((value) => value + 1);
    const diff = [...normalizedGuess].filter((letter, index) => letter !== (target[index] || '')).length;
    setGameAnalysis(`⚠️ ${diff} diferença(s) detectada(s) entre a palavra-alvo "${target}" e o que foi dito "${normalizedGuess}". Possível troca ou omissão de fonemas.`);
  };

  const nextAnimal = () => {
    setGameAnimalIndex((previous) => (previous + 1) % animals.length);
    setGameResponse('');
    setGameAnalysis('');
    setGameComparison([]);
  };

  const answerRima = (answer) => {
    const isCorrect = answer === rimaPair.rima;
    if (isCorrect) {
      setRimaAcertos((value) => value + 1);
      setRimaFeedback(`✅ Resposta correta! ${rimaPair.w1} e ${rimaPair.w2} ${rimaPair.rima ? 'rimam' : 'não rimam'}.`);
    } else {
      setRimaErros((value) => value + 1);
      setRimaFeedback(`❌ Não foi dessa vez! ${rimaPair.w1} e ${rimaPair.w2} ${rimaPair.rima ? 'rimam' : 'não rimam'}.`);
    }

    window.setTimeout(() => {
      setRimaIndex((value) => (value + 1) % rimaPairs.length);
      setRimaFeedback('');
    }, 1800);
  };

  const toggleCheckItem = (index) => {
    setCheckListState((previous) => ({ ...previous, [index]: !previous[index] }));
  };

  const renderHomeScreen = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-serif text-3xl font-extrabold text-navy md:text-4xl">Selecione a faixa etária da criança</h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-muted">Cada jogo foi desenvolvido para o estágio de desenvolvimento fonológico da criança. Escolha abaixo para iniciar a triagem.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { id: 'form02', emoji: '👶', title: '0 – 2 anos', subtitle: 'Primeira Infância', game: '📋 Formulário de Marcos', desc: 'Respondido pelo responsável. Avalia marcos do desenvolvimento como balbucio, primeiras palavras e reação a sons.' },
          { id: 'game24', emoji: '🐄', title: '2 – 4 anos', subtitle: 'Pré-Escolar Inicial', game: '🎮 Jogo da Palavra', desc: 'Responsável digita o que a criança disse ao ver uma imagem. O sistema identifica trocas de fonemas automaticamente.' },
          { id: 'rima45', emoji: '🎵', title: '4 – 5 anos', subtitle: 'Pré-Escolar Avançado', game: '🎵 Jogo da Rima', desc: 'Avalia consciência fonológica — a criança identifica se duas palavras rimam, preditor de dislexia e dificuldades de leitura.' },
          { id: 'check6', emoji: '🏫', title: '6+ anos', subtitle: 'Ensino Fundamental I', game: '✅ Checklist do Professor', desc: 'Respondido pelo professor em sala. Identifica comportamentos de risco persistentes que merecem encaminhamento.' },
        ].map((card, index) => (
          <div key={card.id} className="relative overflow-hidden rounded-[20px] border border-line bg-white p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.13)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.16)]">
            <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: ['linear-gradient(90deg, #74b9ff, #0984e3)', 'linear-gradient(90deg, #fd79a8, #e84393)', 'linear-gradient(90deg, #55efc4, #00b894)', 'linear-gradient(90deg, #fdcb6e, #e17055)'][index] }} />
            <span className="mb-4 block text-5xl">{card.emoji}</span>
            <div className="font-serif text-2xl font-extrabold text-navy">{card.title}</div>
            <div className="mt-1 text-sm font-semibold text-muted">{card.subtitle}</div>
            <div className="mt-4 rounded-xl bg-surface px-3 py-2 text-xs font-bold text-ink">{card.game}</div>
            <div className="mt-4 text-sm leading-relaxed text-muted">{card.desc}</div>
            <button type="button" onClick={() => showScreen(card.id)} className="mt-5 rounded-full bg-navy px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-primary">Iniciar {index === 0 ? 'Triagem' : 'Jogo'} →</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFormScreen = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button type="button" onClick={goBack} className={buttonClass('tertiary')}><ArrowLeft size={16} aria-hidden="true" /> Voltar</button>
        <h2 className="font-serif text-2xl font-extrabold text-navy">Formulário de Marcos</h2>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">0 – 2 anos</span>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_8px_32px_rgba(0,0,0,0.13)]">
        <div className="bg-gradient-to-r from-sky-400 to-blue-600 p-7 text-white">
          <h3 className="font-serif text-2xl font-extrabold">📋 Questionário de Desenvolvimento da Linguagem</h3>
          <p className="mt-2 text-sm text-white/90">Responda com base no comportamento habitual da criança nas últimas semanas</p>
          <p className="mt-5 rounded-xl bg-white/15 p-4 text-sm">
            Questionário geral. Nenhum dado pessoal é solicitado ou armazenado nesta triagem.
          </p>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-xs font-bold text-muted">
              <span>Progresso do questionário</span>
              <span>{completedForms} / {formTotal} respondidas</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-600 transition-all duration-300" style={{ width: `${(completedForms / formTotal) * 100}%` }} />
            </div>
          </div>

          {formWarningVisible && (
            <div className="mb-4 rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm font-bold text-danger" role="alert">Responda todas as 6 perguntas antes de visualizar o resultado da triagem.</div>
          )}

          <div className="space-y-5">
            {formQuestions.map((item) => {
              const isSelected = formAnswers[item.id];
              return (
                <div key={item.id} className="rounded-xl border border-line bg-surface px-3 py-4">
                  <div className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-primary">Pergunta {String(item.id).padStart(2, '0')} · {item.category}</div>
                  <div className="mb-4 text-lg font-bold text-ink">{item.question}</div>
                  <div className="flex flex-wrap gap-3">
                    {item.options.map((option) => {
                      const selectedClass = option.value === 'sim' ? 'border-success bg-success/10 text-success' : option.value === 'parcial' ? 'border-warning bg-warning/10 text-warning' : 'border-danger bg-danger/10 text-danger';
                      return (
                        <button key={option.value} type="button" aria-pressed={isSelected === option.value} onClick={() => selectFormOption(item.id, option.value)} className={`rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition ${isSelected === option.value ? selectedClass : 'border-line bg-white text-ink hover:border-primary hover:text-primary'}`}>
                          {option.label}
                        </button>
                      );

                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
            <button type="button" onClick={() => setScreenStack(['home'])} className={buttonClass('tertiary')}><ArrowLeft size={16} aria-hidden="true" /> Cancelar</button>
            <button type="button" onClick={showFormResult} className={buttonClass('primary')}>Ver Resultado da Triagem <ArrowRight size={16} aria-hidden="true" /></button>
          </div>
        </div>
      </div>

      {formResultVisible && (
        <section aria-labelledby="triagem-marcos-resultado" className="mt-6 rounded-2xl border border-line bg-surface p-5 shadow-sm md:p-8">
          <h3 id="triagem-marcos-resultado" className="font-serif text-2xl font-bold text-navy">Respostas da triagem</h3>
          <p className="mt-2 text-sm text-muted">Este resumo registra as respostas informadas e não constitui diagnóstico ou avaliação clínica.</p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="bg-mist text-navy">
                <tr>
                  <th scope="col" className="px-4 py-3">Área observada</th>
                  <th scope="col" className="px-4 py-3">Resposta</th>
                </tr>
              </thead>
              <tbody>
                {formQuestions.map((item) => {
                  const response = item.options.find((option) => option.value === formAnswers[item.id]);
                  return (
                    <tr key={item.id} className="border-t border-line">
                      <th scope="row" className="px-4 py-3 font-semibold text-ink">{item.category}</th>
                      <td className="px-4 py-3 text-ink">{response?.label ?? 'Não respondida'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );

  const renderHistoryScreen = () => (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-bold text-navy">Histórico desta sessão</h2>
          <p className="mt-1 text-sm text-muted">Os resultados ficam disponíveis enquanto esta página estiver aberta.</p>
        </div>
        <button type="button" onClick={goBack} className={buttonClass('tertiary')}>
          <ArrowLeft size={16} aria-hidden="true" /> Voltar à triagem
        </button>
      </div>
      {historyRows.length ? (
        <DataTable caption="Resultados de triagem desta sessão" columns={historyColumns} rows={historyRows} />
      ) : (
        <p className="rounded-xl border border-line bg-surface p-5 text-sm text-muted">Nenhuma triagem foi concluída nesta sessão.</p>
      )}
    </section>
  );

  const renderGame24Screen = () => (

<div className="space-y-6">
      <div className="flex items-center gap-4">
        <button type="button" onClick={goBack} className={buttonClass('tertiary')}><ArrowLeft size={16} aria-hidden="true" /> Voltar</button>
        <h2 className="font-serif text-2xl font-extrabold text-navy">Jogo da Palavra</h2>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">2 – 4 anos</span>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_8px_32px_rgba(0,0,0,0.13)]">
        <div className="flex items-center gap-4 bg-gradient-to-r from-pink-400 to-pink-600 p-6 text-white">
          <div className="text-4xl">🎮</div>
          <div>
            <h3 className="font-serif text-2xl font-extrabold">Identificação de Trocas Fonéticas</h3>
            <p className="mt-1 text-sm text-white/90">Mostre a imagem para a criança, peça que diga o nome do animal e digite abaixo o que ela falou</p>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3 text-center">
            <div className="rounded-full bg-[#fff8e8] px-4 py-2 text-sm font-extrabold text-navy ring-2 ring-yellow-300">Rodada {gameAnimalIndex + 1}/4</div>
            <div className="rounded-full bg-surface px-4 py-2 text-sm font-extrabold text-navy">🎯 Trocas: {trocas}</div>
            <div className="rounded-full bg-surface px-4 py-2 text-sm font-extrabold text-navy">✅ Corretas: {acertos}</div>
          </div>

          <div className="mb-8 text-center">
            <div className="inline-block rounded-[24px] border-4 border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100 px-8 py-7 shadow-[0_8px_24px_rgba(253,203,110,0.3)]">
              <div className="text-7xl">{currentAnimal.emoji}</div>
              <div className="mt-3 font-serif text-4xl font-black tracking-[0.2em] text-navy">{currentAnimal.name}</div>
              <div className="mt-2 text-lg font-semibold text-muted">{currentAnimal.phonemes}</div>
            </div>
          </div>

          <div className="mb-8 rounded-2xl border-2 border-sky-200 bg-sky-50 p-4 text-center text-base font-bold text-sky-700">👆 Aponte para o animal e pergunte à criança: <strong>"O que é isso?"</strong><br />Digite abaixo exatamente como ela disse:</div>

          <div className="mb-5">
            <label htmlFor="fns-child-word" className="mb-2 block text-base font-extrabold text-ink">O que a criança disse:</label>
            <input id="fns-child-word" type="text" value={gameResponse} onChange={(event) => {
              setGameResponse(event.target.value.toLowerCase());
              evaluateWordGuess(event.target.value);
            }} className="w-full rounded-2xl border-4 border-line bg-white px-5 py-4 text-xl font-bold text-ink outline-none transition focus:border-pink-400" placeholder="ex: faca, baca, vaka..." style={{ textTransform: 'lowercase' }} />
          </div>

          {gameComparison.length > 0 && (
            <div className="rounded-2xl border-2 border-yellow-200 bg-yellow-50 p-5">
              <div className="mb-3 text-sm font-extrabold uppercase tracking-[0.12em] text-slate-600">Análise fonema a fonema:</div>
              <div className="mb-4 flex flex-wrap gap-3">
                {gameComparison.map((item, index) => (
                  <span key={`${item.char}-${index}`} className={`rounded-xl px-3 py-2 text-2xl font-black ${item.matched ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300' : 'bg-red-100 text-red-800 border-2 border-red-300'}`}>
                    {item.char}
                  </span>
                ))}
              </div>
              <div className="rounded-xl border border-yellow-200 bg-yellow-100 p-4 text-sm font-semibold leading-6 text-amber-900">{gameAnalysis}</div>
              <div className="mt-5 flex justify-end"><button type="button" onClick={nextAnimal} className={buttonClass('primary')}>Próximo animal <ArrowRight size={16} aria-hidden="true" /></button></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderRimaScreen = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button type="button" onClick={goBack} className={buttonClass('tertiary')}><ArrowLeft size={16} aria-hidden="true" /> Voltar</button>
        <h2 className="font-serif text-2xl font-extrabold text-navy">Jogo da Rima</h2>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">4 – 5 anos</span>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_8px_32px_rgba(0,0,0,0.13)]">
        <div className="flex items-center gap-4 bg-gradient-to-r from-emerald-400 to-teal-500 p-6 text-white">
          <div className="text-4xl">🎵</div>
          <div>
            <h3 className="font-serif text-2xl font-extrabold">Consciência Fonológica</h3>
            <p className="mt-1 text-sm text-white/90">Mostre as imagens para a criança e pergunte: "essas duas palavras rimam?"</p>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            <div className="rounded-full bg-[#fff8e8] px-4 py-2 text-sm font-extrabold text-navy ring-2 ring-emerald-300">Par {rimaIndex + 1}/{rimaPairs.length}</div>
            <div className="rounded-full bg-surface px-4 py-2 text-sm font-extrabold text-navy">✅ Acertos: {rimaAcertos}</div>
            <div className="rounded-full bg-surface px-4 py-2 text-sm font-extrabold text-navy">❌ Erros: {rimaErros}</div>
          </div>

          <div className="mb-8 flex flex-wrap items-center justify-center gap-5">
            <div className="min-w-[160px] flex-1 rounded-[20px] border-2 border-line bg-white p-6 text-center shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
              <span className="mb-3 block text-6xl">{rimaPair.e1}</span>
              <div className="font-serif text-3xl font-extrabold text-navy">{rimaPair.w1}</div>
            </div>
            <div className="text-3xl font-black text-muted">VS</div>
            <div className="min-w-[160px] flex-1 rounded-[20px] border-2 border-line bg-white p-6 text-center shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
              <span className="mb-3 block text-6xl">{rimaPair.e2}</span>
              <div className="font-serif text-3xl font-extrabold text-navy">{rimaPair.w2}</div>
            </div>
          </div>

          <div className="mb-6 text-center">
            <p className="text-2xl font-bold text-ink">🎤 Pergunte à criança: <strong>"{rimaPair.w1} e {rimaPair.w2} rimam?"</strong></p>
            <div className="mt-5 flex flex-wrap justify-center gap-4">
              <button type="button" onClick={() => answerRima(true)} className="rounded-2xl bg-green-500 px-8 py-4 text-lg font-extrabold text-white shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:scale-[1.03] transition">👍 SIM, rimam!</button>
              <button type="button" onClick={() => answerRima(false)} className="rounded-2xl bg-orange-500 px-8 py-4 text-lg font-extrabold text-white shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:scale-[1.03] transition">👎 NÃO rimam</button>
            </div>
          </div>

          {rimaFeedback && (
            <div className="rounded-2xl border-2 bg-[#f0fdf4] p-5 text-center text-lg font-bold text-green-700">{rimaFeedback}</div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCheckScreen = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button type="button" onClick={goBack} className={buttonClass('tertiary')}><ArrowLeft size={16} aria-hidden="true" /> Voltar</button>
        <h2 className="font-serif text-2xl font-extrabold text-navy">Checklist do Professor</h2>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">6+ anos</span>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_8px_32px_rgba(0,0,0,0.13)]">
        <div className="flex items-center gap-4 bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-white">
          <div className="text-4xl">✅</div>
          <div>
            <h3 className="font-serif text-2xl font-extrabold">Triagem em Sala de Aula</h3>
            <p className="mt-1 text-sm text-white/90">Marque os comportamentos observados regularmente na criança nas últimas 3 semanas</p>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-4">
            {checklistItems.map((item, index) => {
              const isChecked = !!checkListState[index];
              return (
                <button key={index} type="button" onClick={() => toggleCheckItem(index)} className={`flex w-full items-start gap-4 rounded-2xl border-2 p-4 text-left transition ${isChecked ? 'border-yellow-300 bg-yellow-50' : 'border-line bg-surface hover:border-yellow-300'}`}>
                  <div className={`mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg border-2 ${isChecked ? 'border-orange-500 bg-yellow-300 text-orange-900' : 'border-line bg-white text-transparent'}`}>{isChecked ? '✓' : ''}</div>
                  <div>
                    <div className="text-base font-bold text-ink">{item}</div>
                    <div className="mt-1 text-sm text-muted">{index === 0 ? 'Vergonha, recusa a ler em voz alta, não responde quando chamada' : index === 1 ? 'Ex: "cacholo" por "cachorro", "telefone" por "telefone"' : index === 2 ? 'Atividades de consciência fonológica claramente abaixo dos colegas' : index === 3 ? 'Repetição de sílabas, prolongamentos, bloqueios ao falar' : index === 4 ? 'Precisa de repetição constante, perde o fio da explicação oral' : 'Dificuldade persistente em relacionar letra com som'}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <button type="button" onClick={() => setCheckResultVisible(true)} className={`${buttonClass('primary')} mt-6 w-full`}>Ver Análise da Triagem <ArrowRight size={16} aria-hidden="true" /></button>

          {checkResultVisible && (
            <div className="mt-6 rounded-2xl border-2 border-yellow-200 bg-yellow-50 p-5">
              <div className="mb-2 text-lg font-extrabold text-orange-600">{Object.values(checkListState).filter(Boolean).length} de {checklistItems.length} indicadores marcados</div>
              <p className="text-base leading-7 text-muted">{Object.values(checkListState).filter(Boolean).length <= 1 ? '✅ Perfil dentro do esperado. Nenhum encaminhamento necessário no momento. Reavaliar em 30 dias.' : Object.values(checkListState).filter(Boolean).length <= 3 ? '⚠️ Atenção recomendada. Alguns comportamentos persistentes foram identificados. Sugere-se comunicar a família e monitorar por mais 2 semanas. Se mantiver, encaminhar para triagem fonoaudiológica.' : '🚨 Múltiplos indicadores de risco identificados. Recomenda-se encaminhamento para avaliação fonoaudiológica com urgência. Informar a coordenação pedagógica e a família.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-line bg-canvas font-sans text-ink shadow-xl">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-band px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 text-2xl">🎙️</div>
          <div>
            <div className="font-serif text-2xl font-extrabold leading-none">FonoSync</div>
            <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/80">Triagem Fonoaudiológica Precoce</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setShowA11y(true)} className="flex min-h-11 items-center gap-2 rounded-md border border-white/30 px-3 text-xs font-bold text-white hover:bg-white/10">
            <span aria-hidden="true">♿</span> Acessibilidade
          </button>
          <button type="button" onClick={() => (isPlayerOpen ? stopSpeaking() : speakPageContent())} className="flex min-h-11 items-center gap-2 rounded-md border border-white/30 px-3 text-xs font-bold text-white hover:bg-white/10">
            <Volume2 size={16} aria-hidden="true" /> {isPlayerOpen ? 'Parar leitura' : 'Ouvir página'}
          </button>
        </div>
      </header>

      <nav className="flex gap-1 overflow-x-auto border-b-2 border-line bg-white px-6" aria-label="Navegação por faixa etária">
        {[
          { id: 'home', title: 'Início', badge: null },
          { id: 'form02', title: 'Formulário', badge: '0–2 anos' },
          { id: 'game24', title: 'Jogo Fonético', badge: '2–4 anos' },
          { id: 'rima45', title: 'Jogo da Rima', badge: '4–5 anos' },
          { id: 'check6', title: 'Checklist', badge: '6+ anos' },
        ].map((tab) => (
          <button key={tab.id} type="button" onClick={() => showScreen(tab.id)} className={`flex items-center gap-2 whitespace-nowrap border-b-[3px] px-5 py-4 text-sm font-extrabold transition ${activeScreen === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-navy'}`}>
            <span>{tab.id === 'home' ? '🏠' : tab.id === 'form02' ? '📋' : tab.id === 'game24' ? '🎮' : tab.id === 'rima45' ? '🎵' : '✅'}</span>
            {tab.title}
            {tab.badge && <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${activeScreen === tab.id ? 'bg-primary text-white' : 'bg-surface text-muted'}`}>{tab.badge}</span>}
          </button>
        ))}
      </nav>

      <main className="bg-canvas p-4 md:p-8">
        {activeScreen === 'home' && renderHomeScreen()}
        {activeScreen === 'form02' && renderFormScreen()}
        {activeScreen === 'history' && renderHistoryScreen()}
        {activeScreen === 'game24' && renderGame24Screen()}
        {activeScreen === 'rima45' && renderRimaScreen()}
        {activeScreen === 'check6' && renderCheckScreen()}

        {activeScreen === 'execution' && (
          <div className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-line bg-white p-6">
            <StepProgress value={((wordIndex + 1) / total) * 100} />
            <div>
              <h1 className="mb-1 font-serif text-2xl text-navy">Peça para a criança nomear o desenho.</h1>
              <p className="text-sm text-muted">Você pode ouvir a instrução e registrar se a palavra foi produzida espontaneamente ou com ajuda.</p>
            </div>
            <div className="flex flex-col items-center justify-center border border-line bg-mist px-6 py-12 text-center">
              <div className="mb-4 flex size-24 items-center justify-center rounded-full bg-surface shadow-sm"><span className="text-5xl" aria-hidden="true">{currentWord.emoji}</span></div>
              <span className="text-xs text-muted">Ilustração simples de {currentWord.article} {currentWord.word}</span>
              <button type="button" onClick={() => speakText(currentWord.word)} className={`${buttonClass('tertiary')} mt-3`}><Volume2 size={16} aria-hidden="true" /> Ouvir pronúncia esperada</button>
            </div>
            <div role="group" aria-label="Como a criança respondeu" className="flex flex-wrap gap-3">
              {responses.map((response) => {
                const isSelected = currentAnswer === response.id;
                return (
                  <button key={response.id} type="button" aria-pressed={isSelected} onClick={() => answer(response.id)} className={buttonClass(isSelected ? 'primary' : 'secondary')}>
                    {isSelected && <CheckCircle2 size={16} aria-hidden="true" />}
                    {response.label}
                  </button>
                );
              })}
            </div>
            <Notice tone="info" title="Registro clínico">Palavra-alvo: <em>{currentWord.word}</em>. Observe nomeação, simplificações e inteligibilidade.</Notice>
            <div className="flex items-center justify-between gap-3 pt-4">
              <button type="button" onClick={() => setWordIndex((value) => Math.max(0, value - 1))} disabled={wordIndex === 0} className={buttonClass('tertiary')}><ArrowLeft size={16} aria-hidden="true" /> Anterior</button>
              <button type="button" onClick={goNext} disabled={!currentAnswer} className={buttonClass('primary')}>{wordIndex < total - 1 ? 'Próxima palavra' : 'Finalizar triagem'} <ArrowRight size={16} aria-hidden="true" /></button>
            </div>
          </div>
        )}

        {activeScreen === 'result' && result && (
          <div className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-line bg-white p-6">
            <div className={`flex items-start justify-between gap-4 border-l-4 p-6 ${riskTone.box}`}>
              <div>
                <span className={`mb-1 block text-xs font-bold uppercase tracking-wider ${riskTone.text}`}>Resultado da triagem</span>
                <h1 className="font-serif text-3xl text-navy">{result.risk.label}</h1>
                <p className="mt-1 text-sm text-muted">{result.risk.text}</p>
              </div>
              <riskTone.icon size={32} className={`shrink-0 ${riskTone.text}`} aria-hidden="true" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ResultBar label="Nomeação espontânea" caption={`${result.spontaneous} de ${total} palavras`} value={result.spontaneousPct} />
              <ResultBar label="Nomeação com ou sem ajuda" caption={`${result.spontaneous + result.assisted} de ${total} palavras`} value={result.helpedPct} />
            </div>

            <div className="space-y-3">
              <Notice tone={result.risk.tone} title="Recomendação">{result.risk.advice}</Notice>
              <Notice tone="info" title="Importante">Esta triagem não substitui avaliação profissional e não produz diagnóstico.</Notice>
            </div>

            <div role="status">
              {downloaded && (
                <Notice tone="success" title="Arquivo gerado">O resultado foi salvo em texto simples (resultado-triagem-fonosync.txt), que leitores de tela leem sem dificuldade.</Notice>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <a href="#/acesso" className={buttonClass('primary')}><Search size={16} aria-hidden="true" /> Encontrar profissional</a>
              <button type="button" onClick={downloadResult} className={buttonClass('secondary')}><Download size={16} aria-hidden="true" /> Baixar resultado acessível</button>
              <button type="button" onClick={() => showScreen('history')} className={buttonClass('tertiary')}><History size={16} aria-hidden="true" /> Ver histórico</button>
              <button type="button" onClick={() => setScreenStack(['home'])} className={`${buttonClass('tertiary')} ml-auto`}>Refazer triagem</button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-band px-4 py-4 text-center text-xs font-semibold text-white/80">
        <strong className="text-white">FonoSync</strong> — Triagem fonoaudiológica. Não substitui avaliação clínica profissional.
      </footer>

      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />
    </div>
  );
}
