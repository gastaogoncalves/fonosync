import { useState } from 'react';
import { CalendarPlus, CheckCircle, Trash2 } from 'lucide-react';
import Button from '../../components/Button';
import DataTable from '../../components/DataTable';
import InfoDialog from '../../components/InfoDialog';
import Notice from '../../components/Notice';

const views = ['Semana', 'Mês', 'Lista', 'Disponibilidade'];

const initialWeek = [
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

const hours = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
const fieldClass = 'w-full rounded-md border border-muted/60 bg-surface p-3 text-sm text-ink';
const labelClass = 'mb-1 block text-xs font-bold uppercase text-ink';

function MonthView({ week }) {
  // Outubro de 2026: o mesmo mês das sessões de exemplo
  const first = new Date(2026, 9, 1).getDay();
  const daysInMonth = new Date(2026, 10, 0).getDate();
  const sessionsByDay = {};
  week.forEach((column) => {
    sessionsByDay[Number(column.day.split(' ')[1])] = column.sessions;
  });
  const cells = [...Array(first).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];

  return (
    <div className="overflow-x-auto border border-line bg-surface">
      <div className="min-w-160">
        <h2 className="border-b border-line p-3 font-sans text-sm font-bold text-navy">Outubro de 2026</h2>
        <div className="grid grid-cols-7 text-xs">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((name) => (
            <div key={name} className="border-b border-line bg-mist p-2 text-center font-bold uppercase text-navy">
              {name}
            </div>
          ))}
          {cells.map((day, index) => {
            const sessions = day ? sessionsByDay[day] ?? [] : [];
            return (
              <div key={index} className="min-h-24 border-r border-b border-line p-1.5">
                {day && <span className="font-bold text-navy">{day}</span>}
                {sessions.map((session, position) => (
                  <p
                    key={position}
                    className={`mt-1 truncate border-l-2 px-1.5 py-0.5 text-ink ${
                      session.pending ? 'border-warning bg-warning/10' : 'border-primary bg-mist'
                    }`}
                  >
                    {session.time} {session.patient}
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AvailabilityView({ week }) {
  const [blocked, setBlocked] = useState(() => new Set(['4-14:00', '4-15:00', '4-16:00', '4-17:00']));
  const [saved, setSaved] = useState(false);

  const toggle = (key) => {
    const next = new Set(blocked);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setBlocked(next);
    setSaved(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <Notice tone="info" title="Disponibilidade semanal">
        Marque os horários em que você atende. Horários com sessão marcada aparecem como ocupados.
      </Notice>

      <div className="overflow-x-auto border border-line bg-surface">
        <table className="w-full text-sm">
          <caption className="sr-only">Disponibilidade por dia e horário</caption>
          <thead className="bg-mist text-navy">
            <tr>
              <th scope="col" className="h-10 px-3 text-left font-normal">Horário</th>
              {week.map((column) => (
                <th key={column.day} scope="col" className="px-3 font-normal">{column.day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => (
              <tr key={hour} className="border-t border-line">
                <th scope="row" className="px-3 text-left font-bold text-navy">{hour}</th>
                {week.map((column, dayIndex) => {
                  const key = `${dayIndex}-${hour}`;
                  const isBooked = column.sessions.some((session) => session.time === hour);
                  const isOff = blocked.has(key);
                  return (
                    <td key={key} className="p-1.5 text-center">
                      {isBooked ? (
                        <span className="block rounded-md border border-primary bg-primary/10 px-2 py-2.5 text-xs font-bold text-primary">
                          Ocupado
                        </span>
                      ) : (
                        <button
                          type="button"
                          aria-pressed={!isOff}
                          onClick={() => toggle(key)}
                          className={`min-h-11 w-full rounded-md border px-2 text-xs font-bold ${
                            isOff ? 'border-line bg-surface text-muted' : 'border-success bg-success/10 text-success'
                          }`}
                        >
                          {isOff ? 'Bloqueado' : 'Livre'}
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={() => setSaved(true)}>Salvar disponibilidade</Button>
        <span role="status" className="text-sm font-bold text-success">{saved && 'Disponibilidade salva.'}</span>
      </div>
    </div>
  );
}

export default function Schedule() {
  const [view, setView] = useState('Semana');
  const [week, setWeek] = useState(initialWeek);
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [newSession, setNewSession] = useState({ dayIndex: 0, time: '10:00', patient: '', type: 'Presencial' });

  const handleAddSession = (event) => {
    event.preventDefault();
    if (!newSession.patient.trim()) return;

    setWeek((current) =>
      current.map((column, index) =>
        index === newSession.dayIndex
          ? {
              ...column,
              sessions: [...column.sessions, { time: newSession.time, patient: newSession.patient.trim(), type: newSession.type }].sort(
                (a, b) => a.time.localeCompare(b.time),
              ),
            }
          : column,
      ),
    );
    setShowModal(false);
    setNewSession({ dayIndex: 0, time: '10:00', patient: '', type: 'Presencial' });
  };

  const confirmSession = () => {
    const { dayIndex, idx } = selectedSession;
    setWeek((current) =>
      current.map((column, d) =>
        d !== dayIndex
          ? column
          : {
              ...column,
              sessions: column.sessions.map((session, i) => (i === idx ? { ...session, pending: false, type: 'Presencial' } : session)),
            },
      ),
    );
    setSelectedSession(null);
  };

  const cancelSession = () => {
    const { dayIndex, idx } = selectedSession;
    setWeek((current) =>
      current.map((column, d) => (d !== dayIndex ? column : { ...column, sessions: column.sessions.filter((_, i) => i !== idx) })),
    );
    setSelectedSession(null);
  };

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Visualização da agenda">
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
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <CalendarPlus size={17} aria-hidden="true" />
          Agendar sessão
        </Button>
      </div>

      {view === 'Semana' && (
        <div className="grid w-full grid-cols-5 border border-line bg-surface">
          {week.map((column, dayIndex) => (
            <section key={column.day} className="flex min-h-102.5 flex-col gap-3 border-r border-line p-2.5 last:border-r-0">
              <h2 className="font-sans text-sm font-bold text-navy">{column.day}</h2>
              {column.sessions.length === 0 && <p className="text-sm text-muted">Sem sessões</p>}
              {column.sessions.map((session, idx) => (
                <button
                  key={`${session.time}-${idx}`}
                  type="button"
                  onClick={() => setSelectedSession({ ...session, day: column.day, dayIndex, idx })}
                  className={`flex w-full flex-col gap-1.25 border-l-3 p-2.5 text-left transition-transform hover:scale-[1.02] ${
                    session.pending ? 'border-warning bg-warning/10' : 'border-primary bg-canvas'
                  }`}
                >
                  <span className="text-sm font-bold text-navy">{session.time}</span>
                  <span className="text-sm text-ink">{session.patient}</span>
                  <span className="text-sm text-muted">{session.type}</span>
                </button>
              ))}
            </section>
          ))}
        </div>
      )}

      {view === 'Mês' && <MonthView week={week} />}

      {view === 'Lista' && (
        <DataTable
          caption="Sessões da semana"
          columns={listColumns}
          rows={week.flatMap((column) => column.sessions.map((session, i) => ({ id: `${column.day}-${session.time}-${i}`, day: column.day, ...session })))}
        />
      )}

      {view === 'Disponibilidade' && <AvailabilityView week={week} />}

      <InfoDialog isOpen={showModal} onClose={() => setShowModal(false)} title="Agendar nova sessão" footer={false}>
        <form onSubmit={handleAddSession} className="space-y-4">
          <div>
            <label htmlFor="sessao-paciente" className={labelClass}>Paciente *</label>
            <input
              id="sessao-paciente"
              type="text"
              required
              placeholder="Nome do paciente"
              value={newSession.patient}
              onChange={(event) => setNewSession({ ...newSession, patient: event.target.value })}
              className={fieldClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="sessao-dia" className={labelClass}>Dia da semana</label>
              <select
                id="sessao-dia"
                value={newSession.dayIndex}
                onChange={(event) => setNewSession({ ...newSession, dayIndex: Number(event.target.value) })}
                className={fieldClass}
              >
                {week.map((column, index) => (
                  <option key={column.day} value={index}>{column.day}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sessao-horario" className={labelClass}>Horário</label>
              <input
                id="sessao-horario"
                type="time"
                value={newSession.time}
                onChange={(event) => setNewSession({ ...newSession, time: event.target.value })}
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="sessao-modalidade" className={labelClass}>Modalidade</label>
            <select
              id="sessao-modalidade"
              value={newSession.type}
              onChange={(event) => setNewSession({ ...newSession, type: event.target.value })}
              className={fieldClass}
            >
              <option value="Presencial">Presencial</option>
              <option value="Online / Teleatendimento">Online / Teleatendimento</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="tertiary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">Confirmar agendamento</Button>
          </div>
        </form>
      </InfoDialog>

      <InfoDialog isOpen={Boolean(selectedSession)} onClose={() => setSelectedSession(null)} title="Detalhes da sessão" footer={false}>
        {selectedSession && (
          <>
            <p className="text-base font-bold text-primary">{selectedSession.patient}</p>
            <p className="text-muted">
              {selectedSession.day} às {selectedSession.time} · {selectedSession.type}
            </p>

            {selectedSession.pending ? (
              <Notice tone="warning" title="Presença a confirmar">
                Confirme para marcar esta sessão como presencial.
              </Notice>
            ) : (
              <Notice tone="success" title="Sessão confirmada" />
            )}

            <div className="flex flex-wrap justify-end gap-2 pt-2">
              <Button variant="tertiary" onClick={cancelSession}>
                <Trash2 size={16} aria-hidden="true" /> Cancelar sessão
              </Button>
              {selectedSession.pending ? (
                <Button variant="primary" onClick={confirmSession}>
                  <CheckCircle size={16} aria-hidden="true" /> Confirmar presença
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => setSelectedSession(null)}>Fechar</Button>
              )}
            </div>
          </>
        )}
      </InfoDialog>
    </>
  );
}