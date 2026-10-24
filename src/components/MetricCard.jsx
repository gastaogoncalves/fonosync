export default function MetricCard({ icon: Icon, label, value, note }) {
  return (
    <div className="flex flex-1 flex-col gap-2.5 rounded-md border border-line bg-surface p-4">
      <div className="flex items-center gap-2 text-sm text-muted">
        <Icon size={18} className="shrink-0 text-primary" aria-hidden="true" />
        {label}
      </div>
      <p className="text-[28px] leading-none text-navy">{value}</p>
      <p className="text-sm text-success">{note}</p>
    </div>
  );
}
