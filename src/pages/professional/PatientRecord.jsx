import { useEffect, useState } from 'react';
import {
  Activity,
  AlertCircle,
  Archive,
  ArrowRight,
  Baby,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileBadge,
  FileCheck2,
  FilePlus2,
  FileText,
  FolderArchive,
  HeartHandshake,
  Pencil,
  Phone,
  Plus,
  RotateCcw,
  Stethoscope,
  Trash2,
  UploadCloud,
  User,
  Users,
  X,
} from 'lucide-react';
import { getGuardianById } from '../../services/guardianService';
import {
  createAnamnesis,
  getAnamnesesByPatient,
} from '../../services/anamnesisService';
import {
  createDiagnostic,
  getDiagnosticsByPatient,
} from '../../services/diagnosticService';
import {
  createEvaluation,
  getEvaluationsByPatient,
} from '../../services/evaluationService';
import {
  getAttachmentDownloadUrl,
  getAttachmentsByPatient,
  uploadAttachment,
} from '../../services/attachmentService';
import { formatBytes, formatDateBR, formatPhone } from '../../utils/formatters';

export default function PatientRecordModal({
  patient,
  isOpen,
  onClose,
  onEdit,
  onToggleArchive,
  onDelete,
}) {
  const [activeTab, setActiveTab] = useState('geral'); // 'geral', 'anamnese', 'diagnostico', 'avaliacoes', 'anexos'

  // Guardian state
  const [guardian, setGuardian] = useState(null);
  const [loadingGuardian, setLoadingGuardian] = useState(false);

  // Anamnesis state
  const [anamneses, setAnamneses] = useState([]);
  const [loadingAnamnese, setLoadingAnamnese] = useState(false);
  const [showNewAnamnese, setShowNewAnamnese] = useState(false);
  const [anamneseForm, setAnamneseForm] = useState({
    mainComplaint: '',
    familyHistory: '',
    symptomOnset: '',
    languageDevelopment: '',
    additionalObservations: '',
  });

  // Diagnostic state
  const [diagnostics, setDiagnostics] = useState([]);
  const [loadingDiag, setLoadingDiag] = useState(false);
  const [showNewDiag, setShowNewDiag] = useState(false);
  const [diagForm, setDiagForm] = useState({
    speechDiagnosis: '',
    cid10: '',
    therapeuticArea: 'Linguagem',
    sessionFrequency: '1x por semana',
    treatmentGoal: '',
    treatmentPlan: '',
  });

  // Evaluation state
  const [evaluations, setEvaluations] = useState([]);
  const [loadingEval, setLoadingEval] = useState(false);
  const [showNewEval, setShowNewEval] = useState(false);
  const [evalForm, setEvalForm] = useState({
    tipoAvaliacao: 'Triagem Inicial',
    dataAvaliacao: new Date().toISOString().split('T')[0],
    resultados: '',
    condutasPropostas: '',
    concluido: true,
  });

  // Attachments state
  const [attachments, setAttachments] = useState([]);
  const [loadingAtt, setLoadingAtt] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploading, setUploading] = useState(false);

  // Feedback notice
  const [notice, setNotice] = useState(null);
  const [savingForm, setSavingForm] = useState(false);

  const showFeedback = (tone, message) => {
    setNotice({ tone, message });
    setTimeout(() => setNotice(null), 4000);
  };

  // Carrega dados específicos quando a modal abre ou o paciente muda
  useEffect(() => {
    if (!isOpen || !patient) return;

    setActiveTab('geral');
    setNotice(null);

    // 1. Busca dados do responsável se houver guardianId
    if (patient.guardianId) {
      setLoadingGuardian(true);
      getGuardianById(patient.guardianId)
        .then((data) => setGuardian(data))
        .catch(() => setGuardian(null))
        .finally(() => setLoadingGuardian(false));
    } else {
      setGuardian(null);
    }

    // 2. Pré-carrega prontuário clínico
    loadAnamneses();
    loadDiagnostics();
    loadEvaluations();
    loadAttachments();
  }, [isOpen, patient?.id]);

  const loadAnamneses = () => {
    if (!patient?.id) return;
    setLoadingAnamnese(true);
    getAnamnesesByPatient(patient.id)
      .then((data) => setAnamneses(Array.isArray(data) ? data : []))
      .catch(() => setAnamneses([]))
      .finally(() => setLoadingAnamnese(false));
  };

  const loadDiagnostics = () => {
    if (!patient?.id) return;
    setLoadingDiag(true);
    getDiagnosticsByPatient(patient.id)
      .then((data) => setDiagnostics(Array.isArray(data) ? data : []))
      .catch(() => setDiagnostics([]))
      .finally(() => setLoadingDiag(false));
  };

  const loadEvaluations = () => {
    if (!patient?.id) return;
    setLoadingEval(true);
    getEvaluationsByPatient(patient.id)
      .then((data) => setEvaluations(Array.isArray(data) ? data : []))
      .catch(() => setEvaluations([]))
      .finally(() => setLoadingEval(false));
  };

  const loadAttachments = () => {
    if (!patient?.id) return;
    setLoadingAtt(true);
    getAttachmentsByPatient(patient.id)
      .then((data) => setAttachments(Array.isArray(data) ? data : []))
      .catch(() => setAttachments([]))
      .finally(() => setLoadingAtt(false));
  };

  // Salvar nova Anamnese
  const handleSaveAnamnese = async (e) => {
    e.preventDefault();
    if (!anamneseForm.mainComplaint.trim()) {
      showFeedback('danger', 'Informe ao menos a queixa principal.');
      return;
    }
    setSavingForm(true);
    try {
      await createAnamnesis(patient.id, anamneseForm);
      showFeedback('success', 'Anamnese registrada com sucesso no prontuário!');
      setShowNewAnamnese(false);
      setAnamneseForm({
        mainComplaint: '',
        familyHistory: '',
        symptomOnset: '',
        languageDevelopment: '',
        additionalObservations: '',
      });
      loadAnamneses();
    } catch (err) {
      showFeedback('danger', err.message || 'Erro ao registrar anamnese.');
    } finally {
      setSavingForm(false);
    }
  };

  // Salvar novo Diagnóstico
  const handleSaveDiagnostic = async (e) => {
    e.preventDefault();
    if (!diagForm.speechDiagnosis.trim() || !diagForm.cid10.trim()) {
      showFeedback('danger', 'Informe o diagnóstico fonoaudiológico e o código CID-10.');
      return;
    }
    setSavingForm(true);
    try {
      await createDiagnostic(patient.id, diagForm);
      showFeedback('success', 'Diagnóstico fonoaudiológico registrado com sucesso!');
      setShowNewDiag(false);
      setDiagForm({
        speechDiagnosis: '',
        cid10: '',
        therapeuticArea: 'Linguagem',
        sessionFrequency: '1x por semana',
        treatmentGoal: '',
        treatmentPlan: '',
      });
      loadDiagnostics();
    } catch (err) {
      showFeedback('danger', err.message || 'Erro ao salvar diagnóstico.');
    } finally {
      setSavingForm(false);
    }
  };

  // Salvar nova Avaliação
  const handleSaveEvaluation = async (e) => {
    e.preventDefault();
    if (!evalForm.resultados.trim()) {
      showFeedback('danger', 'Descreva os resultados da avaliação.');
      return;
    }
    setSavingForm(true);
    try {
      await createEvaluation(patient.id, evalForm);
      showFeedback('success', 'Avaliação clínica adicionada ao histórico!');
      setShowNewEval(false);
      setEvalForm({
        tipoAvaliacao: 'Evolução Clínica',
        dataAvaliacao: new Date().toISOString().split('T')[0],
        resultados: '',
        condutasPropostas: '',
        concluido: true,
      });
      loadEvaluations();
    } catch (err) {
      showFeedback('danger', err.message || 'Erro ao registrar avaliação.');
    } finally {
      setSavingForm(false);
    }
  };

  // Upload de Anexo
  const handleUploadAttachment = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      showFeedback('danger', 'Selecione um arquivo para anexar.');
      return;
    }
    setUploading(true);
    try {
      await uploadAttachment(patient.id, uploadFile, uploadDesc);
      showFeedback('success', 'Arquivo anexado ao prontuário com sucesso!');
      setShowUpload(false);
      setUploadFile(null);
      setUploadDesc('');
      loadAttachments();
    } catch (err) {
      showFeedback('danger', err.message || 'Erro ao fazer upload do arquivo.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen || !patient) return null;

  const isMinor = patient.age !== null && patient.age < 18;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto font-sans">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* ============================================================== */}
        {/* CABEÇALHO DO PRONTUÁRIO CLÍNICO                                 */}
        {/* ============================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#0284C7] text-white font-serif font-bold text-lg flex items-center justify-center shadow-md">
              {patient.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif text-[#172C3A] leading-tight">{patient.name}</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    patient.archived
                      ? 'bg-amber-100 text-amber-800'
                      : patient.statusType === 'pre-cadastro'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {patient.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <span>{patient.age !== null ? `${patient.age} anos` : 'Idade não informada'}</span>
                <span>•</span>
                <span>Nascimento: {formatDateBR(patient.dateOfBirth)}</span>
                <span>•</span>
                <span>{isMinor ? 'Menor de idade (LGPD)' : `CPF: ${patient.cpfPatient || 'Não informado'}`}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => onEdit(patient)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition shadow-2xs"
            >
              <Pencil size={13} /> Editar dados
            </button>
            <button
              type="button"
              onClick={() => onToggleArchive(patient)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition shadow-2xs ${
                patient.archived
                  ? 'border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                  : 'border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100'
              }`}
            >
              {patient.archived ? <RotateCcw size={13} /> : <Archive size={13} />}
              {patient.archived ? 'Restaurar' : 'Arquivar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition"
              aria-label="Fechar prontuário"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* FEEDBACK NOTICE */}
        {notice && (
          <div
            className={`px-5 py-2.5 text-xs font-bold flex items-center gap-2 border-b ${
              notice.tone === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {notice.tone === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{notice.message}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* NAVEGAÇÃO POR ABAS DO PRONTUÁRIO                               */}
        {/* ============================================================== */}
        <div className="flex items-center gap-1 px-5 border-b border-slate-200 bg-white overflow-x-auto scrollbar-none">
          {[
            { id: 'geral', label: 'Visão Geral & Cadastro', icon: User, count: null },
            { id: 'anamnese', label: 'Anamnese Clínica', icon: FileText, count: anamneses.length },
            { id: 'diagnostico', label: 'Diagnóstico & CID-10', icon: Stethoscope, count: diagnostics.length },
            { id: 'avaliacoes', label: 'Avaliações Clínicas', icon: Activity, count: evaluations.length },
            { id: 'anexos', label: 'Exames & Anexos', icon: UploadCloud, count: attachments.length },
          ].map(({ id, label, icon: Icon, count }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-3.5 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                  active
                    ? 'border-[#0284C7] text-[#0284C7] bg-sky-50/30'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon size={15} />
                <span>{label}</span>
                {count !== null && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                      active ? 'bg-[#0284C7] text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* CONTEÚDO DAS ABAS (ROLÁVEL)                                    */}
        {/* ============================================================== */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50/40 space-y-6">
          {/* ------------------------------------------------------------ */}
          {/* ABA 1: VISÃO GERAL & DADOS CADASTRAIS                        */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'geral' && (
            <div className="space-y-5">
              {/* Cartão de Identificação do Paciente */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <User size={16} className="text-[#0284C7]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#172C3A]">Dados do Paciente</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Nome Completo</span>
                    <span className="font-bold text-slate-800">{patient.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Data de Nascimento</span>
                    <span className="font-bold text-slate-800">{formatDateBR(patient.dateOfBirth)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Idade Calculada</span>
                    <span className="font-bold text-slate-800">{patient.age !== null ? `${patient.age} anos` : '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Sexo Biológico</span>
                    <span className="font-bold text-slate-800">{patient.sex || 'Não informado'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">CPF</span>
                    <span className="font-bold text-slate-800">
                      {isMinor ? (
                        <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Protegido (Menor)
                        </span>
                      ) : (
                        patient.cpfPatient || 'Não informado'
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Contato Principal</span>
                    <span className="font-bold text-slate-800">{formatPhone(patient.phone) || 'Não informado'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Status Clínico</span>
                    <span className="font-bold text-emerald-700">{patient.status}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">CID-10 Principal</span>
                    <span className="font-bold text-[#0284C7]">{patient.cid10 || 'Em investigação'}</span>
                  </div>
                </div>
              </div>

              {/* Cartão do Responsável Legal (Obrigatório pela Regra de Negócio para Menores) */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <HeartHandshake size={16} className="text-[#0284C7]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#172C3A]">
                      Responsável Legal (Pais ou Tutores)
                    </h3>
                  </div>
                  {isMinor && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900">
                      Obrigatório para menores de 18 anos
                    </span>
                  )}
                </div>

                {loadingGuardian ? (
                  <p className="text-xs text-slate-400 py-2">Consultando dados do responsável...</p>
                ) : guardian ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Nome do Responsável</span>
                      <span className="font-bold text-slate-800">{guardian.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Parentesco</span>
                      <span className="font-bold text-slate-800">{guardian.relationship}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">CPF do Responsável</span>
                      <span className="font-bold text-slate-800">{guardian.cpf}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Telefone / WhatsApp</span>
                      <span className="font-bold text-slate-800">{formatPhone(guardian.phoneNumber)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                    <AlertCircle size={15} className="text-slate-400 shrink-0" />
                    <span>
                      {isMinor
                        ? 'Nenhum responsável vinculado a este paciente menor. Clique em "Editar dados" para adicionar.'
                        : 'Paciente adulto (maior de 18 anos), sem necessidade de responsável legal cadastrado.'}
                    </span>
                  </div>
                )}
              </div>

              {/* Resumo do Prontuário Rápido */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => setActiveTab('anamnese')}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#0284C7] hover:bg-sky-50/20 transition cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-[#0284C7]">
                    <FileText size={18} />
                    <span className="text-xs font-bold">{anamneses.length}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">Anamneses Registradas</h4>
                  <p className="text-[11px] text-slate-500">Histórico de queixa, linguagem e desenvolvimento.</p>
                </div>

                <div
                  onClick={() => setActiveTab('diagnostico')}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#0284C7] hover:bg-sky-50/20 transition cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-[#0284C7]">
                    <Stethoscope size={18} />
                    <span className="text-xs font-bold">{diagnostics.length}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">Diagnóstico & Metas</h4>
                  <p className="text-[11px] text-slate-500">CID-10, área terapêutica e plano de conduta.</p>
                </div>

                <div
                  onClick={() => setActiveTab('anexos')}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#0284C7] hover:bg-sky-50/20 transition cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-[#0284C7]">
                    <UploadCloud size={18} />
                    <span className="text-xs font-bold">{attachments.length}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">Laudos e Anexos</h4>
                  <p className="text-[11px] text-slate-500">Arquivos clínicos, PDFs e gravações de áudio.</p>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* ABA 2: ANAMNESE CLÍNICA                                      */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'anamnese' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-serif text-[#172C3A]">Anamnese Fonoaudiológica</h3>
                  <p className="text-xs text-slate-500">
                    Histórico clínico do paciente, desenvolvimento linguístico e histórico familiar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewAnamnese(!showNewAnamnese)}
                  className="px-3 py-1.5 rounded-xl bg-[#0284C7] text-white text-xs font-bold hover:bg-sky-700 flex items-center gap-1.5 transition shadow-xs"
                >
                  <Plus size={14} /> Nova Anamnese
                </button>
              </div>

              {/* Formulário de Registro de Nova Anamnese */}
              {showNewAnamnese && (
                <form
                  onSubmit={handleSaveAnamnese}
                  className="p-4 rounded-xl border-2 border-sky-200 bg-sky-50/30 space-y-3"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
                    Registrar Nova Anamnese Clínica
                  </h4>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Queixa Principal *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Ex: Dificuldade na articulação do fonema /r/ e trocas na fala relatadas pela escola..."
                      value={anamneseForm.mainComplaint}
                      onChange={(e) => setAnamneseForm({ ...anamneseForm, mainComplaint: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Início dos Sintomas</label>
                      <input
                        type="text"
                        placeholder="Ex: Observado por volta dos 4 anos de idade"
                        value={anamneseForm.symptomOnset}
                        onChange={(e) => setAnamneseForm({ ...anamneseForm, symptomOnset: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-[#0284C7]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Histórico Familiar</label>
                      <input
                        type="text"
                        placeholder="Ex: Tio paterno apresentou gagueira na infância"
                        value={anamneseForm.familyHistory}
                        onChange={(e) => setAnamneseForm({ ...anamneseForm, familyHistory: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-[#0284C7]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Desenvolvimento da Linguagem</label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Primeiras palavras aos 14 meses. Frases simples aos 2 anos e meio..."
                      value={anamneseForm.languageDevelopment}
                      onChange={(e) => setAnamneseForm({ ...anamneseForm, languageDevelopment: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Observações Adicionais</label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Paciente demonstra boa audição, interativo, boa compreensão de ordens complexas..."
                      value={anamneseForm.additionalObservations}
                      onChange={(e) => setAnamneseForm({ ...anamneseForm, additionalObservations: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNewAnamnese(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={savingForm}
                      className="px-4 py-1.5 rounded-lg bg-[#0284C7] text-white text-xs font-bold hover:bg-sky-700 disabled:opacity-60"
                    >
                      {savingForm ? 'Salvando...' : 'Salvar no Prontuário'}
                    </button>
                  </div>
                </form>
              )}

              {/* Lista de Anamneses */}
              {loadingAnamnese ? (
                <p className="text-xs text-slate-400 py-4 text-center">Carregando histórico de anamneses...</p>
              ) : anamneses.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-dashed border-slate-300 bg-white space-y-2">
                  <FileText size={32} className="mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-700">Nenhuma anamnese registrada ainda</p>
                  <p className="text-[11px] text-slate-500">
                    Clique no botão "Nova Anamnese" acima para registrar a primeira avaliação diagnóstica.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {anamneses.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-bold text-[#0284C7] flex items-center gap-1.5">
                          <FileCheck2 size={15} /> Registro Clínico #{index + 1}
                        </span>
                        <span className="text-[10px] text-slate-400">Prontuário Oficial FonoSync</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="font-bold text-slate-500 block text-[11px]">Queixa Principal:</span>
                          <p className="font-medium text-slate-900 bg-slate-50 p-2 rounded-md border border-slate-100">
                            {item.mainComplaint}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <span className="font-bold text-slate-500 block text-[11px]">Início dos Sintomas:</span>
                            <p className="text-slate-800">{item.symptomOnset || 'Não informado'}</p>
                          </div>
                          <div>
                            <span className="font-bold text-slate-500 block text-[11px]">Histórico Familiar:</span>
                            <p className="text-slate-800">{item.familyHistory || 'Sem relato familiar'}</p>
                          </div>
                        </div>

                        {item.languageDevelopment && (
                          <div>
                            <span className="font-bold text-slate-500 block text-[11px]">
                              Desenvolvimento da Linguagem:
                            </span>
                            <p className="text-slate-800">{item.languageDevelopment}</p>
                          </div>
                        )}

                        {item.additionalObservations && (
                          <div>
                            <span className="font-bold text-slate-500 block text-[11px]">Observações Adicionais:</span>
                            <p className="text-slate-800">{item.additionalObservations}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* ABA 3: DIAGNÓSTICO FONOAUDIOLÓGICO & CID-10                 */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'diagnostico' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-serif text-[#172C3A]">Diagnóstico Clínico & CID-10</h3>
                  <p className="text-xs text-slate-500">
                    Definição diagnóstica, conduta terapêutica e plano de metas do paciente.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewDiag(!showNewDiag)}
                  className="px-3 py-1.5 rounded-xl bg-[#0284C7] text-white text-xs font-bold hover:bg-sky-700 flex items-center gap-1.5 transition shadow-xs"
                >
                  <Plus size={14} /> Novo Diagnóstico
                </button>
              </div>

              {/* Formulário de Registro de Diagnóstico */}
              {showNewDiag && (
                <form
                  onSubmit={handleSaveDiagnostic}
                  className="p-4 rounded-xl border-2 border-sky-200 bg-sky-50/30 space-y-3"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
                    Definir Diagnóstico Fonoaudiológico
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Diagnóstico Fonoaudiológico *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Transtorno dos Sons da Fala (Disfonia / Desvio Fonológico)"
                        value={diagForm.speechDiagnosis}
                        onChange={(e) => setDiagForm({ ...diagForm, speechDiagnosis: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-[#0284C7]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Código CID-10 *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: F80.0"
                        value={diagForm.cid10}
                        onChange={(e) => setDiagForm({ ...diagForm, cid10: e.target.value.toUpperCase() })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-mono font-bold outline-none focus:ring-2 focus:ring-[#0284C7]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Área Terapêutica</label>
                      <select
                        value={diagForm.therapeuticArea}
                        onChange={(e) => setDiagForm({ ...diagForm, therapeuticArea: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-[#0284C7]"
                      >
                        <option value="Linguagem">Linguagem e Fala</option>
                        <option value="Motricidade">Motricidade Orofacial</option>
                        <option value="Voz">Voz</option>
                        <option value="Audiologia">Audiologia</option>
                        <option value="Fluência">Fluência / Gagueira</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Frequência das Sessões</label>
                      <select
                        value={diagForm.sessionFrequency}
                        onChange={(e) => setDiagForm({ ...diagForm, sessionFrequency: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-[#0284C7]"
                      >
                        <option value="1x por semana">1x por semana (50 min)</option>
                        <option value="2x por semana">2x por semana (50 min)</option>
                        <option value="Quinzenal">Quinzenal</option>
                        <option value="Mensal">Acompanhamento Mensal</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Objetivo do Tratamento</label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Automatização do fonema /r/ em palavras e conversação espontânea; adequação do tônus lingual..."
                      value={diagForm.treatmentGoal}
                      onChange={(e) => setDiagForm({ ...diagForm, treatmentGoal: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Conduta Terapêutica Planejada</label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Exercícios miofuncionais, bombardeamento auditivo e jogos fonéticos gamificados no FonoSync..."
                      value={diagForm.treatmentPlan}
                      onChange={(e) => setDiagForm({ ...diagForm, treatmentPlan: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNewDiag(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={savingForm}
                      className="px-4 py-1.5 rounded-lg bg-[#0284C7] text-white text-xs font-bold hover:bg-sky-700 disabled:opacity-60"
                    >
                      {savingForm ? 'Gravando...' : 'Salvar Diagnóstico'}
                    </button>
                  </div>
                </form>
              )}

              {/* Lista de Diagnósticos */}
              {loadingDiag ? (
                <p className="text-xs text-slate-400 py-4 text-center">Buscando diagnósticos cadastrados...</p>
              ) : diagnostics.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-dashed border-slate-300 bg-white space-y-2">
                  <Stethoscope size={32} className="mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-700">Nenhum diagnóstico registrado</p>
                  <p className="text-[11px] text-slate-500">
                    Defina o diagnóstico fonoaudiológico e o CID-10 clicando no botão acima.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {diagnostics.map((diag, index) => (
                    <div
                      key={diag.id || index}
                      className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-sky-100 text-[#0284C7] font-mono font-bold text-xs">
                            CID-10: {diag.cid10}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{diag.speechDiagnosis}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md font-semibold">
                          {diag.therapeuticArea} • {diag.sessionFrequency}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                          <span className="font-bold text-slate-500 block text-[11px]">Objetivo do Tratamento:</span>
                          <p className="text-slate-800">{diag.treatmentGoal || 'Em planejamento'}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                          <span className="font-bold text-slate-500 block text-[11px]">Conduta Terapêutica:</span>
                          <p className="text-slate-800">{diag.treatmentPlan || 'Seguir protocolo padrão'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* ABA 4: AVALIAÇÕES CLÍNICAS                                   */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'avaliacoes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-serif text-[#172C3A]">Avaliações & Evoluções Clínicas</h3>
                  <p className="text-xs text-slate-500">
                    Acompanhamento periódico de sessões, triagem e evolução do paciente.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewEval(!showNewEval)}
                  className="px-3 py-1.5 rounded-xl bg-[#0284C7] text-white text-xs font-bold hover:bg-sky-700 flex items-center gap-1.5 transition shadow-xs"
                >
                  <Plus size={14} /> Nova Avaliação
                </button>
              </div>

              {/* Form Nova Avaliação */}
              {showNewEval && (
                <form
                  onSubmit={handleSaveEvaluation}
                  className="p-4 rounded-xl border-2 border-sky-200 bg-sky-50/30 space-y-3"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
                    Adicionar Nova Avaliação Clínica
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Tipo de Avaliação *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Triagem Inicial Gamificada, Avaliação Vocálica..."
                        value={evalForm.tipoAvaliacao}
                        onChange={(e) => setEvalForm({ ...evalForm, tipoAvaliacao: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-[#0284C7]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Data da Avaliação *</label>
                      <input
                        type="date"
                        required
                        value={evalForm.dataAvaliacao}
                        onChange={(e) => setEvalForm({ ...evalForm, dataAvaliacao: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-[#0284C7]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Resultados Observados *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Ex: Identificada distorção fonética no encontro consonantal /pl/ e /pr/. Boa receptividade aos jogos..."
                      value={evalForm.resultados}
                      onChange={(e) => setEvalForm({ ...evalForm, resultados: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Conduta Proposta</label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Iniciar protocolo de exercícios para fonemas plosivos e linguodentais..."
                      value={evalForm.condutasPropostas}
                      onChange={(e) => setEvalForm({ ...evalForm, condutasPropostas: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNewEval(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={savingForm}
                      className="px-4 py-1.5 rounded-lg bg-[#0284C7] text-white text-xs font-bold hover:bg-sky-700 disabled:opacity-60"
                    >
                      {savingForm ? 'Registrando...' : 'Registrar Avaliação'}
                    </button>
                  </div>
                </form>
              )}

              {/* Lista de Avaliações */}
              {loadingEval ? (
                <p className="text-xs text-slate-400 py-4 text-center">Buscando avaliações...</p>
              ) : evaluations.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-dashed border-slate-300 bg-white space-y-2">
                  <Activity size={32} className="mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-700">Nenhuma avaliação clínica registrada</p>
                  <p className="text-[11px] text-slate-500">
                    Registre as sessões de avaliação do paciente para acompanhar o progresso.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {evaluations.map((ev, index) => (
                    <div key={ev.id || index} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Activity size={15} className="text-[#0284C7]" />
                          {ev.tipoAvaliacao}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Calendar size={12} /> {formatDateBR(ev.dataAvaliacao)}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Concluído
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div>
                          <span className="font-bold text-slate-500 block text-[11px]">Resultados:</span>
                          <p className="text-slate-800">{ev.resultados}</p>
                        </div>
                        {ev.condutasPropostas && (
                          <div>
                            <span className="font-bold text-slate-500 block text-[11px]">Conduta Proposta:</span>
                            <p className="text-slate-800">{ev.condutasPropostas}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* ABA 5: EXAMES & ANEXOS CLÍNICOS                              */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'anexos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-serif text-[#172C3A]">Laudos, Exames & Arquivos Anexos</h3>
                  <p className="text-xs text-slate-500">
                    Armazenamento seguro de exames audiológicos, laudos médicos, PDFs e gravações de áudio.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUpload(!showUpload)}
                  className="px-3 py-1.5 rounded-xl bg-[#0284C7] text-white text-xs font-bold hover:bg-sky-700 flex items-center gap-1.5 transition shadow-xs"
                >
                  <UploadCloud size={15} /> Fazer Upload de Anexo
                </button>
              </div>

              {/* Formulário de Upload */}
              {showUpload && (
                <form
                  onSubmit={handleUploadAttachment}
                  className="p-4 rounded-xl border-2 border-sky-200 bg-sky-50/30 space-y-3"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
                    Enviar Novo Documento ou Exame
                  </h4>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Selecione o Arquivo *</label>
                    <input
                      type="file"
                      required
                      accept=".pdf,.png,.jpg,.jpeg,.mp3,.wav,.ogg"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-sky-100 file:text-sky-800 hover:file:bg-sky-200 cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-400">Suporta PDFs, imagens de exames e arquivos de áudio.</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Descrição do Arquivo (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ex: Audiometria tonal e vocal realizada em out/2026..."
                      value={uploadDesc}
                      onChange={(e) => setUploadDesc(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowUpload(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="px-4 py-1.5 rounded-lg bg-[#0284C7] text-white text-xs font-bold hover:bg-sky-700 disabled:opacity-60 flex items-center gap-1.5"
                    >
                      {uploading ? (
                        'Enviando arquivo...'
                      ) : (
                        <>
                          <UploadCloud size={14} /> Enviar Arquivo
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Lista de Anexos */}
              {loadingAtt ? (
                <p className="text-xs text-slate-400 py-4 text-center">Buscando anexos do paciente...</p>
              ) : attachments.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-dashed border-slate-300 bg-white space-y-2">
                  <UploadCloud size={32} className="mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-700">Nenhum anexo encontrado</p>
                  <p className="text-[11px] text-slate-500">
                    Faça o upload de laudos, exames ou gravações clicando no botão acima.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-start justify-between gap-3 hover:border-slate-300 transition"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="p-2 rounded-lg bg-sky-50 text-[#0284C7] shrink-0">
                          <FileText size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate" title={att.fileName}>
                            {att.fileName}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{att.description || 'Sem descrição'}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                            <span>{formatDateBR(att.attachmentDate)}</span>
                            <span>•</span>
                            <span>{formatBytes(att.fileSize)}</span>
                          </div>
                        </div>
                      </div>

                      <a
                        href={getAttachmentDownloadUrl(att.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1 shrink-0"
                        title="Baixar ou visualizar arquivo"
                      >
                        <Download size={13} />
                        <span className="hidden sm:inline">Baixar</span>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* RODAPÉ DO MODAL COM AÇÕES RÁPIDAS                              */}
        {/* ============================================================== */}
        <div className="p-4 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onDelete(patient)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Trash2 size={14} /> Excluir Paciente
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#0284C7] text-white text-xs font-bold hover:bg-sky-700 transition cursor-pointer shadow-xs"
            >
              Fechar Prontuário
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
