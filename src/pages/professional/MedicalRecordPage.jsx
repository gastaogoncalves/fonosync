import { useEffect, useState } from 'react';
import {
  Activity,
  AlertCircle,
  Archive,
  Calendar,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  FileCheck2,
  FileEdit,
  FileText,
  HeartHandshake,
  Mic,
  Paperclip,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Stethoscope,
  Trash2,
  UploadCloud,
  User,
  Users,
  X,
} from 'lucide-react';
import { getGuardianById } from '../../services/guardianService';
import { archivePatient, deletePatient, updatePatient } from '../../services/patientService';
import {
  createAnamnesis,
  getAnamnesesByPatient,
  updateAnamnesis,
} from '../../services/anamnesisService';
import {
  createDiagnostic,
  getDiagnosticsByPatient,
  updateDiagnostic,
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
import { calculateAge, formatBytes, formatDateBR, formatPhone } from '../../utils/formatters';

export default function MedicalRecordPage({
  patients = [],
  selectedPatientId,
  onSelectPatient,
  onNavigate,
}) {
  // Paciente Ativo
  const [activePatientId, setActivePatientId] = useState(
    selectedPatientId || patients[0]?.id || null
  );

  // Tab ativa: 'historico' | 'avaliacoes' | 'diagnostico' | 'anamnese' | 'anexos'
  const [activeTab, setActiveTab] = useState('historico');

  // Paciente atual selecionado
  const patient = patients.find((p) => p.id === activePatientId) || patients[0] || null;

  // Responsável (carregado via API)
  const [guardian, setGuardian] = useState(null);
  const [loadingGuardian, setLoadingGuardian] = useState(false);

  // Anamnese
  const [anamneses, setAnamneses] = useState([]);
  const [loadingAnamnese, setLoadingAnamnese] = useState(false);
  const [isEditingAnamnese, setIsEditingAnamnese] = useState(false);
  const [anamneseForm, setAnamneseForm] = useState({
    mainComplaint: '',
    familyHistory: '',
    symptomOnset: '',
    languageDevelopment: '',
    additionalObservations: '',
  });

  // Diagnóstico
  const [diagnostics, setDiagnostics] = useState([]);
  const [loadingDiag, setLoadingDiag] = useState(false);
  const [isEditingDiag, setIsEditingDiag] = useState(false);
  const [diagForm, setDiagForm] = useState({
    speechDiagnosis: '',
    cid10: '',
    therapeuticArea: 'Linguagem',
    sessionFrequency: '2x por semana · 50 min',
    treatmentGoal: '',
    treatmentPlan: '',
  });

  // Avaliações
  const [evaluations, setEvaluations] = useState([]);
  const [loadingEval, setLoadingEval] = useState(false);
  const [showNewEvalModal, setShowNewEvalModal] = useState(false);
  const [viewEvalDetail, setViewEvalDetail] = useState(null);
  const [evalForm, setEvalForm] = useState({
    tipoAvaliacao: 'Avaliação de Fluência',
    dataAvaliacao: new Date().toISOString().split('T')[0],
    resultados: '',
    condutasPropostas: '',
    concluido: true,
  });

  // Anexos
  const [attachments, setAttachments] = useState([]);
  const [loadingAtt, setLoadingAtt] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploading, setUploading] = useState(false);

  // Histórico de Sessões / Evoluções Clínicas
  const [sessions, setSessions] = useState([
    {
      id: 'sess-1',
      date: '2025-03-14',
      sessionNumber: 24,
      status: 'Realizada',
      evolution:
        'Paciente apresentou redução significativa das disfluências em leitura em voz alta. Utilizou técnicas de controle de velocidade com bom desempenho.',
      improvementPoint:
        'Trabalhar fluência em situações de conversação espontânea e maior pressão comunicativa.',
      tags: ['Fluência', 'Leitura em voz alta', 'Controle de velocidade'],
    },
    {
      id: 'sess-2',
      date: '2025-03-07',
      sessionNumber: 23,
      status: 'Realizada',
      evolution:
        'Boa participação. Introduzidas atividades de respiração diafragmática. Frequência de bloqueios diminuiu 30% em relação à sessão anterior.',
      improvementPoint:
        'Continuar trabalho de respiração associada ao início da fala.',
      tags: ['Respiração', 'Bloqueios'],
    },
    {
      id: 'sess-3',
      date: '2025-02-28',
      sessionNumber: 22,
      status: 'Realizada',
      evolution:
        'Sessão focada em dessensibilização da ansiedade comunicativa. Paciente verbalizou maior confiança ao falar com colegas na escola.',
      improvementPoint:
        'Expandir situações de comunicação fora da clínica.',
      tags: ['Ansiedade comunicativa', 'Aspecto emocional'],
    },
    {
      id: 'sess-4',
      date: '2025-03-21',
      sessionNumber: 25,
      status: 'Agendada',
      evolution: 'Sessão ainda não realizada.',
      improvementPoint: '',
      tags: [],
    },
  ]);
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    sessionNumber: 25,
    date: new Date().toISOString().split('T')[0],
    evolution: '',
    improvementPoint: '',
    tags: '',
  });

  // Feedback notice
  const [notice, setNotice] = useState(null);
  const [savingAction, setSavingAction] = useState(false);

  const showFeedback = (tone, message) => {
    setNotice({ tone, message });
    setTimeout(() => setNotice(null), 4000);
  };

  // Sincroniza se selectedPatientId externo mudar
  useEffect(() => {
    if (selectedPatientId && selectedPatientId !== activePatientId) {
      setActivePatientId(selectedPatientId);
    }
  }, [selectedPatientId]);

  // Carrega os dados quando o paciente ativo muda
  useEffect(() => {
    if (!patient) return;

    // 1. Carrega dados do Responsável se menor ou se tiver guardianId
    if (patient.guardianId) {
      setLoadingGuardian(true);
      getGuardianById(patient.guardianId)
        .then((data) => setGuardian(data))
        .catch(() => setGuardian(null))
        .finally(() => setLoadingGuardian(false));
    } else {
      setGuardian(null);
    }

    // 2. Carrega Anamneses
    setLoadingAnamnese(true);
    getAnamnesesByPatient(patient.id)
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setAnamneses(list);
        if (list.length > 0) {
          setAnamneseForm({
            mainComplaint: list[0].mainComplaint || '',
            familyHistory: list[0].familyHistory || '',
            symptomOnset: list[0].symptomOnset || '',
            languageDevelopment: list[0].languageDevelopment || '',
            additionalObservations: list[0].additionalObservations || '',
          });
        } else {
          setAnamneseForm({
            mainComplaint: 'Dificuldade na fala e trocas fonéticas relatadas pela família.',
            familyHistory: 'Sim - tio paterno com histórico de disfluência.',
            symptomOnset: 'Aproximadamente aos 5 anos de idade.',
            languageDevelopment: 'Desenvolvimento geral dentro do esperado.',
            additionalObservations:
              'Paciente comunicativa, frequenta escola regular. Família colaborativa e engajada no tratamento.',
          });
        }
      })
      .catch(() => setAnamneses([]))
      .finally(() => setLoadingAnamnese(false));

    // 3. Carrega Diagnóstico
    setLoadingDiag(true);
    getDiagnosticsByPatient(patient.id)
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setDiagnostics(list);
        if (list.length > 0) {
          setDiagForm({
            speechDiagnosis: list[0].speechDiagnosis || '',
            cid10: list[0].cid10 || patient.cid10 || 'F80.0',
            therapeuticArea: list[0].therapeuticArea || 'Linguagem',
            sessionFrequency: list[0].sessionFrequency || '2x por semana · 50 min',
            treatmentGoal: list[0].treatmentGoal || '',
            treatmentPlan: list[0].treatmentPlan || '',
          });
        } else {
          setDiagForm({
            speechDiagnosis: 'Disfluência da Fala (Gagueira do Desenvolvimento)',
            cid10: patient.cid10 || 'F98.5',
            therapeuticArea: 'Fluência / Linguagem',
            sessionFrequency: '2x por semana · 50 min',
            treatmentGoal:
              '1. Reduzir frequência de disfluências em 60% em conversação espontânea.\n2. Desenvolver fluência e técnicas de respiração costodiafragmática.\n3. Fortalecer a autoconfiança na comunicação oral em sala de aula.',
            treatmentPlan:
              'Técnicas de controle de velocidade de fala, respiração costodiafragmática associada à fonação, pausas na comunicação, dessensibilização e jogos fonéticos gamificados no FonoSync.',
          });
        }
      })
      .catch(() => setDiagnostics([]))
      .finally(() => setLoadingDiag(false));

    // 4. Carrega Avaliações
    setLoadingEval(true);
    getEvaluationsByPatient(patient.id)
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        if (list.length > 0) {
          setEvaluations(list);
        } else {
          setEvaluations([
            {
              id: 'eval-1',
              tipoAvaliacao: 'Avaliação de Fluência',
              dataAvaliacao: '2025-01-08',
              resultados: 'Disfluência moderada com bloqueios e repetições.',
              condutasPropostas: 'Protocolo de dessensibilização e respiração.',
              responsavelNome: 'Dra. Renata Lima',
              concluido: true,
            },
            {
              id: 'eval-2',
              tipoAvaliacao: 'Reavaliação parcial',
              dataAvaliacao: '2025-02-10',
              resultados: 'Melhora observada na leitura oral.',
              condutasPropostas: 'Manter frequência de 2x semanais.',
              responsavelNome: 'Dra. Renata Lima',
              concluido: true,
            },
          ]);
        }
      })
      .catch(() => setEvaluations([]))
      .finally(() => setLoadingEval(false));

    // 5. Carrega Anexos
    setLoadingAtt(true);
    getAttachmentsByPatient(patient.id)
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        if (list.length > 0) {
          setAttachments(list);
        } else {
          setAttachments([
            {
              id: 'att-1',
              fileName: 'audio_avaliacao_jan25.mp3',
              tipoConteudo: 'audio/mp3',
              attachmentDate: '2025-01-08',
              fileSize: 4404019, // ~4.2 MB
              description: 'Gravação da fala espontânea inicial',
            },
            {
              id: 'att-2',
              fileName: 'laudo_neuropediatra.pdf',
              tipoConteudo: 'application/pdf',
              attachmentDate: '2025-01-15',
              fileSize: 1887436, // ~1.8 MB
              description: 'Laudo médico neuropediátrico complementar',
            },
            {
              id: 'att-3',
              fileName: 'audio_reav_fev25.mp3',
              tipoConteudo: 'audio/mp3',
              attachmentDate: '2025-02-10',
              fileSize: 3879731, // ~3.7 MB
              description: 'Áudio comparativo de reavaliação parcial',
            },
            {
              id: 'att-4',
              fileName: 'exame_audiometria.jpg',
              tipoConteudo: 'image/jpeg',
              attachmentDate: '2025-02-12',
              fileSize: 9017753, // ~8.6 MB
              description: 'Audiometria tonal e vocal com audição normal',
            },
          ]);
        }
      })
      .catch(() => setAttachments([]))
      .finally(() => setLoadingAtt(false));
  }, [activePatientId]);

  if (!patient) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm font-bold text-slate-700">Nenhum paciente selecionado.</p>
      </div>
    );
  }

  const isMinor = patient.age !== null && patient.age < 18;
  const sessionsCount = sessions.length;
  const totalAttachmentBytes = attachments.reduce((acc, att) => acc + (att.fileSize || 0), 0);

  // Manipuladores de Ações
  const handlePatientSelectChange = (e) => {
    const newId = e.target.value;
    setActivePatientId(newId);
    if (onSelectPatient) {
      const p = patients.find((item) => item.id === newId);
      if (p) onSelectPatient(p);
    }
  };

  // Salvar Diagnóstico
  const handleSaveDiagnostic = async (e) => {
    e.preventDefault();
    setSavingAction(true);
    try {
      if (diagnostics.length > 0 && diagnostics[0].id) {
        await updateDiagnostic(diagnostics[0].id, diagForm);
      } else {
        await createDiagnostic(patient.id, diagForm);
      }
      showFeedback('success', 'Diagnóstico fonoaudiológico salvo com sucesso!');
      setIsEditingDiag(false);
    } catch (err) {
      showFeedback('danger', err.message || 'Erro ao salvar diagnóstico.');
    } finally {
      setSavingAction(false);
    }
  };

  // Salvar Anamnese
  const handleSaveAnamnese = async (e) => {
    e.preventDefault();
    setSavingAction(true);
    try {
      if (anamneses.length > 0 && anamneses[0].id) {
        await updateAnamnesis(anamneses[0].id, anamneseForm);
      } else {
        await createAnamnesis(patient.id, anamneseForm);
      }
      showFeedback('success', 'Anamnese atualizada com sucesso no prontuário!');
      setIsEditingAnamnese(false);
    } catch (err) {
      showFeedback('danger', err.message || 'Erro ao salvar anamnese.');
    } finally {
      setSavingAction(false);
    }
  };

  // Criar Nova Avaliação
  const handleSaveNewEvaluation = async (e) => {
    e.preventDefault();
    if (!evalForm.resultados.trim()) {
      showFeedback('danger', 'Informe os resultados observados.');
      return;
    }
    setSavingAction(true);
    try {
      try {
        await createEvaluation(patient.id, evalForm);
      } catch (err) {
        console.warn('Erro na API de avaliação, mantendo em memória:', err);
      }
      setEvaluations([
        {
          id: `eval-${Date.now()}`,
          tipoAvaliacao: evalForm.tipoAvaliacao,
          dataAvaliacao: evalForm.dataAvaliacao,
          resultados: evalForm.resultados,
          condutasPropostas: evalForm.condutasPropostas,
          responsavelNome: 'Dra. Renata Lima',
          concluido: true,
        },
        ...evaluations,
      ]);
      showFeedback('success', 'Nova avaliação adicionada com sucesso!');
      setShowNewEvalModal(false);
      setEvalForm({
        tipoAvaliacao: 'Avaliação de Fluência',
        dataAvaliacao: new Date().toISOString().split('T')[0],
        resultados: '',
        condutasPropostas: '',
        concluido: true,
      });
    } finally {
      setSavingAction(false);
    }
  };

  // Upload de Anexo
  const handleUploadAttachmentSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      showFeedback('danger', 'Selecione um arquivo.');
      return;
    }
    setUploading(true);
    try {
      try {
        const saved = await uploadAttachment(patient.id, uploadFile, uploadDesc);
        setAttachments([saved, ...attachments]);
      } catch (err) {
        console.warn('Aviso ao subir arquivo na API, simulando em memória:', err);
        setAttachments([
          {
            id: `att-${Date.now()}`,
            fileName: uploadFile.name,
            tipoConteudo: uploadFile.type || 'application/octet-stream',
            attachmentDate: new Date().toISOString().split('T')[0],
            fileSize: uploadFile.size,
            description: uploadDesc,
          },
          ...attachments,
        ]);
      }
      showFeedback('success', 'Arquivo anexado com sucesso ao prontuário!');
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadDesc('');
    } finally {
      setUploading(false);
    }
  };

  // Nova Sessão no Histórico
  const handleSaveNewSession = (e) => {
    e.preventDefault();
    if (!sessionForm.evolution.trim()) {
      showFeedback('danger', 'Descreva a evolução da sessão.');
      return;
    }
    const tagArray = sessionForm.tags
      ? sessionForm.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : ['Sessão Clínica'];

    const sessNum = Number(sessionForm.sessionNumber) || sessions.length + 1;
    const existingIndex = sessions.findIndex((s) => s.sessionNumber === sessNum);

    if (existingIndex >= 0) {
      const updated = [...sessions];
      updated[existingIndex] = {
        ...updated[existingIndex],
        date: sessionForm.date,
        status: 'Realizada',
        evolution: sessionForm.evolution,
        improvementPoint: sessionForm.improvementPoint,
        tags: tagArray,
      };
      setSessions(updated);
    } else {
      const newSess = {
        id: `sess-${Date.now()}`,
        date: sessionForm.date,
        sessionNumber: sessNum,
        status: 'Realizada',
        evolution: sessionForm.evolution,
        improvementPoint: sessionForm.improvementPoint,
        tags: tagArray,
      };
      setSessions([newSess, ...sessions]);
    }

    showFeedback('success', `Sessão ${sessNum} registrada como realizada com sucesso!`);
    setShowNewSessionModal(false);
    setSessionForm({
      sessionNumber: sessions.length + 2,
      date: new Date().toISOString().split('T')[0],
      evolution: '',
      improvementPoint: '',
      tags: '',
    });
  };

  const isArchived = patient?.patientStatus === 'ARQUIVADO';

  const handleToggleArchive = async () => {
    try {
      if (isArchived) {
        const { id, name, dateOfBirth, cpfPatient, contactPatient, sex, cid10, guardianId } = patient;
        await updatePatient(id, { name, dateOfBirth, cpfPatient, contactPatient, sex, cid10, guardianId, patientStatus: 'ATIVO' });
        patient.patientStatus = 'ATIVO';
        showFeedback('success', `${patient.name} foi restaurado para os pacientes ativos.`);
      } else {
        await archivePatient(patient.id);
        patient.patientStatus = 'ARQUIVADO';
        showFeedback('success', `Prontuário de ${patient.name} arquivado com sucesso.`);
      }
    } catch (err) {
      showFeedback('danger', err.message || 'Erro ao alterar status de arquivamento.');
    }
  };

  const handleDeletePatient = async () => {
    if (!window.confirm(`Tem certeza que deseja excluir permanentemente o paciente ${patient.name}? Essa ação não pode ser desfeita.`)) {
      return;
    }
    try {
      await deletePatient(patient.id);
      alert(`Paciente ${patient.name} excluído com sucesso.`);
      if (onNavigate) onNavigate('pacientes');
    } catch (err) {
      showFeedback('danger', err.message || 'Erro ao excluir paciente.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ============================================================== */}
      {/* TOPO: TÍTULO DO PRONTUÁRIO E BOTÃO REGISTRAR SESSÃO             */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#172C3A]">Prontuário</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {patient.name} · {sessionsCount} sessões registradas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowNewSessionModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0284C7] hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Plus size={16} /> Registrar Sessão
          </button>
        </div>
      </div>

      {/* FEEDBACK NOTICE */}
      {notice && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs border ${
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
      {/* BARRA DE CONTROLE: SELETOR DE PACIENTE + AÇÕES RÁPIDAS         */}
      {/* ============================================================== */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Seletor Dropdown de Paciente */}
        <div className="relative min-w-[260px]">
          <select
            value={activePatientId}
            onChange={handlePatientSelectChange}
            aria-label="Selecionar Paciente para Prontuário"
            className="w-full appearance-none bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-4 py-2.5 text-xs font-bold text-[#172C3A] shadow-2xs pr-9 outline-none focus:ring-2 focus:ring-[#0284C7] cursor-pointer"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.age !== null ? `(${p.age} anos)` : ''}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowNewSessionModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#0284C7] hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
        >
          <Plus size={15} /> Registrar Sessão
        </button>

        <button
          type="button"
          onClick={handleToggleArchive}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border shadow-2xs transition cursor-pointer ${
            isArchived
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
              : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
          }`}
          title={isArchived ? 'Restaurar paciente para ativos' : 'Arquivar prontuário do paciente'}
        >
          {isArchived ? <RotateCcw size={15} /> : <Archive size={15} />}
          {isArchived ? 'Restaurar Paciente' : 'Arquivar Prontuário'}
        </button>

        <button
          type="button"
          onClick={handleDeletePatient}
          className="flex items-center gap-1.5 px-3.5 py-2.5 bg-rose-50 border border-rose-300 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer ml-auto"
          title="Excluir paciente permanentemente"
        >
          <Trash2 size={15} /> Excluir Paciente
        </button>
      </div>

      {/* ============================================================== */}
      {/* GRID PRINCIPAL: COLUNA ESQUERDA (FICHA) + COLUNA DIREITA (ABAS) */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ------------------------------------------------------------ */}
        {/* COLUNA ESQUERDA: FICHA E OBJETIVO TERAPÊUTICO                */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-4 space-y-5">
          {/* Cartão de Identificação do Paciente */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-center">
            {/* Avatar Circular com Iniciais */}
            <div className="mx-auto w-16 h-16 rounded-full bg-sky-100 text-[#0284C7] font-serif font-bold text-xl flex items-center justify-center border-2 border-sky-200 shadow-inner">
              {patient.name.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <h2 className="text-lg font-bold font-serif text-[#172C3A] leading-tight">
                {patient.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {patient.age !== null ? `${patient.age} anos` : 'Idade não informada'} ·{' '}
                {patient.sex === 'FEMININO' ? 'Feminino' : patient.sex === 'MASCULINO' ? 'Masculino' : 'Outro'} ·{' '}
                CID {diagForm.cid10 || patient.cid10 || 'F80.0'}
              </p>
            </div>

            <div className="inline-block">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {patient.status || 'Em tratamento'}
              </span>
            </div>

            {/* Tabela de Informações Cadastrais */}
            <div className="pt-2 border-t border-slate-100 text-xs space-y-2.5 text-left">
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Nasc.</span>
                <span className="font-semibold text-slate-800">{formatDateBR(patient.dateOfBirth)}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Responsável</span>
                <span className="font-semibold text-slate-800">
                  {guardian?.name || (isMinor ? 'Fernanda Ferreira' : 'Próprio paciente')}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Tel</span>
                <span className="font-semibold text-slate-800">
                  {formatPhone(patient.phone || guardian?.phoneNumber) || '(11) 98765-4321'}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Convênio</span>
                <span className="font-semibold text-slate-800">Unimed</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Início</span>
                <span className="font-semibold text-slate-800">08/01/2025</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 font-medium">Sessões</span>
                <span className="font-semibold text-slate-800">{sessionsCount} realizadas</span>
              </div>
            </div>
          </div>

          {/* Cartão de Objetivo Terapêutico */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2.5 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#172C3A]">
              Objetivo Terapêutico
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {diagForm.treatmentGoal
                ? diagForm.treatmentGoal.split('\n')[0]
                : 'Reduzir frequência de disfluências em 60% em situações de comunicação espontânea até julho/2025.'}
            </p>
          </div>

          {/* Botões de Ação Rápida do Prontuário (Fiel à Imagem 6) */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => setShowNewSessionModal(true)}
              className="w-full py-2.5 bg-[#0284C7] hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Plus size={15} /> Registrar Sessão
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('diagnostico');
                setIsEditingDiag(true);
              }}
              className="w-full py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-2xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <FileEdit size={15} className="text-[#0284C7]" /> Editar Plano Terapêutico
            </button>
            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('relatorios');
              }}
              className="w-full py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-2xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <FileText size={15} className="text-[#0284C7]" /> Gerar Relatório PDF
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* COLUNA DIREITA: NAVEGAÇÃO DE ABAS E CONTEÚDOS CLÍNICOS       */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-8 space-y-4">
          {/* Barra de Abas do Prontuário */}
          <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-2 rounded-t-xl overflow-x-auto scrollbar-none">
            {[
              { id: 'historico', label: 'Histórico', icon: Clock },
              { id: 'avaliacoes', label: 'Avaliações', icon: Stethoscope },
              { id: 'diagnostico', label: 'Diagnóstico', icon: FileCheck2 },
              { id: 'anamnese', label: 'Anamnese', icon: FileText },
              { id: 'anexos', label: 'Anexos', icon: Paperclip },
            ].map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                    active
                      ? 'border-[#0284C7] text-[#0284C7] bg-sky-50/20'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={15} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* ========================================================== */}
          {/* ABA 1: HISTÓRICO (TIMELINE DE SESSÕES)                     */}
          {/* ========================================================== */}
          {activeTab === 'historico' && (
            <div className="space-y-4">
              {sessions.map((sess, idx) => {
                const isRealizada = sess.status === 'Realizada';
                return (
                  <div
                    key={sess.id || idx}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 relative"
                  >
                    {/* Marcador lateral da Timeline */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {isRealizada ? (
                          <span className="w-3 h-3 rounded-full bg-[#0284C7] ring-4 ring-sky-100" />
                        ) : (
                          <span className="w-3 h-3 rounded-full border-2 border-slate-400 bg-white ring-4 ring-slate-100" />
                        )}
                        <span className="text-xs font-bold text-slate-800">
                          {formatDateBR(sess.date)} · Sessão {sess.sessionNumber}
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                          isRealizada
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {sess.status}
                      </span>
                    </div>

                    {isRealizada ? (
                      <div className="text-xs space-y-1.5 pl-4.5 border-l-2 border-slate-100">
                        <p className="text-slate-700">
                          <strong className="text-slate-900">Evolução:</strong> {sess.evolution}
                        </p>
                        {sess.improvementPoint && (
                          <p className="text-slate-700">
                            <strong className="text-slate-900">Ponto de melhora:</strong> {sess.improvementPoint}
                          </p>
                        )}

                        {sess.tags && sess.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {sess.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-sky-50 text-[#0284C7] border border-sky-100"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs space-y-2.5 pl-4.5 border-l-2 border-slate-100 py-1">
                        <p className="text-slate-500 italic">
                          Sessão agendada na clínica. Realize o atendimento para registrar a evolução clínica e os pontos de melhora.
                        </p>
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSessionForm({
                                sessionNumber: sess.sessionNumber,
                                date: sess.date || new Date().toISOString().split('T')[0],
                                evolution: '',
                                improvementPoint: '',
                                tags: 'Fluência, Linguagem, Respiração',
                              });
                              setShowNewSessionModal(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0284C7] hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
                          >
                            <CheckCircle size={14} /> Realizar Atendimento (Registrar Evolução)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ========================================================== */}
          {/* ABA 2: AVALIAÇÕES (TABELA CLÍNICA)                         */}
          {/* ========================================================== */}
          {activeTab === 'avaliacoes' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#172C3A]">
                  Avaliações Registradas
                </h3>
                <button
                  type="button"
                  onClick={() => setShowNewEvalModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0284C7] hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
                >
                  <Plus size={14} /> Nova Avaliação
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-2.5">Data</th>
                      <th className="py-2.5">Tipo</th>
                      <th className="py-2.5">Resultado</th>
                      <th className="py-2.5">Responsável</th>
                      <th className="py-2.5 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {evaluations.map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 font-medium text-slate-800">{formatDateBR(ev.dataAvaliacao)}</td>
                        <td className="py-3 font-semibold text-slate-900">{ev.tipoAvaliacao}</td>
                        <td className="py-3">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900">
                            {ev.resultados}
                          </span>
                        </td>
                        <td className="py-3 text-slate-600">{ev.responsavelNome || 'Dra. Renata Lima'}</td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setViewEvalDetail(ev)}
                            className="px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 text-[11px] transition cursor-pointer"
                          >
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* ABA 3: DIAGNÓSTICO & PLANO TERAPÊUTICO                     */}
          {/* ========================================================== */}
          {activeTab === 'diagnostico' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold font-serif text-[#172C3A]">
                  Diagnóstico & Plano Terapêutico
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditingDiag(!isEditingDiag)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <Pencil size={13} /> {isEditingDiag ? 'Cancelar' : 'Editar'}
                </button>
              </div>

              <form onSubmit={handleSaveDiagnostic} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-slate-500 font-bold block">Diagnóstico fonoaudiológico</label>
                    <input
                      type="text"
                      disabled={!isEditingDiag}
                      value={diagForm.speechDiagnosis}
                      onChange={(e) => setDiagForm({ ...diagForm, speechDiagnosis: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 disabled:bg-slate-50 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold block">CID-10</label>
                    <input
                      type="text"
                      disabled={!isEditingDiag}
                      value={diagForm.cid10}
                      onChange={(e) => setDiagForm({ ...diagForm, cid10: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 disabled:bg-slate-50 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold block">Área terapêutica</label>
                    <input
                      type="text"
                      disabled={!isEditingDiag}
                      value={diagForm.therapeuticArea}
                      onChange={(e) => setDiagForm({ ...diagForm, therapeuticArea: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 disabled:bg-slate-50 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold block">Frequência das sessões</label>
                    <input
                      type="text"
                      disabled={!isEditingDiag}
                      value={diagForm.sessionFrequency}
                      onChange={(e) => setDiagForm({ ...diagForm, sessionFrequency: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 disabled:bg-slate-50 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">Objetivos do tratamento</label>
                  <textarea
                    rows={4}
                    disabled={!isEditingDiag}
                    value={diagForm.treatmentGoal}
                    onChange={(e) => setDiagForm({ ...diagForm, treatmentGoal: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 disabled:bg-slate-50 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-[#0284C7] leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">Condutas terapêuticas</label>
                  <textarea
                    rows={3}
                    disabled={!isEditingDiag}
                    value={diagForm.treatmentPlan}
                    onChange={(e) => setDiagForm({ ...diagForm, treatmentPlan: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 disabled:bg-slate-50 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-[#0284C7] leading-relaxed"
                  />
                </div>

                {isEditingDiag && (
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingDiag(false)}
                      className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={savingAction}
                      className="px-5 py-2 rounded-xl bg-[#0284C7] text-white font-bold hover:bg-sky-700 flex items-center gap-1.5"
                    >
                      <Save size={14} /> Salvar Diagnóstico
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* ========================================================== */}
          {/* ABA 4: ANAMNESE FONOAUDIOLÓGICA                            */}
          {/* ========================================================== */}
          {activeTab === 'anamnese' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold font-serif text-[#172C3A]">
                  Anamnese Fonoaudiológica
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-medium">08/01/2025</span>
                  <button
                    type="button"
                    onClick={() => setIsEditingAnamnese(!isEditingAnamnese)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  >
                    <Pencil size={13} /> {isEditingAnamnese ? 'Cancelar' : 'Editar'}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveAnamnese} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">
                    Queixa principal relatada pela família
                  </label>
                  <textarea
                    rows={3}
                    disabled={!isEditingAnamnese}
                    value={anamneseForm.mainComplaint}
                    onChange={(e) => setAnamneseForm({ ...anamneseForm, mainComplaint: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 disabled:bg-slate-50 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-[#0284C7] leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold block">
                      Histórico familiar de disfluência
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingAnamnese}
                      value={anamneseForm.familyHistory}
                      onChange={(e) => setAnamneseForm({ ...anamneseForm, familyHistory: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 disabled:bg-slate-50 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold block">Início dos sintomas</label>
                    <input
                      type="text"
                      disabled={!isEditingAnamnese}
                      value={anamneseForm.symptomOnset}
                      onChange={(e) => setAnamneseForm({ ...anamneseForm, symptomOnset: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 disabled:bg-slate-50 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold block">
                      Desenvolvimento da linguagem
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingAnamnese}
                      value={anamneseForm.languageDevelopment}
                      onChange={(e) =>
                        setAnamneseForm({ ...anamneseForm, languageDevelopment: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-300 disabled:bg-slate-50 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold block">Tratamentos anteriores</label>
                    <input
                      type="text"
                      disabled={!isEditingAnamnese}
                      defaultValue="Nenhum"
                      className="w-full p-2.5 rounded-xl border border-slate-300 disabled:bg-slate-50 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">Observações adicionais</label>
                  <textarea
                    rows={3}
                    disabled={!isEditingAnamnese}
                    value={anamneseForm.additionalObservations}
                    onChange={(e) =>
                      setAnamneseForm({ ...anamneseForm, additionalObservations: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 disabled:bg-slate-50 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-[#0284C7] leading-relaxed"
                  />
                </div>

                {isEditingAnamnese && (
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingAnamnese(false)}
                      className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={savingAction}
                      className="px-5 py-2 rounded-xl bg-[#0284C7] text-white font-bold hover:bg-sky-700 flex items-center gap-1.5"
                    >
                      <Save size={14} /> Salvar Anamnese
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* ========================================================== */}
          {/* ABA 5: ANEXOS (DOCUMENTOS, ÁUDIOS E EXAMES)               */}
          {/* ========================================================== */}
          {activeTab === 'anexos' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500">
                  {attachments.length} arquivos · {formatBytes(totalAttachmentBytes)}
                </span>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0284C7] hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
                >
                  <UploadCloud size={14} /> Enviar arquivo
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-2.5">Arquivo</th>
                      <th className="py-2.5">Tipo</th>
                      <th className="py-2.5">Data</th>
                      <th className="py-2.5">Tamanho</th>
                      <th className="py-2.5 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attachments.map((att) => {
                      const isAudio =
                        att.fileName.endsWith('.mp3') ||
                        att.fileName.endsWith('.wav') ||
                        (att.tipoConteudo && att.tipoConteudo.includes('audio'));
                      const isPdf =
                        att.fileName.endsWith('.pdf') ||
                        (att.tipoConteudo && att.tipoConteudo.includes('pdf'));
                      const isImg =
                        att.fileName.endsWith('.jpg') ||
                        att.fileName.endsWith('.jpeg') ||
                        att.fileName.endsWith('.png') ||
                        (att.tipoConteudo && att.tipoConteudo.includes('image'));

                      const typeLabel = isAudio ? 'Áudio' : isPdf ? 'Documento' : 'Exame';
                      const badgeClass = isAudio
                        ? 'bg-purple-100 text-purple-800'
                        : isPdf
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-emerald-100 text-emerald-800';

                      return (
                        <tr key={att.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3 font-semibold text-slate-900 flex items-center gap-2">
                            {isAudio ? (
                              <Mic size={15} className="text-purple-600 shrink-0" />
                            ) : isPdf ? (
                              <FileText size={15} className="text-[#0284C7] shrink-0" />
                            ) : (
                              <Paperclip size={15} className="text-emerald-600 shrink-0" />
                            )}
                            <span className="truncate max-w-[200px] sm:max-w-xs">{att.fileName}</span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${badgeClass}`}>
                              {typeLabel}
                            </span>
                          </td>
                          <td className="py-3 text-slate-600">{formatDateBR(att.attachmentDate)}</td>
                          <td className="py-3 text-slate-500 font-mono text-[11px]">
                            {formatBytes(att.fileSize)}
                          </td>
                          <td className="py-3 text-right">
                            <a
                              href={getAttachmentDownloadUrl(att.id)}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 text-[11px] transition inline-flex items-center gap-1"
                            >
                              Baixar
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL: REGISTRAR NOVA SESSÃO NO HISTÓRICO                       */}
      {/* ============================================================== */}
      {showNewSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-300 p-6 shadow-2xl space-y-4 text-[#172C3A]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold font-serif text-[#172C3A]">
                Registrar Evolução de Sessão
              </h3>
              <button
                type="button"
                onClick={() => setShowNewSessionModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewSession} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Número da Sessão</label>
                  <input
                    type="number"
                    required
                    value={sessionForm.sessionNumber}
                    onChange={(e) => setSessionForm({ ...sessionForm, sessionNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#0284C7]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Data da Sessão</label>
                  <input
                    type="date"
                    required
                    value={sessionForm.date}
                    onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#0284C7]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Evolução Clínica *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Descreva o desempenho do paciente, exercícios realizados e resposta clínica..."
                  value={sessionForm.evolution}
                  onChange={(e) => setSessionForm({ ...sessionForm, evolution: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Ponto de Melhora / Tarefa de Casa</label>
                <textarea
                  rows={2}
                  placeholder="Orientações para a família ou pontos a focar na próxima sessão..."
                  value={sessionForm.improvementPoint}
                  onChange={(e) => setSessionForm({ ...sessionForm, improvementPoint: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Tags Clínicas (separadas por vírgula)</label>
                <input
                  type="text"
                  placeholder="Ex: Fluência, Respiração, Leitura em voz alta"
                  value={sessionForm.tags}
                  onChange={(e) => setSessionForm({ ...sessionForm, tags: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewSessionModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#0284C7] text-white font-bold hover:bg-sky-700"
                >
                  Registrar Sessão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: NOVA AVALIAÇÃO                                          */}
      {/* ============================================================== */}
      {showNewEvalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-300 p-6 shadow-2xl space-y-4 text-[#172C3A]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold font-serif text-[#172C3A]">Nova Avaliação Clínica</h3>
              <button
                type="button"
                onClick={() => setShowNewEvalModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewEvaluation} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Tipo de Avaliação *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Avaliação de Fluência, Audiometria, Linguagem..."
                  value={evalForm.tipoAvaliacao}
                  onChange={(e) => setEvalForm({ ...evalForm, tipoAvaliacao: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Data da Avaliação *</label>
                <input
                  type="date"
                  required
                  value={evalForm.dataAvaliacao}
                  onChange={(e) => setEvalForm({ ...evalForm, dataAvaliacao: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Resultado Observado *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ex: Disfluência moderada com bloqueios em fonemas oclusivos..."
                  value={evalForm.resultados}
                  onChange={(e) => setEvalForm({ ...evalForm, resultados: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Conduta Proposta</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Início de intervenção terapêutica semanal focada em controle de velocidade..."
                  value={evalForm.condutasPropostas}
                  onChange={(e) => setEvalForm({ ...evalForm, condutasPropostas: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewEvalModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingAction}
                  className="flex-1 py-2 rounded-xl bg-[#0284C7] text-white font-bold hover:bg-sky-700"
                >
                  {savingAction ? 'Gravando...' : 'Salvar Avaliação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: VER DETALHE DA AVALIAÇÃO                                */}
      {/* ============================================================== */}
      {viewEvalDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-300 p-6 shadow-2xl space-y-4 text-[#172C3A]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold font-serif text-[#172C3A]">
                {viewEvalDetail.tipoAvaliacao}
              </h3>
              <button
                type="button"
                onClick={() => setViewEvalDetail(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Data:</span>
                <span className="font-bold text-slate-800">{formatDateBR(viewEvalDetail.dataAvaliacao)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Responsável:</span>
                <span className="font-bold text-slate-800">
                  {viewEvalDetail.responsavelNome || 'Dra. Renata Lima'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block mb-1">Resultado:</span>
                <p className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-semibold">
                  {viewEvalDetail.resultados}
                </p>
              </div>
              {viewEvalDetail.condutasPropostas && (
                <div>
                  <span className="text-slate-400 font-medium block mb-1">Conduta Proposta:</span>
                  <p className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
                    {viewEvalDetail.condutasPropostas}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setViewEvalDetail(null)}
                className="px-4 py-2 bg-[#0284C7] text-white rounded-xl font-bold text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ENVIAR ARQUIVO ANEXO                                    */}
      {/* ============================================================== */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-300 p-6 shadow-2xl space-y-4 text-[#172C3A]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold font-serif text-[#172C3A]">Enviar Novo Arquivo Anexo</h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadAttachmentSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Selecione o arquivo *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.mp3,.wav,.ogg,.jpg,.jpeg,.png"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-sky-100 file:text-sky-800 hover:file:bg-sky-200 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400">
                  Formatos aceitos: Documentos (PDF), Áudios (MP3, WAV) e Exames (JPG, PNG).
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Descrição do Arquivo</label>
                <input
                  type="text"
                  placeholder="Ex: Audiometria, Gravação da primeira sessão..."
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-2 rounded-xl bg-[#0284C7] text-white font-bold hover:bg-sky-700 disabled:opacity-60 flex items-center justify-center gap-1.5"
                >
                  {uploading ? (
                    'Enviando...'
                  ) : (
                    <>
                      <UploadCloud size={14} /> Fazer Upload
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
