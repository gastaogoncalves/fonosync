import { useState } from 'react';
import { Search, Filter, UserPlus, FileText, FolderArchive, ChevronRight, X, Save, CheckCircle2, RotateCcw } from 'lucide-react';

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('todos'); // 'todos', 'acompanhamento', 'atencao', 'arquivados'
  
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [successNotice, setSuccessNotice] = useState(false);

  const [filterAgeGroup, setFilterAgeGroup] = useState('todos');

  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');

  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'Maria Luiza Ferreira',
      age: 8,
      lastSession: 'Hoje, 09:00',
      professional: 'Dra. Renata Lima',
      status: 'Em acompanhamento',
      statusType: 'acompanhamento',
      phone: '(11) 98888-1111',
      notes: 'Evolução estável na fluência e fonética.',
      archived: false,
    },
    {
      id: 2,
      name: 'João Pedro Santos',
      age: 6,
      lastSession: '30 set, 16:30',
      professional: 'Dra. Renata Lima',
      status: 'Em acompanhamento',
      statusType: 'acompanhamento',
      phone: '(11) 97777-2222',
      notes: 'Boa aderência aos exercícios domiciliares.',
      archived: false,
    },
    {
      id: 3,
      name: 'Ana Clara Souza',
      age: 10,
      lastSession: '28 set, 14:00',
      professional: 'Dra. Renata Lima',
      status: 'Atenção',
      statusType: 'atencao',
      phone: '(11) 96666-3333',
      notes: 'Apresentou oscilação na taxa de fluência.',
      archived: false,
    },
    {
      id: 4,
      name: 'Lucas Ribeiro',
      age: 4,
      lastSession: '25 set, 11:00',
      professional: 'Dra. Renata Lima',
      status: 'Pausado',
      statusType: 'pausado',
      phone: '(11) 95555-4444',
      notes: 'Tratamento pausado temporariamente a pedido dos responsáveis.',
      archived: false,
    },
    {
      id: 5,
      name: 'Beatriz Costa',
      age: 9,
      lastSession: '15 Ago, 10:00',
      professional: 'Dra. Renata Lima',
      status: 'Arquivado',
      statusType: 'arquivado',
      phone: '(11) 94444-5555',
      notes: 'Alta terapêutica concluída com sucesso.',
      archived: true,
    },
  ]);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'arquivados') {
      return matchesSearch && patient.archived;
    }

    // Se não estiver na aba de arquivados, ignora os arquivados na listagem padrão
    if (patient.archived) return false;

    if (activeTab === 'acompanhamento' && patient.statusType !== 'acompanhamento') return false;
    if (activeTab === 'atencao' && patient.statusType !== 'atencao') return false;

    if (filterAgeGroup === 'crianca' && patient.age >= 8) return false;
    if (filterAgeGroup === 'pre-adolescente' && (patient.age < 8 || patient.age > 12)) return false;

    return matchesSearch;
  });

  const handleOpenRecord = (patient) => {
    setSelectedPatient(patient);
    setShowRecordModal(true);
  };

  const handleToggleArchive = (patientId, e) => {
    e.stopPropagation();
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        const nextArchived = !p.archived;
        return { 
          ...p, 
          archived: nextArchived, 
          status: nextArchived ? 'Arquivado' : 'Em acompanhamento',
          statusType: nextArchived ? 'arquivado' : 'acompanhamento'
        };
      }
      return p;
    }));
    setShowRecordModal(false);
  };

  const handleCreatePatient = (e) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    const newEntry = {
      id: patients.length + 1,
      name: newPatientName,
      age: newPatientAge ? Number(newPatientAge) : 7,
      lastSession: 'Recém-cadastrado',
      professional: 'Dra. Renata Lima',
      status: 'Em acompanhamento',
      statusType: 'acompanhamento',
      phone: newPatientPhone || 'Não informado',
      notes: 'Prontuário criado recentemente.',
      archived: false,
    };

    setPatients([newEntry, ...patients]);
    setNewPatientName('');
    setNewPatientAge('');
    setNewPatientPhone('');
    setShowNewPatientModal(false);
    
    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 3000);
  };

  const activePatientsCount = patients.filter(p => !p.archived).length;
  const archivedPatientsCount = patients.filter(p => p.archived).length;

  return (
    <div className="space-y-6 font-sans">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[#172C3A] flex items-center gap-2">
            Gestão de Pacientes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Cadastre, busque e gerencie os prontuários ativos e arquivados.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-slate-300 text-[#172C3A] text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#0284C7]" /> {activePatientsCount} Pacientes Ativos
          </div>
        </div>
      </div>

      {successNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border-l-4 border-emerald-500 flex items-center gap-3 text-xs shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold text-emerald-950">Paciente cadastrado com sucesso! Prontuário gerado.</span>
        </div>
      )}

      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Nome, responsável ou telefone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-[#172C3A] font-medium focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setShowFilterModal(true)}
              className="px-4 py-2.5 bg-white border border-slate-300 text-[#172C3A] text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-slate-50 shadow-sm cursor-pointer"
            >
              <Filter size={15} /> Filtros {filterAgeGroup !== 'todos' && '(Ativo)'}
            </button>
            <button
              type="button"
              onClick={() => setShowNewPatientModal(true)}
              className="px-4 py-2.5 bg-[#0284C7] text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-sky-700 shadow-sm cursor-pointer"
            >
              <UserPlus size={15} /> Novo cadastro
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('todos')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'todos' 
                  ? 'bg-[#172C3A] text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos Ativos
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('acompanhamento')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'acompanhamento' 
                  ? 'bg-emerald-700 text-white shadow-sm' 
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              Em acompanhamento
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('atencao')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'atencao' 
                  ? 'bg-amber-600 text-white shadow-sm' 
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              Atenção
            </button>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'arquivados' ? 'todos' : 'arquivados')}
            className={`text-xs font-bold flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeTab === 'arquivados'
                ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FolderArchive size={14} /> Ver Arquivados ({archivedPatientsCount})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Paciente</th>
                <th className="py-3.5 px-4">Idade</th>
                <th className="py-3.5 px-4">Última Sessão</th>
                <th className="py-3.5 px-4">Profissional</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-[#172C3A]">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center border shrink-0 ${
                        patient.archived ? 'bg-slate-200 text-slate-600 border-slate-300' : 'bg-sky-100 text-[#0284C7] border-sky-200'
                      }`}>
                        {patient.name.slice(0, 2).toUpperCase()}
                      </div>
                      {patient.name}
                    </td>
                    <td className="py-4 px-4 text-slate-600">{patient.age} anos</td>
                    <td className="py-4 px-4 text-slate-600">{patient.lastSession}</td>
                    <td className="py-4 px-4 text-slate-600">{patient.professional}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        patient.statusType === 'acompanhamento' ? 'bg-emerald-50 text-emerald-800' :
                        patient.statusType === 'atencao' ? 'bg-amber-50 text-amber-800' : 
                        patient.statusType === 'arquivados' || patient.archived ? 'bg-slate-100 text-slate-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenRecord(patient)}
                        className="text-[#0284C7] hover:underline font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        {patient.archived ? 'Restaurar / Ver' : 'Abrir Prontuário'} <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Nenhum paciente encontrado nesta categoria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-300 p-6 shadow-2xl space-y-4 text-[#172C3A]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold font-serif text-[#172C3A]">Filtrar Pacientes</h3>
              <button 
                type="button" 
                onClick={() => setShowFilterModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold mb-1.5 text-slate-700">Faixa Etária</label>
                <select
                  value={filterAgeGroup}
                  onChange={(e) => setFilterAgeGroup(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium bg-white cursor-pointer"
                >
                  <option value="todos">Todas as idades</option>
                  <option value="crianca">Até 7 anos (Crianças)</option>
                  <option value="pre-adolescente">8 a 12 anos</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setFilterAgeGroup('todos');
                  setShowFilterModal(false);
                }}
                className="flex-1 py-2 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Limpar Filtros
              </button>
              <button
                type="button"
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-2 bg-[#0284C7] text-white rounded-xl font-bold hover:bg-sky-700 shadow-sm cursor-pointer"
              >
                Aplicar Filtro
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-300 p-6 shadow-2xl space-y-4 text-[#172C3A]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold font-serif text-[#172C3A]">Cadastrar Novo Paciente</h3>
              <button 
                type="button" 
                onClick={() => setShowNewPatientModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold mb-1 text-slate-700">Nome Completo do Paciente *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo Lima"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700">Idade (anos)</label>
                  <input
                    type="number"
                    placeholder="Ex: 7"
                    value={newPatientAge}
                    onChange={(e) => setNewPatientAge(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-[#0284C7]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-700">Telefone / Contato</label>
                  <input
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={newPatientPhone}
                    onChange={(e) => setNewPatientPhone(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-[#0284C7]"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPatientModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0284C7] text-white rounded-xl font-bold hover:bg-sky-700 shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Save size={15} /> Salvar Prontuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRecordModal && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-300 p-6 shadow-2xl space-y-4 text-[#172C3A]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-100 text-[#0284C7] font-bold text-sm flex items-center justify-center border border-sky-200">
                  {selectedPatient.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-[#172C3A]">{selectedPatient.name}</h3>
                  <p className="text-xs text-slate-500">{selectedPatient.archived ? 'Prontuário Arquivado' : 'Prontuário Clínico Ativo'}</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowRecordModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block font-bold">Idade:</span>
                  <span className="font-semibold text-slate-800">{selectedPatient.age} anos</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-bold">Contato:</span>
                  <span className="font-semibold text-slate-800">{selectedPatient.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-bold">Profissional Responsável:</span>
                  <span className="font-semibold text-slate-800">{selectedPatient.professional}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-bold">Status Clínico:</span>
                  <span className="font-semibold text-emerald-700">{selectedPatient.status}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notas e Observações da Sessão:</label>
                <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-200 text-sky-950 font-medium">
                  {selectedPatient.notes}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => handleToggleArchive(selectedPatient.id, e)}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer border ${
                  selectedPatient.archived 
                    ? 'border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100' 
                    : 'border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100'
                }`}
              >
                {selectedPatient.archived ? <RotateCcw size={14} /> : <FolderArchive size={14} />}
                {selectedPatient.archived ? 'Restaurar Paciente' : 'Arquivar Prontuário'}
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => alert(`A Gerar relatório em PDF para ${selectedPatient.name}...`)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <FileText size={15} /> Exportar Relatório
                </button>
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="px-5 py-2 bg-[#0284C7] text-white rounded-xl font-bold hover:bg-sky-700 shadow-sm cursor-pointer text-xs"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}