import { useState, useEffect } from 'react';
import {
  CalendarPlus,
  CheckCircle,
  FileText,
  Video,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  Stethoscope,
} from 'lucide-react';
import { listPatients } from '../../services/patientService';

const today = new Date();
const todayIso = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
const todayLabel = today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

const initialAppointments = [];

export default function Schedule({ onNavigate, onSelectPatient }) {
  const [view, setView] = useState('Hoje'); // 'Hoje' | 'Semana' | 'Lista'
  const [appointments, setAppointments] = useState(initialAppointments);
  const [patients, setPatients] = useState([]);
  const [feedback, setFeedback] = useState(null);

  // Modais
  const [showNewModal, setShowNewModal] = useState(false);
  const [sessionModalAppt, setSessionModalAppt] = useState(null);

  // Formulário de Nova Sessão (Realizar Atendimento)
  const [sessionForm, setSessionForm] = useState({
    evolucao: '',
    ponto_melhora: '',
    tags: 'Fluência, Linguagem',
  });

  // Formulário de Novo Agendamento
  const [newAgendamento, setNewAgendamento] = useState({
    patientName: '',
    patientId: '',
    date: todayIso,
    time: '11:00',
    duration: 45,
    therapyType: 'Terapia de Linguagem',
    modality: 'Presencial',
  });

  useEffect(() => {
    listPatients()
      .then((data) => {
        setPatients(data);
        if (data.length > 0) {
          setNewAgendamento((prev) => ({
            ...prev,
            patientName: data[0].name,
            patientId: data[0].id,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const showNotification = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 5000);
  };

  // Abrir Modal de Realizar Atendimento (Agendamento -> Sessão)
  const handleOpenPerformSession = (appt) => {
    setSessionModalAppt(appt);
    setSessionForm({
      evolucao: `Atendimento fonoaudiológico focado em ${appt.therapyType.toLowerCase()}. Paciente colaborativo(a) durante as atividades propostas.`,
      ponto_melhora: 'Dar continuidade aos exercícios propostos para fixação em ambiente doméstico.',
      tags: appt.therapyType.includes('Fluência')
        ? 'Fluência, Velocidade da Fala'
        : appt.therapyType.includes('Disfagia')
        ? 'Deglutição, Motricidade'
        : 'Linguagem, Articulação',
    });
  };

  // Concluir Atendimento (Transforma Agendamento em Sessão Concluída)
  const handleCompleteSession = (e) => {
    e.preventDefault();
    if (!sessionModalAppt) return;

    const updated = appointments.map((appt) => {
      if (appt.id === sessionModalAppt.id) {
        return {
          ...appt,
          status: 'Realizada',
          sessionDone: {
            evolucao: sessionForm.evolucao,
            ponto_melhora: sessionForm.ponto_melhora,
            dataRegistro: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            tags: sessionForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
          },
        };
      }
      return appt;
    });

    setAppointments(updated);
    showNotification(
      `Atendimento de ${sessionModalAppt.patientName} concluído com sucesso! Sessão registrada no prontuário.`
    );
    setSessionModalAppt(null);
  };

  // Criar Novo Agendamento
  const handleCreateAgendamento = (e) => {
    e.preventDefault();
    if (!newAgendamento.patientName.trim()) return;

    const newAppt = {
      id: `ag-${Date.now()}`,
      patientId: newAgendamento.patientId || `p-${Date.now()}`,
      patientName: newAgendamento.patientName,
      patientAge: 8,
      date: newAgendamento.date,
      time: newAgendamento.time,
      duration: Number(newAgendamento.duration) || 45,
      therapyType: newAgendamento.therapyType,
      modality: newAgendamento.modality,
      status: 'Confirmada',
      sessionDone: null,
    };

    setAppointments([newAppt, ...appointments]);
    setShowNewModal(false);
    showNotification(`Agendamento de ${newAgendamento.patientName} marcado para às ${newAgendamento.time}!`);
  };

  // Navegar direto para o Prontuário do Paciente
  const handleGoToProntuario = (appt) => {
    if (onSelectPatient) {
      onSelectPatient({ id: appt.patientId, name: appt.patientName });
    }
    if (onNavigate) {
      onNavigate('prontuario');
    } else {
      window.location.assign('#/profissional/prontuario');
    }
  };

  const todayAppts = appointments.filter((a) => a.date === todayIso);

  return (
    <div className="space-y-6 font-sans">
      {/* ---------------------------------------------------------------- */}
      {/* CABEÇALHO DA AGENDA COM UI/UX ELEVADA                            */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#172C3A]">Agenda de Atendimentos</h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize suas sessões, realize atendimentos clínicos e alimente automaticamente o prontuário.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Seletor de Visão */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            {['Hoje', 'Semana', 'Lista'].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  view === v ? 'bg-white text-[#0284C7] shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#0284C7] hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <CalendarPlus size={15} /> Novo Agendamento
          </button>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {feedback && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold shadow-2xs animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* NAVEGAÇÃO DE DIAS (BARRA CRONOLÓGICA)                             */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-3.5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-bold font-serif text-[#172C3A]">
            <span className="first-letter:uppercase inline-block">{todayLabel}</span>
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 text-[#0284C7]">Hoje</span>
          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Confirmada
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" /> Realizada
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Agendada
          </span>
        </div>
      </div>

      {/* ================================================================ */}
      {/* VISÃO: HOJE (CARDS DETALHADOS COM ATENDIMENTO DIRETO)            */}
      {/* ================================================================ */}
      {view === 'Hoje' && (
        <div className="space-y-3.5">
          {todayAppts.map((appt) => {
            const isRealizada = appt.status === 'Realizada';
            return (
              <div
                key={appt.id}
                className={`bg-white rounded-2xl border p-4.5 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isRealizada ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 hover:border-sky-300'
                }`}
              >
                {/* Lado Esquerdo: Horário e Dados do Paciente */}
                <div className="flex items-start md:items-center gap-4">
                  {/* Badge de Horário */}
                  <div className="w-20 shrink-0 text-center py-2 px-1 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="block text-sm font-bold text-[#172C3A] font-serif">{appt.time}</span>
                    <span className="text-[10px] text-slate-500">{appt.duration} min</span>
                  </div>

                  {/* Avatar Circular com Iniciais */}
                  <div className="w-10 h-10 rounded-full bg-sky-100 text-[#0284C7] font-bold text-xs flex items-center justify-center shrink-0 border border-sky-200">
                    {appt.patientName.slice(0, 2).toUpperCase()}
                  </div>

                  {/* Detalhes do Atendimento */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#172C3A] hover:text-[#0284C7] cursor-pointer" onClick={() => handleGoToProntuario(appt)}>
                        {appt.patientName}
                      </h3>
                      <span className="text-xs text-slate-400">· {appt.patientAge} anos</span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isRealizada
                            ? 'bg-emerald-100 text-emerald-800'
                            : appt.status === 'Confirmada'
                            ? 'bg-sky-100 text-[#0284C7]'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 flex items-center gap-2">
                      <span>{appt.therapyType}</span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        {appt.modality === 'Presencial' ? <MapPin size={11} /> : <Video size={11} />}
                        {appt.modality}
                      </span>
                    </p>

                    {/* Se já realizada, exibe prévia da evolução gravada */}
                    {isRealizada && appt.sessionDone && (
                      <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                        <strong>Evolução registrada:</strong> {appt.sessionDone.evolucao}
                      </div>
                    )}
                  </div>
                </div>

                {/* Lado Direito: Ações Clínicas */}
                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {isRealizada ? (
                    <button
                      type="button"
                      onClick={() => handleGoToProntuario(appt)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <CheckCircle size={14} /> Ver no Prontuário
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenPerformSession(appt)}
                        className="px-3.5 py-2 bg-[#0284C7] hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Stethoscope size={14} /> Realizar Atendimento
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGoToProntuario(appt)}
                        className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Ver prontuário do paciente"
                      >
                        <FileText size={13} className="text-[#0284C7]" /> Prontuário
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================================================================ */}
      {/* VISÃO: SEMANA (COLUNAS DE DIAS)                                  */}
      {/* ================================================================ */}
      {view === 'Semana' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-start">
          {[
            { day: 'Seg 17', label: 'Segunda', count: 0 },
            { day: 'Ter 18', label: 'Terça', count: 1 },
            { day: 'Qua 19', label: 'Quarta (Hoje)', count: todayAppts.length, isToday: true },
            { day: 'Qui 20', label: 'Quinta', count: 2 },
            { day: 'Sex 21', label: 'Sexta', count: 0 },
          ].map((col) => (
            <div
              key={col.day}
              className={`bg-white rounded-2xl border p-4 shadow-xs space-y-3 min-h-80 ${
                col.isToday ? 'border-[#0284C7] ring-1 ring-[#0284C7]/30' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold font-serif text-[#172C3A]">{col.label}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                  {col.day}
                </span>
              </div>

              {col.isToday ? (
                <div className="space-y-2">
                  {todayAppts.map((appt) => (
                    <div
                      key={appt.id}
                      onClick={() => handleOpenPerformSession(appt)}
                      className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-sky-50/60 hover:border-sky-200 transition-all cursor-pointer text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{appt.time}</span>
                        <span
                          className={`text-[9px] font-bold px-1 rounded ${
                            appt.status === 'Realizada' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-[#0284C7]'
                          }`}
                        >
                          {appt.status}
                        </span>
                      </div>
                      <p className="font-semibold text-[#172C3A] truncate">{appt.patientName}</p>
                      <p className="text-[10px] text-slate-500 truncate">{appt.therapyType}</p>
                    </div>
                  ))}
                </div>
              ) : col.day === 'Qui 20' ? (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs space-y-1">
                    <span className="font-bold text-slate-800">09:30</span>
                    <p className="font-semibold text-[#172C3A]">Valentina Souza</p>
                    <p className="text-[10px] text-slate-500">Desenvolvimento Linguístico</p>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs space-y-1">
                    <span className="font-bold text-slate-800">14:00</span>
                    <p className="font-semibold text-[#172C3A]">Lucas Gabriel Lima</p>
                    <p className="text-[10px] text-slate-500">Consciência Fonológica</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-8">Nenhum atendimento</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================================================================ */}
      {/* VISÃO: LISTA GERAL                                               */}
      {/* ================================================================ */}
      {view === 'Lista' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Data & Horário</th>
                <th className="py-2.5 px-3">Paciente</th>
                <th className="py-2.5 px-3">Terapia</th>
                <th className="py-2.5 px-3">Modalidade</th>
                <th className="py-2.5 px-3">Situação</th>
                <th className="py-2.5 px-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-800">
                    {appt.date} às {appt.time}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{appt.patientName}</td>
                  <td className="py-3 px-3 text-slate-500">{appt.therapyType}</td>
                  <td className="py-3 px-3 text-slate-500">{appt.modality}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        appt.status === 'Realizada'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-sky-100 text-[#0284C7]'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleGoToProntuario(appt)}
                      className="text-[#0284C7] hover:underline font-bold text-xs cursor-pointer"
                    >
                      Prontuário
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL: REALIZAR ATENDIMENTO (AGENDAMENTO -> SESSÃO CLÍNICA)      */}
      {/* ================================================================ */}
      {sessionModalAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-xl p-6 shadow-xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold font-serif text-[#172C3A] flex items-center gap-2">
                  <Stethoscope size={18} className="text-[#0284C7]" /> Realizar Atendimento & Registrar Sessão
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paciente: <strong className="text-slate-800">{sessionModalAppt.patientName}</strong> · Horário:{' '}
                  {sessionModalAppt.time} ({sessionModalAppt.duration} min)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSessionModalAppt(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCompleteSession} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  Evolução Clínica do Atendimento (Tabela: sessao.evolucao) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={sessionForm.evolucao}
                  onChange={(e) => setSessionForm({ ...sessionForm, evolucao: e.target.value })}
                  placeholder="Descreva o que foi trabalhado, adesão do paciente e progresso..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  Pontos de Melhora / Orientações Domiciliares (Tabela: sessao.ponto_melhora)
                </label>
                <textarea
                  rows={2}
                  value={sessionForm.ponto_melhora}
                  onChange={(e) => setSessionForm({ ...sessionForm, ponto_melhora: e.target.value })}
                  placeholder="Orientações para os pais ou foco da próxima sessão..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Tags e Parâmetros Clínicos</label>
                <input
                  type="text"
                  value={sessionForm.tags}
                  onChange={(e) => setSessionForm({ ...sessionForm, tags: e.target.value })}
                  placeholder="Ex: Fluência, Respiração, Leitura"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSessionModalAppt(null)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle size={14} /> Concluir Atendimento e Salvar no Prontuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL: NOVO AGENDAMENTO                                          */}
      {/* ================================================================ */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold font-serif text-[#172C3A] flex items-center gap-2">
                <CalendarPlus size={18} className="text-[#0284C7]" /> Novo Agendamento de Consulta
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAgendamento} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Paciente *</label>
                {patients.length > 0 ? (
                  <select
                    value={newAgendamento.patientId}
                    onChange={(e) => {
                      const selected = patients.find((p) => p.id === e.target.value);
                      setNewAgendamento({
                        ...newAgendamento,
                        patientId: e.target.value,
                        patientName: selected ? selected.name : '',
                      });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="Nome completo do paciente"
                    value={newAgendamento.patientName}
                    onChange={(e) => setNewAgendamento({ ...newAgendamento, patientName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Data *</label>
                  <input
                    type="date"
                    required
                    value={newAgendamento.date}
                    onChange={(e) => setNewAgendamento({ ...newAgendamento, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Horário *</label>
                  <input
                    type="time"
                    required
                    value={newAgendamento.time}
                    onChange={(e) => setNewAgendamento({ ...newAgendamento, time: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Duração</label>
                  <select
                    value={newAgendamento.duration}
                    onChange={(e) => setNewAgendamento({ ...newAgendamento, duration: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                  >
                    <option value={30}>30 minutos</option>
                    <option value={45}>45 minutos</option>
                    <option value={50}>50 minutos</option>
                    <option value={60}>60 minutos (1h)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Modalidade</label>
                  <select
                    value={newAgendamento.modality}
                    onChange={(e) => setNewAgendamento({ ...newAgendamento, modality: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                  >
                    <option value="Presencial">Presencial (Clínica)</option>
                    <option value="Teleatendimento">Teleatendimento (Online)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Tipo de Terapia / Foco</label>
                <input
                  type="text"
                  value={newAgendamento.therapyType}
                  onChange={(e) => setNewAgendamento({ ...newAgendamento, therapyType: e.target.value })}
                  placeholder="Ex: Terapia de Linguagem, Fluência, Motricidade..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0284C7] hover:bg-sky-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CalendarPlus size={14} /> Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
