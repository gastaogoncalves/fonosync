import { useEffect, useState } from 'react';
import { ClipboardList, FileText, FolderArchive, UserPlus, Users } from 'lucide-react';
import Button from '../../components/Button';
import Notice from '../../components/Notice';
import { listPatients } from '../../services/patientService';
import { listEvaluations } from '../../services/recordService';
import { ageFrom, formatDate } from '../../utils/formatters';

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-line bg-surface p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon size={20} aria-hidden="true" />
      </span>
      <div>
        <p className="font-serif text-2xl font-bold text-navy">{value}</p>
        <p className="text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}

export default function Home({ onNavigate }) {
  const [patients, setPatients] = useState([]);
  const [openEvaluations, setOpenEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listPatients()
      .then(async (list) => {
        setPatients(list);
        const active = list.filter((patient) => patient.patientStatus !== 'ARQUIVADO');
        const evaluations = await Promise.all(active.map((patient) => listEvaluations(patient.id)));
        setOpenEvaluations(
          evaluations
            .flat()
            .filter((evaluation) => !evaluation.concluido)
            .sort((a, b) => (b.dataAvaliacao ?? '').localeCompare(a.dataAvaliacao ?? '')),
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const active = patients.filter((patient) => patient.patientStatus === 'ATIVO');
  const preRegistered = patients.filter((patient) => patient.patientStatus === 'PRE_CADASTRO');
  const archived = patients.filter((patient) => patient.patientStatus === 'ARQUIVADO');
  const recent = [...active, ...preRegistered].slice(-5).reverse();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 rounded-md border border-line bg-surface p-5 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl text-navy">Resumo</h2>
          <p className="text-sm text-muted">
            {loading
              ? 'Carregando...'
              : `${active.length} paciente(s) em acompanhamento e ${openEvaluations.length} avaliação(ões) em andamento.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => onNavigate('pacientes')}>
            <UserPlus size={16} aria-hidden="true" /> Novo paciente
          </Button>
          <Button variant="secondary" onClick={() => onNavigate('prontuarios')}>
            <ClipboardList size={16} aria-hidden="true" /> Prontuários
          </Button>
        </div>
      </div>

      {error && <Notice tone="danger" title="Não foi possível carregar o resumo">{error}</Notice>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={Users} label="Em acompanhamento" value={loading ? '–' : active.length} />
        <Metric icon={UserPlus} label="Pré-cadastro" value={loading ? '–' : preRegistered.length} />
        <Metric icon={FileText} label="Avaliações em andamento" value={loading ? '–' : openEvaluations.length} />
        <Metric icon={FolderArchive} label="Prontuários arquivados" value={loading ? '–' : archived.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-3 rounded-md border border-line bg-surface p-5">
          <div className="flex items-center justify-between gap-2 border-b border-line pb-2">
            <h3 className="text-lg text-navy">Acesso rápido aos prontuários</h3>
            <button
              type="button"
              onClick={() => onNavigate('prontuarios')}
              className="text-sm font-bold text-primary underline-offset-4 hover:underline"
            >
              Ver todos
            </button>
          </div>
          {!loading && recent.length === 0 && <p className="text-sm text-muted">Nenhum paciente cadastrado.</p>}
          <ul className="flex flex-col divide-y divide-line">
            {recent.map((patient) => {
              const age = ageFrom(patient.dateOfBirth);
              return (
                <li key={patient.id}>
                  <a
                    href={`#/profissional/prontuario/${patient.id}`}
                    className="flex items-center justify-between gap-3 py-2.5 hover:text-primary"
                  >
                    <span className="font-bold text-navy">{patient.name}</span>
                    <span className="text-sm text-muted">{age !== null && `${age} anos`}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="flex flex-col gap-3 rounded-md border border-line bg-surface p-5">
          <h3 className="border-b border-line pb-2 text-lg text-navy">Avaliações em andamento</h3>
          {!loading && openEvaluations.length === 0 && <p className="text-sm text-muted">Nenhuma avaliação em andamento.</p>}
          <ul className="flex flex-col divide-y divide-line">
            {openEvaluations.slice(0, 5).map((evaluation) => (
              <li key={evaluation.id}>
                <a
                  href={`#/profissional/prontuario/${evaluation.paciente?.id}`}
                  className="flex items-center justify-between gap-3 py-2.5 hover:text-primary"
                >
                  <span>
                    <span className="block font-bold text-navy">{evaluation.paciente?.name}</span>
                    <span className="text-sm text-muted">{evaluation.tipoAvaliacao}</span>
                  </span>
                  <span className="text-sm text-muted">{formatDate(evaluation.dataAvaliacao)}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
