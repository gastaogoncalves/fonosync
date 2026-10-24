import { useState } from 'react';
import { Archive, Search, SlidersHorizontal, UserPlus } from 'lucide-react';
import Button from '../../components/Button';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';

const columns = [
  { key: 'name', label: 'Paciente' },
  { key: 'age', label: 'Idade' },
  { key: 'lastSession', label: 'Última sessão' },
  { key: 'professional', label: 'Profissional' },
  { key: 'status', label: 'Status' },
  { key: 'action', label: 'Ação' },
];

const patients = [
  { id: 1, name: 'Maria Luiza Ferreira', age: '8 anos', lastSession: 'Hoje, 09:00', status: 'Em acompanhamento' },
  { id: 2, name: 'João Pedro Santos', age: '6 anos', lastSession: '30 set, 16:30', status: 'Em acompanhamento' },
  { id: 3, name: 'Ana Clara Souza', age: '10 anos', lastSession: '28 set, 14:00', status: 'Atenção' },
  { id: 4, name: 'Lucas Ribeiro', age: '4 anos', lastSession: '25 set, 11:00', status: 'Pausado' },
];

export default function Patients() {
  const [search, setSearch] = useState('');

  const rows = patients
    .filter((patient) => patient.name.toLowerCase().includes(search.trim().toLowerCase()))
    .map((patient) => ({
      ...patient,
      professional: 'Dra. Renata',
      action: (
        <a
          href="#/profissional/acompanhamento"
          className="font-bold text-primary underline-offset-4 hover:underline"
          aria-label={`Abrir acompanhamento de ${patient.name}`}
        >
          Abrir
        </a>
      ),
    }));

  return (
    <>
      <div className="flex items-end gap-2.5">
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="busca-paciente" className="text-sm font-bold text-ink">
            Buscar paciente
          </label>
          <div className="flex min-h-11 items-center gap-2 rounded-md border border-muted/60 bg-surface px-3 focus-within:outline-3 focus-within:outline-focus">
            <Search size={16} className="shrink-0 text-muted" aria-hidden="true" />
            <input
              id="busca-paciente"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nome, responsável ou telefone"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
            />
          </div>
        </div>
        <Button variant="secondary">
          <SlidersHorizontal size={17} aria-hidden="true" />
          Filtros
        </Button>
        <Button variant="primary">
          <UserPlus size={17} aria-hidden="true" />
          Novo cadastro
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <StatusBadge>Em acompanhamento</StatusBadge>
        <StatusBadge>Todos os convênios</StatusBadge>
        <Button variant="tertiary">
          <Archive size={17} aria-hidden="true" />
          Arquivados
        </Button>
      </div>

      <DataTable
        caption="Lista de pacientes"
        columns={columns}
        rows={rows}
        emptyMessage={`Nenhum paciente encontrado para "${search}".`}
      />
    </>
  );
}
