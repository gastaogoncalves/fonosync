import { AudioLines, CalendarDays, ClipboardClock, Users } from 'lucide-react';
import DataTable from '../../components/DataTable';
import MetricCard from '../../components/MetricCard';
import Panel from '../../components/Panel';
import StatusBadge from '../../components/StatusBadge';

const metrics = [
  { icon: Users, label: 'Pacientes ativos', value: 34, note: '+3 este mês' },
  { icon: CalendarDays, label: 'Sessões esta semana', value: 12, note: 'Próxima às 09:00' },
  { icon: ClipboardClock, label: 'Evoluções pendentes', value: 5, note: 'Requer revisão' },
  { icon: AudioLines, label: 'Análises IA', value: 8, note: '3 aguardam validação' },
];

const recentColumns = [
  { key: 'name', label: 'Paciente' },
  { key: 'goal', label: 'Objetivo' },
  { key: 'progress', label: 'Evolução' },
];

const recentPatients = [
  { id: 1, name: 'Maria Luiza Ferreira', goal: 'Fluência', progress: '+8%' },
  { id: 2, name: 'João Pedro Santos', goal: 'Fonema /r/', progress: 'Estável' },
  { id: 3, name: 'Ana Clara Souza', goal: 'Linguagem', progress: 'Revisar' },
];

const todaySessions = [
  { time: '09:00', patient: 'Maria Luiza', confirmed: true },
  { time: '11:30', patient: 'João Pedro', confirmed: true },
  { time: '15:00', patient: 'Ana Clara', confirmed: false },
];

export default function Dashboard() {
  return (
    <>
      <div className="flex gap-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="flex items-start gap-4">
        <Panel
          title="Pacientes recentes"
          className="flex-1"
          aside={
            <a href="#/profissional/pacientes" className="text-sm text-muted underline-offset-4 hover:text-primary hover:underline">
              Ver todos
            </a>
          }
        >
          <DataTable caption="Pacientes recentes" columns={recentColumns} rows={recentPatients} />
        </Panel>

        <Panel title="Sessões de hoje" className="w-80 shrink-0">
          <ul className="flex flex-col">
            {todaySessions.map((session) => (
              <li key={session.time} className="flex min-h-13 items-center justify-between gap-3">
                <div className="flex flex-col gap-0.75">
                  <span className="text-sm font-bold text-navy">{session.time}</span>
                  <span className="text-sm text-muted">{session.patient}</span>
                </div>
                <StatusBadge tone={session.confirmed ? 'success' : 'warning'}>
                  {session.confirmed ? 'Confirmada' : 'A confirmar'}
                </StatusBadge>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
