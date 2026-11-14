import { useEffect, useState } from 'react';
import { Search, Filter, UserPlus, Pencil, FolderArchive, ChevronRight, X, Save, CheckCircle2, CircleAlert } from 'lucide-react';
import { createGuardian, createPatient, listPatients, updatePatient } from '../../services/patientService';
import { formatCPF } from '../../utils/formatters';

const STATUS = {
  ATIVO: { label: 'Em acompanhamento', type: 'acompanhamento' },
  PRE_CADASTRO: { label: 'Pré-cadastro', type: 'pre-cadastro' },
  ARQUIVADO: { label: 'Arquivado', type: 'arquivado' },
};

const emptyForm = {
  name: '',
  dateOfBirth: '',
  phone: '',
  cpf: '',
  sex: '',
  cid10: '',
  guardianName: '',
  guardianCpf: '',
  guardianPhone: '',
  guardianRelationship: '',
};

function ageFrom(dateOfBirth) {
  if (!dateOfBirth) return null;
  const birth = new Date(`${dateOfBirth}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
  return beforeBirthday ? age - 1 : age;
}

function toRow(patient) {
  const status = STATUS[patient.patientStatus] ?? STATUS.ATIVO;
  return {
    ...patient,
    age: ageFrom(patient.dateOfBirth),
    phone: patient.contactPatient,
    status: status.label,
    statusType: status.type,
    archived: patient.patientStatus === 'ARQUIVADO',
  };
}

export default function Patients({ onOpenProntuario }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('todos'); // 'todos', 'acompanhamento', 'pre-cadastro', 'arquivados'

  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [notice, setNotice] = useState(null);

  const [filterAgeGroup, setFilterAgeGroup] = useState('todos');

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    listPatients()
      .then((list) => setPatients(list.map(toRow)))
      .catch((error) => setLoadError(error.message))
      .finally(() => setLoading(false));
  }, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const formAge = ageFrom(form.dateOfBirth);
  const needsGuardian = formAge !== null && formAge < 18 && !editingPatient?.guardianId;

  const showNotice = (tone, text) => {
    setNotice({ tone, text });
    if (tone === 'success') setTimeout(() => setNotice(null), 4000);
  };

  const filteredPatients = patients.filter((patient) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = patient.name.toLowerCase().includes(term) || (patient.phone ?? '').includes(term);

    if (activeTab === 'arquivados') {
      return matchesSearch && patient.archived;
    }

    if (patient.archived) return false;

    if (activeTab === 'acompanhamento' && patient.statusType !== 'acompanhamento') return false;
    if (activeTab === 'pre-cadastro' && patient.statusType !== 'pre-cadastro') return false;

    if (filterAgeGroup === 'crianca' && (patient.age === null || patient.age >= 8)) return false;
    if (filterAgeGroup === 'pre-adolescente' && (patient.age === null || patient.age < 8 || patient.age > 12)) return false;

    return matchesSearch;
  });

  const handleOpenRecord = (patient) => onOpenProntuario(patient);

  const replacePatient = (updated) => {
    const row = toRow(updated);
    setPatients((current) => current.map((p) => (p.id === row.id ? row : p)));
    return row;
  };

  const openNewPatient = () => {
    setEditingPatient(null);
    setForm(emptyForm);
    setShowNewPatientModal(true);
  };

  const openEditPatient = (patient) => {
    setEditingPatient(patient);
    setForm({
      ...emptyForm,
      name: patient.name,
      dateOfBirth: patient.dateOfBirth ?? '',
      phone: patient.contactPatient ?? '',
      cpf: patient.cpfPatient ?? '',
      sex: patient.sex ?? '',
      cid10: patient.cid10 ?? '',
    });
    setShowNewPatientModal(true);
  };

  const closeNewPatient = () => {
    setShowNewPatientModal(false);
    setEditingPatient(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleSavePatient = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);
    setFormError('');
    try {
      let guardianId = editingPatient?.guardianId ?? null;
      if (needsGuardian) {
        const guardian = await createGuardian({
          name: form.guardianName,
          cpf: form.guardianCpf,
          phoneNumber: form.guardianPhone,
          relationship: form.guardianRelationship,
        });
        guardianId = guardian.id;
      }

      const isMinorPatient = formAge !== null && formAge < 18;
      const data = {
        name: form.name.trim(),
        dateOfBirth: form.dateOfBirth || null,
        cpfPatient: isMinorPatient ? null : (form.cpf ? form.cpf.trim() : null),
        contactPatient: form.phone || null,
        sex: form.sex || null,
        cid10: form.cid10.trim() || null,
        guardianId,
      };

      if (editingPatient) {
        replacePatient(
          await updatePatient(editingPatient.id, { ...data, patientStatus: editingPatient.patientStatus }),
        );
        showNotice('success', 'Dados do paciente atualizados.');
      } else {
        const created = await createPatient(data);
        setPatients([toRow(created), ...patients]);
        showNotice('success', 'Paciente cadastrado com sucesso! Prontuário gerado.');
      }
      closeNewPatient();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const archivedPatientsCount = patients.filter(p => p.archived).length;

  return (
    <div className="space-y-6 font-sans">
      <div role="status">
        {notice?.tone === 'success' && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border-l-4 border-emerald-500 flex items-center gap-3 text-xs shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold text-emerald-950">{notice.text}</span>
          </div>
        )}
        {notice?.tone === 'danger' && (
          <div className="p-3.5 rounded-xl bg-rose-50 border-l-4 border-rose-600 flex items-center gap-3 text-xs shadow-sm">
            <CircleAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-bold text-rose-950">{notice.text}</span>
          </div>
        )}
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Nome ou telefone"
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
              onClick={openNewPatient}
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
              onClick={() => setActiveTab('pre-cadastro')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pre-cadastro' 
                  ? 'bg-amber-600 text-white shadow-sm' 
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              Pré-cadastro
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
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-[#172C3A]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    <span className="inline-flex items-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#0284C7]" aria-hidden="true" />
                      Carregando pacientes...
                    </span>
                  </td>
                </tr>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    onClick={() => handleOpenRecord(patient)}
                    className="hover:bg-sky-50/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6 font-bold flex items-center gap-3 group-hover:text-[#0284C7] transition-colors">
                      <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center border shrink-0 ${
                        patient.archived ? 'bg-slate-200 text-slate-600 border-slate-300' : 'bg-sky-100 text-[#0284C7] border-sky-200'
                      }`}>
                        {patient.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{patient.name}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-600">{patient.age !== null && `${patient.age} anos`}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        patient.statusType === 'acompanhamento' ? 'bg-emerald-50 text-emerald-800' :
                        patient.statusType === 'pre-cadastro' ? 'bg-amber-50 text-amber-800' : 
                        patient.statusType === 'arquivados' || patient.archived ? 'bg-slate-100 text-slate-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditPatient(patient);
                        }}
                        className="mr-4 text-slate-600 hover:text-[#0284C7] font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Pencil size={13} /> Editar
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenRecord(patient);
                        }}
                        className="text-[#0284C7] group-hover:underline font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        {patient.archived ? 'Restaurar / Ver' : 'Abrir Prontuário'} <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className={`py-8 text-center ${loadError ? 'font-bold text-rose-700' : 'text-slate-400'}`}>
                    {loadError || 'Nenhum paciente encontrado nesta categoria.'}
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
              <h3 className="text-lg font-bold font-serif text-[#172C3A]">
                {editingPatient ? 'Editar Paciente' : 'Cadastrar Novo Paciente'}
              </h3>
              <button 
                type="button" 
                onClick={closeNewPatient}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePatient} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold mb-1 text-slate-700">Nome Completo do Paciente *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo Lima"
                  value={form.name}
                  onChange={update('name')}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700">Data de nascimento *</label>
                  <input
                    type="date"
                    required
                    value={form.dateOfBirth}
                    onChange={update('dateOfBirth')}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-[#0284C7]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-700">Telefone / Contato</label>
                  <input
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={form.phone}
                    onChange={update('phone')}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-[#0284C7]"
                  />
                </div>
                {formAge !== null && formAge < 18 ? (
                  <div className="col-span-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                    <span>🛡️ <strong>Proteção de Menores (LGPD):</strong> Por segurança e privacidade da criança, não solicitamos CPF do menor de idade. Apenas o responsável legal possui CPF registrado.</span>
                  </div>
                ) : (
                  <div>
                    <label className="block font-bold mb-1 text-slate-700">CPF do Paciente Adulto</label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      value={form.cpf}
                      onChange={(e) => setForm({ ...form, cpf: formatCPF(e.target.value) })}
                      className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>
                )}
                <div>
                  <label className="block font-bold mb-1 text-slate-700">Sexo</label>
                  <select
                    value={form.sex}
                    onChange={update('sex')}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-[#0284C7] bg-white"
                  >
                    <option value="">Não informado</option>
                    <option value="FEMININO">Feminino</option>
                    <option value="MASCULINO">Masculino</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-700">CID-10</label>
                  <input
                    type="text"
                    placeholder="Ex.: F80.9"
                    value={form.cid10}
                    onChange={update('cid10')}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-[#0284C7]"
                  />
                </div>
              </div>

              {needsGuardian && (
                <fieldset className="space-y-3 rounded-xl border border-slate-200 p-3">
                  <legend className="px-1 font-bold text-slate-700">Responsável (menor de 18 anos)</legend>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1 text-slate-700">Nome *</label>
                      <input
                        type="text"
                        required
                        value={form.guardianName}
                        onChange={update('guardianName')}
                        className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-[#0284C7]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1 text-slate-700">CPF *</label>
                      <input
                        type="text"
                        required
                        value={form.guardianCpf}
                        onChange={update('guardianCpf')}
                        className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-[#0284C7]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1 text-slate-700">Telefone *</label>
                      <input
                        type="text"
                        required
                        value={form.guardianPhone}
                        onChange={update('guardianPhone')}
                        className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-[#0284C7]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1 text-slate-700">Parentesco *</label>
                      <input
                        type="text"
                        required
                        placeholder="Mãe, pai, avó..."
                        value={form.guardianRelationship}
                        onChange={update('guardianRelationship')}
                        className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-[#0284C7]"
                      />
                    </div>
                  </div>
                </fieldset>
              )}

              {formError && (
                <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-2.5 font-bold text-rose-800">
                  {formError}
                </p>
              )}

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={closeNewPatient}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-[#0284C7] text-white rounded-xl font-bold hover:bg-sky-700 shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {saving ? (
                    <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                  ) : (
                    <Save size={15} />
                  )}
                  {saving ? 'Salvando...' : editingPatient ? 'Salvar Alterações' : 'Salvar Prontuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}