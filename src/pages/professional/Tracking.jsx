import { useState } from 'react';
import { Activity, CalendarCheck, Target, Save, User, CheckCircle2 } from 'lucide-react';
import MetricCard from '../../components/MetricCard';
import Notice from '../../components/Notice';
import Panel from '../../components/Panel';
import ProgressBar from '../../components/ProgressBar';
import Button from '../../components/Button';

const patientsList = [
  { id: 1, name: 'Maria Luiza Ferreira', fluency: 72, precision: 64, generalization: 58 },
  { id: 2, name: 'João Pedro Santos', fluency: 60, precision: 80, generalization: 70 },
  { id: 3, name: 'Ana Clara Souza', fluency: 45, precision: 50, generalization: 40 },
];

export default function Tracking() {
  const [selectedPatientId, setSelectedPatientId] = useState(1);
  const [newEvolucao, setNewEvolucao] = useState('');
  const [evolucoes, setEvolucoes] = useState([
    { id: 1, date: '04/11/2026', text: 'Paciente realizou exercícios de respiração com boa resposta. Ótimo controle de intensidade vocal.', author: 'Dra. Renata' },
    { id: 2, date: '28/10/2026', text: 'Treino de articulação dos fonemas plosivos. Apresentou fadiga leve no final da sessão.', author: 'Dra. Renata' }
  ]);
  const [savedNotice, setSavedNotice] = useState(false);

  const currentPatient = patientsList.find(p => p.id === Number(selectedPatientId)) || patientsList[0];

  const handleAddEvolucao = (e) => {
    e.preventDefault();
    if (!newEvolucao.trim()) return;
    const nova = {
      id: Date.now(),
      date: new Date().toLocaleDateString('pt-BR'),
      text: newEvolucao,
      author: 'Dra. Renata'
    };
    setEvolucoes([nova, ...evolucoes]);
    setNewEvolucao('');
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const metrics = [
    { icon: Activity, label: 'Fluência atual', value: `${currentPatient.fluency}%`, note: '+8 pontos este mês' },
    { icon: Target, label: 'Metas ativas', value: 3, note: '1 próxima de concluir' },
    { icon: CalendarCheck, label: 'Frequência', value: '92%', note: 'Últimas 12 semanas' },
  ];

  const evolution = [
    { label: 'Fluência de Fala', value: currentPatient.fluency },
    { label: 'Precisão Fonética', value: currentPatient.precision },
    { label: 'Generalização em Casa', value: currentPatient.generalization },
  ];

  return (
    <>
      <div className="flex items-center justify-between bg-surface p-4 rounded-xl border border-line shadow-sm mb-2">
        <div className="flex items-center gap-3">
          <User className="text-primary" size={20} />
          <span className="text-sm font-bold text-navy">Paciente em Atendimento:</span>
        </div>
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="min-h-11 rounded-md border border-muted/60 bg-surface px-4 text-sm font-bold text-navy outline-none"
        >
          {patientsList.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <div className="space-y-4">
          <Panel
            title="Evolução clínica dos parâmetros"
            aside={<span className="text-sm text-muted">Comparativo 90 dias</span>}
          >
            {evolution.map((item) => (
              <ProgressBar key={item.label} label={item.label} value={item.value} />
            ))}
            <Notice tone="success" title="Evolução Satisfatória">
              Melhora global de 12% em relação ao trimestre anterior para {currentPatient.name}.
            </Notice>
          </Panel>

          <Panel title="Registrar Nova Evolução de Sessão">
            <form onSubmit={handleAddEvolucao} className="space-y-3">
              <textarea
                rows={3}
                value={newEvolucao}
                onChange={(e) => setNewEvolucao(e.target.value)}
                placeholder="Escreva as notas clínicas da sessão realizada hoje..."
                className="w-full p-3 border border-muted/60 rounded-md text-sm text-ink bg-surface outline-none focus:border-primary"
              />
              <div className="flex justify-between items-center">
                {savedNotice ? (
                  <span className="text-xs text-success font-bold flex items-center gap-1">
                    <CheckCircle2 size={14} /> Evolução registrada com sucesso!
                  </span>
                ) : <span />}
                <Button variant="primary" type="submit">
                  <Save size={16} /> Salvar no Prontuário
                </Button>
              </div>
            </form>
          </Panel>
        </div>

        <Panel title="Histórico de Anotações do Prontuário" className="w-full">
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {evolucoes.map((evo) => (
              <div key={evo.id} className="p-3.5 rounded-xl bg-canvas border border-line flex flex-col gap-1">
                <div className="flex justify-between items-center text-xs font-bold text-primary">
                  <span>Sessão em {evo.date}</span>
                  <span className="text-muted font-normal">{evo.author}</span>
                </div>
                <p className="text-sm text-ink leading-relaxed">{evo.text}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}