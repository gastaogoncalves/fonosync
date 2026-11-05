import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  AudioWaveform,
  CheckCircle2,
  ClipboardList,
  Download,
  History,
  Info,
  MessageSquare,
  School,
  Search,
  TriangleAlert,
  Volume2,
} from 'lucide-react';
import A11yModal from './A11yModal';
import DataTable from './DataTable';
import Notice from './Notice';
import StatusBadge from './StatusBadge';
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

// faixas provisórias, falta o critério clínico
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

const stepLabels = {
  selection: 'Escolha uma modalidade',
  identification: 'Etapa 1 de 4 · Identificação',
  history: 'Histórico',
  result: 'Resultado · Concluído',
};

function summarize(answers) {
  const total = answers.length;
  const spontaneous = answers.filter((answer) => answer === 'espontanea').length;
  const assisted = answers.filter((answer) => answer === 'ajuda').length;
  const spontaneousPct = Math.round((spontaneous / total) * 100);
  const helpedPct = Math.round(((spontaneous + assisted) / total) * 100);
  const risk = RISK_LEVELS.find((level) => spontaneousPct >= level.min);
  return { spontaneous, assisted, spontaneousPct, helpedPct, risk };
}

function StepProgress({ value }) {
  return (
    <div
      role="progressbar"
      aria-label="Progresso da triagem"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="h-1.5 w-full bg-line"
    >
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
  const [stepScreen, setStepScreen] = useState('selection');
  const [selectedAge, setSelectedAge] = useState('2-4');
  const [wordIndex, setWordIndex] = useState(0);
  const [answers, setAnswers] = useState(() => Array(words.length).fill(null));
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [downloaded, setDownloaded] = useState(false);
  const [showA11y, setShowA11y] = useState(false);
  const { isPlaying, speakPageContent, stopSpeaking, speakText } = useA11y();

  const total = words.length;
  const currentWord = words[wordIndex];
  const currentAnswer = answers[wordIndex];
  const modality = modalities.find((item) => item.id === selectedAge) ?? modalities[1];
  const stepLabel = stepScreen === 'execution' ? `Etapa 3 de 4 · ${wordIndex + 1} de ${total} palavras` : stepLabels[stepScreen];

  const startExecution = () => {
    setAnswers(Array(total).fill(null));
    setWordIndex(0);
    setStepScreen('execution');
  };

  const answer = (id) => setAnswers((list) => list.map((value, index) => (index === wordIndex ? id : value)));

  const goNext = () => {
    if (wordIndex < total - 1) {
      setWordIndex(wordIndex + 1);
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
    setStepScreen('result');
  };

  const downloadResult = () => {
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

  const tone = result ? toneStyles[result.risk.tone] : null;

  return (
    <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-line bg-canvas font-sans text-ink shadow-xl">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-surface px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-on-primary">
            <AudioWaveform size={16} aria-hidden="true" />
          </div>
          <span className="font-serif text-lg font-bold text-navy">FonoSync</span>
          <div className="hidden h-4 w-px bg-line sm:block" />
          <span aria-live="polite" className="text-xs font-medium text-muted">
            <span className="font-bold uppercase">Triagem FonoSync</span> · {stepLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowA11y(true)}
            className="min-h-11 rounded-md border border-navy px-3 text-xs font-bold text-navy hover:bg-mist"
          >
            Acessibilidade
          </button>
          <button
            type="button"
            onClick={() => (isPlaying ? stopSpeaking() : speakPageContent())}
            className={`min-h-11 rounded-md border px-3 text-xs font-bold ${
              isPlaying ? 'border-danger bg-danger text-on-primary' : 'border-transparent text-navy hover:bg-mist'
            }`}
          >
            {isPlaying ? 'Parar leitura' : 'Ouvir página'}
          </button>
        </div>
      </header>

      <main className="bg-surface p-6 md:p-10">
        {stepScreen === 'selection' && (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h1 className="font-serif text-2xl text-navy md:text-3xl">Jogos e triagens por faixa etária</h1>
                <p className="mt-1 max-w-2xl text-sm text-muted">
                  Escolha a modalidade indicada para a idade. A experiência combina acolhimento, instruções claras e leitura clínica dos resultados.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStepScreen('history')}
                className={`${buttonClass('secondary')} shrink-0 self-start md:self-auto`}
              >
                <History size={16} aria-hidden="true" /> Ver histórico ({history.length})
              </button>
            </div>

            <div className="grid gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-4">
              {modalities.map((item) => {
                const Icon = item.icon;
                const isActive = selectedAge === item.id;
                return (
                  <div
                    key={item.id}
                    className={`flex flex-col justify-between gap-6 rounded-md border-2 p-5 transition-colors ${
                      isActive ? 'border-primary bg-mist' : 'border-line bg-surface hover:border-primary'
                    }`}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div className="rounded-md border border-line bg-surface p-2.5 text-primary">
                          <Icon size={20} aria-hidden="true" />
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-sm border border-primary bg-surface px-2 py-0.5 text-[11px] font-bold text-primary">
                          <Info size={12} aria-hidden="true" /> {item.age}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg text-navy">{item.title}</h3>
                      <p className="text-xs leading-relaxed text-muted">{item.desc}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAge(item.id);
                        setStepScreen('identification');
                      }}
                      className={`${buttonClass(isActive ? 'primary' : 'secondary')} self-start`}
                    >
                      <ArrowRight size={16} aria-hidden="true" /> Iniciar modalidade
                    </button>
                  </div>
                );
              })}
            </div>

            <Notice tone="warning" title="Triagem não é diagnóstico">
              O resultado indica sinais de risco e próximos passos. Não substitui avaliação fonoaudiológica profissional.
            </Notice>
          </div>
        )}

        {stepScreen === 'history' && (
          <div className="space-y-6">
            <div>
              <h1 className="mb-1 font-serif text-2xl text-navy md:text-3xl">Histórico de triagens</h1>
              <p className="text-sm text-muted">Triagens concluídas nesta sessão. O histórico some ao recarregar a página.</p>
            </div>
            <DataTable
              caption="Histórico de triagens"
              columns={historyColumns}
              rows={historyRows}
              emptyMessage="Nenhuma triagem concluída nesta sessão."
            />
            <button type="button" onClick={() => setStepScreen('selection')} className={buttonClass('secondary')}>
              <ArrowLeft size={16} aria-hidden="true" /> Voltar
            </button>
          </div>
        )}

        {stepScreen === 'identification' && (
          <div className="max-w-3xl space-y-6">
            <StepProgress value={25} />

            <div>
              <h1 className="mb-1 font-serif text-2xl text-navy md:text-3xl">Qual é a faixa etária?</h1>
              <p className="text-sm text-muted">Isso define a modalidade e adapta linguagem, tempo e critérios clínicos.</p>
            </div>

            <div className="grid gap-4 pt-2 sm:grid-cols-2">
              {modalities.map((item) => {
                const isSelected = selectedAge === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedAge(item.id)}
                    className={`flex min-h-28 flex-col items-start gap-1 rounded-md border-2 p-5 text-left transition-colors ${
                      isSelected ? 'border-primary bg-mist' : 'border-line bg-surface hover:border-muted'
                    }`}
                  >
                    <span className="text-sm font-bold text-navy">{item.age}</span>
                    <span className="mb-2 text-xs text-muted">{item.title}</span>
                    {isSelected && <StatusBadge tone="success">Selecionado</StatusBadge>}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-line pt-6">
              <button type="button" onClick={() => setStepScreen('selection')} className={buttonClass('tertiary')}>
                Voltar
              </button>
              <button type="button" onClick={startExecution} className={buttonClass('primary')}>
                <ArrowRight size={16} aria-hidden="true" /> Continuar
              </button>
            </div>
          </div>
        )}

        {stepScreen === 'execution' && (
          <div className="mx-auto max-w-3xl space-y-6">
            <StepProgress value={((wordIndex + 1) / total) * 100} />

            <div>
              <h1 className="mb-1 font-serif text-2xl text-navy">Peça para a criança nomear o desenho.</h1>
              <p className="text-sm text-muted">
                Você pode ouvir a instrução e registrar se a palavra foi produzida espontaneamente ou com ajuda.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center border border-line bg-mist px-6 py-12 text-center">
              <div className="mb-4 flex size-24 items-center justify-center rounded-full bg-surface shadow-sm">
                <span className="text-5xl" aria-hidden="true">{currentWord.emoji}</span>
              </div>
              <span className="text-xs text-muted">
                Ilustração simples de {currentWord.article} {currentWord.word}
              </span>
              <button type="button" onClick={() => speakText(currentWord.word)} className={`${buttonClass('tertiary')} mt-3`}>
                <Volume2 size={16} aria-hidden="true" /> Ouvir pronúncia esperada
              </button>
            </div>

            <div role="group" aria-label="Como a criança respondeu" className="flex flex-wrap gap-3">
              {responses.map((response) => {
                const isSelected = currentAnswer === response.id;
                return (
                  <button
                    key={response.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => answer(response.id)}
                    className={buttonClass(isSelected ? 'primary' : 'secondary')}
                  >
                    {isSelected && <CheckCircle2 size={16} aria-hidden="true" />}
                    {response.label}
                  </button>
                );
              })}
            </div>

            <Notice tone="info" title="Registro clínico">
              Palavra-alvo: <em>{currentWord.word}</em>. Observe nomeação, simplificações e inteligibilidade.
            </Notice>

            <div className="flex items-center justify-between gap-3 pt-4">
              <button
                type="button"
                onClick={() => setWordIndex(wordIndex - 1)}
                disabled={wordIndex === 0}
                className={buttonClass('tertiary')}
              >
                <ArrowLeft size={16} aria-hidden="true" /> Anterior
              </button>
              <button type="button" onClick={goNext} disabled={!currentAnswer} className={buttonClass('primary')}>
                {wordIndex < total - 1 ? 'Próxima palavra' : 'Finalizar triagem'} <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {stepScreen === 'result' && result && (
          <div className="mx-auto max-w-3xl space-y-6">
            <div className={`flex items-start justify-between gap-4 border-l-4 p-6 ${tone.box}`}>
              <div>
                <span className={`mb-1 block text-xs font-bold uppercase tracking-wider ${tone.text}`}>Resultado da triagem</span>
                <h1 className="font-serif text-3xl text-navy">{result.risk.label}</h1>
                <p className="mt-1 text-sm text-muted">{result.risk.text}</p>
              </div>
              <tone.icon size={32} className={`shrink-0 ${tone.text}`} aria-hidden="true" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ResultBar label="Nomeação espontânea" caption={`${result.spontaneous} de ${total} palavras`} value={result.spontaneousPct} />
              <ResultBar
                label="Nomeação com ou sem ajuda"
                caption={`${result.spontaneous + result.assisted} de ${total} palavras`}
                value={result.helpedPct}
              />
            </div>

            <div className="space-y-3">
              <Notice tone={result.risk.tone} title="Recomendação">
                {result.risk.advice}
              </Notice>
              <Notice tone="info" title="Importante">
                Esta triagem não substitui avaliação profissional e não produz diagnóstico.
              </Notice>
            </div>

            <div role="status">
              {downloaded && (
                <Notice tone="success" title="Arquivo gerado">
                  O resultado foi salvo em texto simples (resultado-triagem-fonosync.txt), que leitores de tela leem sem dificuldade.
                </Notice>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <a href="#/acesso" className={buttonClass('primary')}>
                <Search size={16} aria-hidden="true" /> Encontrar profissional
              </a>
              <button type="button" onClick={downloadResult} className={buttonClass('secondary')}>
                <Download size={16} aria-hidden="true" /> Baixar resultado acessível
              </button>
              <button type="button" onClick={() => setStepScreen('history')} className={buttonClass('tertiary')}>
                <History size={16} aria-hidden="true" /> Ver histórico
              </button>
              <button type="button" onClick={() => setStepScreen('selection')} className={`${buttonClass('tertiary')} ml-auto`}>
                Refazer triagem
              </button>
            </div>
          </div>
        )}
      </main>

      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />
    </div>
  );
}