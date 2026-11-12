import { useEffect, useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';
import Notice from '../../components/Notice';
import { listPatients } from '../../services/patientService';
import { ageFrom } from '../../utils/formatters';

const statusLabel = { ATIVO: 'Em acompanhamento', PRE_CADASTRO: 'Pré-cadastro', ARQUIVADO: 'Arquivado' };

export default function Records() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    listPatients()
      .then(setPatients)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const term = search.trim().toLowerCase();
  const visible = patients
    .filter((patient) => showArchived || patient.patientStatus !== 'ARQUIVADO')
    .filter((patient) => patient.name.toLowerCase().includes(term))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-md border border-line bg-surface p-4 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Buscar prontuário pelo nome</span>
          <Search size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar pelo nome do paciente"
            className="min-h-11 w-full rounded-md border border-line bg-surface pr-3 pl-10 text-sm text-ink"
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-bold text-ink">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="size-4 accent-primary"
          />
          Mostrar arquivados
        </label>
      </div>

      {error && <Notice tone="danger" title="Não foi possível carregar os prontuários">{error}</Notice>}

      {loading ? (
        <p className="flex items-center gap-2 py-6 text-sm text-muted">
          <span className="size-4 animate-spin rounded-full border-2 border-line border-t-primary" aria-hidden="true" />
          Carregando prontuários...
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {visible.length === 0 && <li className="text-sm text-muted">Nenhum prontuário encontrado.</li>}
          {visible.map((patient) => {
            const age = ageFrom(patient.dateOfBirth);
            return (
              <li key={patient.id}>
                <a
                  href={`#/profissional/prontuario/${patient.id}`}
                  className="flex items-center gap-3 rounded-md border border-line bg-surface p-4 transition-colors hover:border-primary"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {patient.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-navy">{patient.name}</span>
                    <span className="text-sm text-muted">
                      {[age !== null && `${age} anos`, statusLabel[patient.patientStatus], patient.cid10 && `CID-10 ${patient.cid10}`]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-muted" aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
