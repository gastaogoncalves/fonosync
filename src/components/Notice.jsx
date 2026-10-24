import { CircleCheck, Info, TriangleAlert } from 'lucide-react';

const tones = {
  success: { icon: CircleCheck, box: 'border-success bg-success/10', iconColor: 'text-success' },
  warning: { icon: TriangleAlert, box: 'border-warning bg-warning/10', iconColor: 'text-warning' },
  info: { icon: Info, box: 'border-primary bg-primary/10', iconColor: 'text-primary' },
};

export default function Notice({ tone = 'success', title, children }) {
  const style = tones[tone] ?? tones.success;
  const Icon = style.icon;

  return (
    <div className={`flex w-full gap-3 border-l-4 p-3.5 ${style.box}`}>
      <Icon size={20} className={`shrink-0 ${style.iconColor}`} aria-hidden="true" />
      <div className="flex flex-col gap-1 text-sm">
        <p className="text-ink">{title}</p>
        {children && <p className="text-muted">{children}</p>}
      </div>
    </div>
  );
}
