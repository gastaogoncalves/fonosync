import { Gamepad2, MonitorCheck, ShieldCheck } from 'lucide-react';

const stats = [
  { icon: Gamepad2, title: '4+ jogos', text: 'Avaliar e tratar' },
  { icon: MonitorCheck, title: '100% digital e seguro', text: 'Do cadastro ao relatório' },
  { icon: ShieldCheck, title: 'LGPD', text: 'Privacidade por princípio' },
];

export default function StatsStrip() {
  return (
    <section className="bg-band text-white">
      <ul className="mx-auto flex max-w-360 flex-col gap-4 px-18 py-6 md:flex-row">
        {stats.map((stat) => (
          <li key={stat.title} className="flex min-h-16 flex-1 items-center gap-3">
            <stat.icon size={24} className="shrink-0 text-accent" aria-hidden="true" />
            <div className="flex flex-col gap-0.75">
              <span className="text-lg">{stat.title}</span>
              <span className="text-sm text-on-band-muted">{stat.text}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
