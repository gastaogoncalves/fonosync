// altura de cada barra da onda (px)
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
  { label: 'Precisão fonética', value: 84 },
  { label: 'Engajamento', value: 96 },
  { label: 'Adesão ao plano', value: 93 },
];

export default function PhoneticCard() {
  return (
    <div className="flex items-center justify-center border border-line bg-mist px-10 py-12">
      <div className="flex w-full max-w-120 flex-col gap-3.5 rounded-[10px] border border-muted/50 bg-surface p-5.5">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-navy">Análise fonética inteligente</p>
          <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-sm text-success">
            <span className="size-2 rounded-full bg-success" aria-hidden="true" />
            Ao vivo
          </span>
        </div>

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
            <div key={score.label} className="flex flex-1 flex-col-reverse gap-1 bg-mist/50 p-2.5">
              <dt className="text-sm text-muted">{score.label}</dt>
              <dd className="font-serif text-3xl text-navy">{score.value}%</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
