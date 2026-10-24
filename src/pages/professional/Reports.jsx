import { BadgeCheck, FileDown, Sheet } from 'lucide-react';
import Button from '../../components/Button';
import DataTable from '../../components/DataTable';
import Notice from '../../components/Notice';

const columns = [
  { key: 'document', label: 'Documento' },
  { key: 'patient', label: 'Paciente' },
  { key: 'period', label: 'Período' },
  { key: 'createdAt', label: 'Criado em' },
  { key: 'status', label: 'Status' },
];

const documents = [
  { id: 1, document: 'Relatório de evolução', patient: 'Maria Luiza', period: 'Jul–Set 2026', createdAt: '30 set', status: 'Disponível' },
  { id: 2, document: 'Atestado de comparecimento', patient: 'João Pedro', period: '29 set', createdAt: '29 set', status: 'Assinado' },
  { id: 3, document: 'Relatório interdisciplinar', patient: 'Ana Clara', period: 'Ago–Set 2026', createdAt: '25 set', status: 'Rascunho' },
  { id: 4, document: 'Exportação de sessões', patient: 'Todos', period: 'Set 2026', createdAt: '01 out', status: 'CSV pronto' },
];

export default function Reports() {
  return (
    <>
      <div className="flex gap-2.5">
        <Button variant="primary">
          <FileDown size={17} aria-hidden="true" />
          Gerar PDF
        </Button>
        <Button variant="secondary">
          <BadgeCheck size={17} aria-hidden="true" />
          Novo atestado
        </Button>
        <Button variant="secondary">
          <Sheet size={17} aria-hidden="true" />
          Exportar CSV
        </Button>
      </div>

      <Notice tone="success" title="Relatórios acessíveis">
        PDF com estrutura de títulos, texto alternativo dos gráficos e linguagem clínica clara.
      </Notice>

      <DataTable caption="Documentos gerados" columns={columns} rows={documents} />
    </>
  );
}
