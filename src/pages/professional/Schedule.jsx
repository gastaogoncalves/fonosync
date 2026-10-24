import { useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import Button from '../../components/Button';
import DataTable from '../../components/DataTable';

const views = ['Semana', 'Mês', 'Lista', 'Disponibilidade'];

const week = [
  { day: 'Seg 05', sessions: [{ time: '09:00', patient: 'Maria Luiza', type: 'Presencial' }] },
  { day: 'Ter 06', sessions: [{ time: '11:30', patient: 'João Pedro', type: 'Presencial' }] },
  { day: 'Qua 07', sessions: [{ time: '14:00', patient: 'Ana Clara', type: 'A confirmar', pending: true }] },
  { day: 'Qui 08', sessions: [{ time: '16:30', patient: 'Lucas Ribeiro', type: 'Presencial' }] },
  { day: 'Sex 09', sessions: [] },
];

const listColumns = [
  { key: 'day', label: 'Dia' },
  { key: 'time', label: 'Horário' },
  { key: 'patient', label: 'Paciente' },
  { key: 'type', label: 'Situação' },
];

function WeekView() {
  return (
    <div className="grid w-full grid-cols-5 border border-line bg-surface">
      {week.map((column) => (
        <section key={column.day} className="flex min-h-102.5 flex-col gap-3 border-r border-line p-2.5 last:border-r-0">
          <h2 className="font-sans text-sm font-bold text-navy">{column.day}</h2>
          {column.sessions.length === 0 && <p className="text-sm text-muted">Sem sessões</p>}
          {column.sessions.map((session) => (
            <div
              key={session.time}
              className={`flex flex-col gap-1.25 border-l-3 p-2.5 ${
                session.pending ? 'border-warning bg-warning/10' : 'border-primary bg-canvas'
              }`}
            >
              <span className="text-sm font-bold text-navy">{session.time}</span>
              <span className="text-sm text-ink">{session.patient}</span>
              <span className="text-sm text-muted">{session.type}</span>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

function ListView() {
  const rows = week.flatMap((column) =>
    column.sessions.map((session) => ({ id: `${column.day}-${session.time}`, day: column.day, ...session })),
  );
  return <DataTable caption="Sessões da semana" columns={listColumns} rows={rows} />;
}

export default function Schedule() {
  const [view, setView] = useState('Semana');

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-1.5" role="group" aria-label="Visualização da agenda">
          {views.map((option) => (
            <Button
              key={option}
              variant={view === option ? 'primary' : 'tertiary'}
              aria-pressed={view === option}
              onClick={() => setView(option)}
            >
              {option}
            </Button>
          ))}
        </div>
        <Button variant="primary">
          <CalendarPlus size={17} aria-hidden="true" />
          Agendar sessão
        </Button>
      </div>

      {view === 'Semana' && <WeekView />}
      {view === 'Lista' && <ListView />}
    </>
  );
}
