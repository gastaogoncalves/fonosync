import { ArrowRight } from 'lucide-react';
import Button from './Button';
import ProgressCard from './ProgressCard';

export default function FeatureRow({ icon: Icon, title, description, progress, reverse = false }) {
  return (
    <div className="grid items-center gap-12 md:grid-cols-2">
      <div className={`flex flex-col items-start gap-3 ${reverse ? 'md:order-2' : ''}`}>
        <Icon size={28} className="text-navy" aria-hidden="true" />
        <h3 className="text-[32px] leading-tight text-navy">{title}</h3>
        <p className="text-sm leading-relaxed text-muted">{description}</p>
        <Button variant="tertiary">
          <ArrowRight size={17} aria-hidden="true" />
          Saiba mais
        </Button>
      </div>

      <div className={reverse ? 'md:order-1' : ''}>
        <ProgressCard eyebrow={progress.eyebrow} items={progress.items} note={progress.note} />
      </div>
    </div>
  );
}
