import { CircleCheck } from 'lucide-react';

// Alturas (px) das barras da onda, na ordem do Figma.
// Em "warning" fica o trecho em que a análise encontrou dificuldade.
const waveform = [
  { height: 18, tone: 'primary' },
  { height: 36, tone: 'primary' },
  { height: 54, tone: 'primary' },
  { height: 28, tone: 'primary' },
  { height: 44, tone: 'primary' },
  { height: 62, tone: 'primary' },
  { height: 34, tone: 'primary' },
  { height: 50, tone: 'primary' },
  { height: 22, tone: 'warning' },
  { height: 42, tone: 'warning' },
  { height: 58, tone: 'warning' },
  { height: 30, tone: 'warning' },
  { height: 48, tone: 'primary' },
  { height: 25, tone: 'primary' },
  { height: 38, tone: 'primary' },
  { height: 52, tone: 'primary' },
  { height: 20, tone: 'primary' },
];

const scores = [
  { phoneme: '/r/', value: 64 },
  { phoneme: '/s/', value: 88 },
  { phoneme: '/l/', value: 92 },
];

export default function PhoneticCard() {
  return (
    <div className="flex items-center justify-center border border-line bg-mist px-10 py-12">
      <div className="flex w-full max-w-120 flex-col gap-3.5 rounded-[10px] border border-muted/50 bg-white p-5.5">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-navy">Análise fonética inteligente</p>
          <span className="flex items-center gap-1.5 rounded-sm border border-success bg-success/10 px-2.5 py-1 text-sm font-bold text-success">
            <CircleCheck size={14} aria-hidden="true" />
            IA + validação
          </span>
        </div>

        {/* A onda é decorativa: o leitor de tela pula direto para as notas */}
        <div className="flex h-16 items-center gap-1" aria-hidden="true">
          {waveform.map((bar, index) => (
            <span
              key={index}
              className={`flex-1 rounded-full ${bar.tone === 'warning' ? 'bg-warning' : 'bg-primary'}`}
              style={{ height: bar.height }}
            />
          ))}
        </div>

        <dl className="flex gap-3">
          {scores.map((score) => (
            <div key={score.phoneme} className="flex flex-1 flex-col gap-1 bg-mist/50 p-2.5">
              <dt className="text-sm text-muted">{score.phoneme}</dt>
              <dd className="text-xl font-bold text-navy">{score.value}%</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
