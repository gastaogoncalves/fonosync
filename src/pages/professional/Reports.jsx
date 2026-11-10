import { useState } from 'react';
import { BadgeCheck, FileDown, Sheet, CheckCircle2 } from 'lucide-react';
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

const initialDocuments = [
  { id: 1, document: 'Relatório de evolução', patient: 'Maria Luiza', period: 'Jul–Set 2026', createdAt: '30 set', status: 'Disponível' },
  { id: 2, document: 'Atestado de comparecimento', patient: 'João Pedro', period: '29 set', createdAt: '29 set', status: 'Assinado' },
  { id: 3, document: 'Relatório interdisciplinar', patient: 'Ana Clara', period: 'Ago–Set 2026', createdAt: '25 set', status: 'Rascunho' },
  { id: 4, document: 'Exportação de sessões', patient: 'Todos', period: 'Set 2026', createdAt: '01 out', status: 'CSV pronto' },
];

export default function Reports() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [feedback, setFeedback] = useState(null);

  const handleGeneratePDF = () => {
    const newDoc = {
      id: Date.now(),
      document: 'Relatório de evolução clínica',
      patient: 'Maria Luiza',
      period: 'Out 2026',
      createdAt: 'Hoje',
      status: 'Gerado (PDF)'
    };
    setDocuments([newDoc, ...documents]);
    setFeedback('PDF gerado e disponibilizado para download!');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleNewAtestado = () => {
    const newDoc = {
      id: Date.now(),
      document: 'Atestado de comparecimento',
      patient: 'João Pedro',
      period: 'Hoje',
      createdAt: 'Hoje',
      status: 'Assinado'
    };
    setDocuments([newDoc, ...documents]);
    setFeedback('Atestado digital gerado e assinado com sucesso!');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Documento,Paciente,Periodo,Status\n" 
      + documents.map(e => `${e.document},${e.patient},${e.period},${e.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "relatorios_fonosync.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFeedback('Planilha de relatórios (CSV) baixada com sucesso!');
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2.5">
        <Button variant="primary" onClick={handleGeneratePDF}>
          <FileDown size={17} aria-hidden="true" />
          Gerar PDF
        </Button>
        <Button variant="secondary" onClick={handleNewAtestado}>
          <BadgeCheck size={17} aria-hidden="true" />
          Novo atestado
        </Button>
        <Button variant="secondary" onClick={handleExportCSV}>
          <Sheet size={17} aria-hidden="true" />
          Exportar CSV
        </Button>
      </div>

      {feedback && (
        <Notice tone="success" title="Ação concluída">
          <span className="flex items-center gap-1">
            <CheckCircle2 size={16} /> {feedback}
          </span>
        </Notice>
      )}

      <Notice tone="info" title="Relatórios acessíveis">
        PDF com estrutura de títulos, texto alternativo dos gráficos e linguagem clínica clara.
      </Notice>

      <DataTable caption="Documentos gerados" columns={columns} rows={documents} />
    </>
  );
}