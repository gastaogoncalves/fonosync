import { Activity, CalendarCheck, Target } from 'lucide-react';
import MetricCard from '../../components/MetricCard';
import Notice from '../../components/Notice';
import Panel from '../../components/Panel';
import ProgressBar from '../../components/ProgressBar';

const metrics = [
  { icon: Activity, label: 'Fluência atual', value: '72%', note: '+8 pontos' },
  { icon: Target, label: 'Metas ativas', value: 3, note: '1 próxima de concluir' },
  { icon: CalendarCheck, label: 'Frequência', value: '92%', note: 'Últimas 12 semanas' },
];

const evolution = [
  { label: 'Fluência', value: 72 },
  { label: 'Precisão /r/', value: 64 },
  { label: 'Generalização', value: 58 },
];

const goals = [
  { name: 'Fluência em leitura', current: 72, target: 80 },
  { name: '/r/ medial', current: 64, target: 75 },
  { name: 'Fala espontânea', current: 58, target: 70 },
];

export default function Tracking() {
  return (
    <>
      <div className="flex gap-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="flex items-start gap-4">
        <Panel
          title="Evolução clínica"
          className="flex-1"
          aside={<span className="text-sm text-muted">Comparativo 90 dias</span>}
        >
          {evolution.map((item) => (
            <ProgressBar key={item.label} label={item.label} value={item.value} />
          ))}
          <Notice tone="success" title="Comparativo">
            Melhora global de 12% em relação ao período anterior.
          </Notice>
        </Panel>

        <Panel title="Metas terapêuticas" className="w-90 shrink-0">
          <ul className="flex flex-col gap-3.5">
            {goals.map((goal) => (
              <li key={goal.name} className="flex flex-col gap-1.5">
                <span className="text-sm font-bold text-ink">{goal.name}</span>
                <span className="text-sm text-muted">
                  {goal.current}% atual · meta {goal.target}%
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
