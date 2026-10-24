import Notice from './Notice';
import ProgressBar from './ProgressBar';

export default function ProgressCard({ eyebrow, items, note }) {
  return (
    <div className="flex min-h-55 flex-col gap-3.5 border border-line bg-mist p-6">
      <p className="text-sm font-bold text-primary uppercase">{eyebrow}</p>

      {items.map((item) => (
        <ProgressBar key={item.label} label={item.label} value={item.value} tone={note.tone} />
      ))}

      <Notice tone={note.tone} title={note.title}>
        {note.text}
      </Notice>
    </div>
  );
}
