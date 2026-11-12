import { useEffect, useState } from 'react';
import { FileDown, Sheet } from 'lucide-react';
import Button from '../../components/Button';
import Notice from '../../components/Notice';
import { listPatients } from '../../services/patientService';
import { listAnamneses, listDiagnostics, listEvaluations } from '../../services/recordService';
import { ageFrom, formatDate } from '../../utils/formatters';

const statusLabel = { ATIVO: 'Em acompanhamento', PRE_CADASTRO: 'Pré-cadastro', ARQUIVADO: 'Arquivado' };

function download(fileName, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function section(title, lines) {
  return ['', title.toUpperCase(), ...lines.filter(Boolean)];
}

export default function Reports() {
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    listPatients()
      .then((list) => setPatients(list.sort((a, b) => a.name.localeCompare(b.name))))
      .catch((error) => setNotice({ tone: 'danger', text: error.message }))
      .finally(() => setLoading(false));
  }, []);

  const downloadRecord = async () => {
    const patient = patients.find((item) => item.id === patientId);
    if (!patient) return;
    setWorking(true);
    setNotice(null);
    try {
      const [anamneses, diagnostics, evaluations] = await Promise.all([
        listAnamneses(patient.id),
        listDiagnostics(patient.id),
        listEvaluations(patient.id),
      ]);
      const anamnesis = anamneses.at(-1);
      const diagnostic = diagnostics.at(-1);
      const age = ageFrom(patient.dateOfBirth);

      const lines = [
        `Prontuário de ${patient.name}`,
        `Gerado em ${new Date().toLocaleDateString('pt-BR')}`,
        ...section('Dados do paciente', [
          age !== null && `Idade: ${age} anos`,
          patient.cpfPatient && `CPF: ${patient.cpfPatient}`,
          patient.contactPatient && `Contato: ${patient.contactPatient}`,
          patient.cid10 && `CID-10: ${patient.cid10}`,
          `Status: ${statusLabel[patient.patientStatus]}`,
        ]),
        ...section('Anamnese', [
          anamnesis?.mainComplaint && `Queixa principal: ${anamnesis.mainComplaint}`,
          anamnesis?.familyHistory && `Histórico familiar: ${anamnesis.familyHistory}`,
          anamnesis?.symptomOnset && `Início dos sintomas: ${anamnesis.symptomOnset}`,
          anamnesis?.languageDevelopment && `Desenvolvimento da linguagem: ${anamnesis.languageDevelopment}`,
          anamnesis?.additionalObservations && `Observações: ${anamnesis.additionalObservations}`,
        ]),
        ...section('Diagnóstico', [
          diagnostic?.speechDiagnosis && `Diagnóstico fonoaudiológico: ${diagnostic.speechDiagnosis}`,
          diagnostic?.cid10 && `CID-10: ${diagnostic.cid10}`,
          diagnostic?.therapeuticArea && `Área terapêutica: ${diagnostic.therapeuticArea}`,
          diagnostic?.sessionFrequency && `Frequência das sessões: ${diagnostic.sessionFrequency}`,
          diagnostic?.treatmentGoal && `Objetivos: ${diagnostic.treatmentGoal}`,
          diagnostic?.treatmentPlan && `Condutas: ${diagnostic.treatmentPlan}`,
        ]),
        ...section(
          'Avaliações',
          evaluations.flatMap((evaluation) => [
            `- ${formatDate(evaluation.dataAvaliacao)} ${evaluation.tipoAvaliacao ?? ''} (${evaluation.concluido ? 'concluída' : 'em andamento'})`,
            evaluation.resultados && `  Resultado: ${evaluation.resultados}`,
            evaluation.condutasPropostas && `  Conduta: ${evaluation.condutasPropostas}`,
          ]),
        ),
      ];

      const fileName = `prontuario-${patient.name.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-')}.txt`;
      download(fileName, lines.join('\n'), 'text/plain;charset=utf-8');
      setNotice({ tone: 'success', text: `Relatório de ${patient.name} baixado.` });
    } catch (error) {
      setNotice({ tone: 'danger', text: error.message });
    } finally {
      setWorking(false);
    }
  };

  const exportCsv = () => {
    const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
    const rows = [
      ['Nome', 'Data de nascimento', 'CPF', 'Contato', 'CID-10', 'Status'],
      ...patients.map((patient) => [
        patient.name,
        formatDate(patient.dateOfBirth),
        patient.cpfPatient,
        patient.contactPatient,
        patient.cid10,
        statusLabel[patient.patientStatus],
      ]),
    ];
    download('pacientes-fonosync.csv', `\uFEFF${rows.map((row) => row.map(quote).join(';')).join('\n')}`, 'text/csv;charset=utf-8');
    setNotice({ tone: 'success', text: 'Lista de pacientes exportada.' });
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-md border border-line bg-surface p-5">
        <div>
          <h2 className="text-xl text-navy">Relatório do prontuário</h2>
          <p className="text-sm text-muted">Arquivo de texto com dados, anamnese, diagnóstico e avaliações do paciente.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor="relatorio-paciente" className="text-sm font-bold text-ink">
              Paciente
            </label>
            <select
              id="relatorio-paciente"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              disabled={loading}
              className="min-h-11 rounded-md border border-line bg-surface px-3 text-sm text-ink"
            >
              <option value="">{loading ? 'Carregando...' : 'Selecione'}</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={downloadRecord} disabled={!patientId || working}>
            <FileDown size={17} aria-hidden="true" />
            {working ? 'Gerando...' : 'Baixar relatório'}
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-md border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl text-navy">Lista de pacientes</h2>
          <p className="text-sm text-muted">Planilha (CSV) com os pacientes cadastrados.</p>
        </div>
        <Button variant="secondary" onClick={exportCsv} disabled={loading || patients.length === 0}>
          <Sheet size={17} aria-hidden="true" />
          Exportar CSV
        </Button>
      </section>

      <div role="status">{notice && <Notice tone={notice.tone} title={notice.text} />}</div>
    </div>
  );
}
