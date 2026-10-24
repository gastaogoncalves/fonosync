import { CircleCheck, Info, TriangleAlert } from 'lucide-react';

const tones = {
  success: { icon: CircleCheck, style: 'border-success bg-success/10 text-success' },
  warning: { icon: TriangleAlert, style: 'border-warning bg-warning/10 text-warning' },
  info: { icon: Info, style: 'border-primary bg-primary/10 text-primary' },
};

export default function StatusBadge({ tone = 'info', children }) {
  const { icon: Icon, style } = tones[tone] ?? tones.info;

  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-sm font-bold ${style}`}>
      <Icon size={14} aria-hidden="true" />
      {children}
    </span>
  );
}
