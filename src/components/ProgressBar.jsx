export default function ProgressBar({ label, value, tone = 'primary' }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex justify-between gap-4 text-sm">
        <span className="text-ink">{label}</span>
        <span className="font-bold text-navy">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-line" aria-hidden="true">
        <div
          className={`h-2 rounded-full ${tone === 'warning' ? 'bg-warning' : 'bg-primary'}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
