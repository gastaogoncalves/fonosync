import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, ClipboardList, FileText, Pencil, Plus, Save, Stethoscope, Trash2 } from 'lucide-react';
import Button from '../../components/Button';
import Notice from '../../components/Notice';
import { buttonClass } from '../../components/buttonStyles';
import {
  concludeEvaluation,
  createAnamnesis,
  createDiagnostic,
  createEvaluation,
  deleteEvaluation,
  getPatient,
  listAnamneses,
  listDiagnostics,
  listEvaluations,
  updateAnamnesis,
  updateDiagnostic,
  updateEvaluation,
} from '../../services/recordService';
import { ageFrom, formatDate } from '../../utils/formatters';

const anamnesisFields = [
  { key: 'mainComplaint', label: 'Queixa principal relatada pela família' },
  { key: 'familyHistory', label: 'Histórico familiar' },
  { key: 'symptomOnset', label: 'Início dos sintomas' },
  { key: 'languageDevelopment', label: 'Desenvolvimento da linguagem' },
  { key: 'additionalObservations', label: 'Observações adicionais' },
];

const diagnosticFields = [
  { key: 'speechDiagnosis', label: 'Diagnóstico fonoaudiológico' },
  { key: 'cid10', label: 'CID-10', short: true },
  { key: 'therapeuticArea', label: 'Área terapêutica', short: true },
  { key: 'sessionFrequency', label: 'Frequência das sessões', short: true },
  { key: 'treatmentGoal', label: 'Objetivos do tratamento' },
  { key: 'treatmentPlan', label: 'Condutas terapêuticas' },
];

const evaluationFields = [
  { key: 'tipoAvaliacao', label: 'Tipo de avaliação', short: true },
  { key: 'dataAvaliacao', label: 'Data', short: true, type: 'date' },
  { key: 'resultados', label: 'Resultado / impressão clínica' },
  { key: 'condutasPropostas', label: 'Conduta proposta' },
];

const tabs = [
  { id: 'anamnese', label: 'Anamnese', icon: ClipboardList },
  { id: 'diagnostico', label: 'Diagnóstico', icon: Stethoscope },
  { id: 'avaliacoes', label: 'Avaliações', icon: FileText },
];

const fieldClass = 'w-full rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-ink';

const pick = (record, fields) => Object.fromEntries(fields.map(({ key }) => [key, record?.[key] ?? '']));

function Fields({ fields, values, onChange, idPrefix }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {fields.map(({ key, label, short, type }) => (
        <div key={key} className={`flex flex-col gap-1.5 ${short ? '' : 'sm:col-span-3'}`}>
          <label htmlFor={`${idPrefix}-${key}`} className="text-sm font-bold text-ink">
            {label}
          </label>
          {short ? (
            <input
              id={`${idPrefix}-${key}`}
              type={type ?? 'text'}
              value={values[key]}
              onChange={(e) => onChange({ ...values, [key]: e.target.value })}
              className={`${fieldClass} min-h-11`}
            />
          ) : (
            <textarea
              id={`${idPrefix}-${key}`}
              rows={3}
              value={values[key]}
              onChange={(e) => onChange({ ...values, [key]: e.target.value })}
              className={`${fieldClass} resize-y`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Spinner({ label }) {
  return (
    <p className="flex items-center gap-2 py-6 text-sm text-muted">
      <span className="size-4 animate-spin rounded-full border-2 border-line border-t-primary" aria-hidden="true" />
      {label}
    </p>
  );
}

// anamnese e diagnóstico: o prontuário usa o registro mais recente de cada um
function SingleRecord({ patientId, fields, list, create, update, idPrefix, notify }) {
  const [record, setRecord] = useState(null);
  const [values, setValues] = useState(() => pick(null, fields));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    list(patientId)
      .then((items) => {
        const latest = items.at(-1) ?? null;
        setRecord(latest);
        setValues(pick(latest, fields));
      })
      .catch((error) => notify('danger', error.message))
      .finally(() => setLoading(false));
  }, [patientId, fields, list, notify]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = record ? await update(record.id, values) : await create(patientId, values);
      setRecord(saved);
      notify('success', 'Prontuário salvo.');
    } catch (error) {
      notify('danger', error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner label="Carregando..." />;

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4">
      <Fields fields={fields} values={values} onChange={setValues} idPrefix={idPrefix} />
      <div>
        <Button type="submit" disabled={saving}>
          <Save size={16} aria-hidden="true" />
          {saving ? 'Salvando...' : record ? 'Salvar alterações' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
}

function Evaluations({ patientId, notify }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [values, setValues] = useState(() => pick(null, evaluationFields));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listEvaluations(patientId)
      .then(setItems)
      .catch((error) => notify('danger', error.message))
      .finally(() => setLoading(false));
  }, [patientId, notify]);

  const openForm = (evaluation) => {
    setEditing(evaluation ?? 'nova');
    setValues(pick(evaluation, evaluationFields));
  };

  const replace = (saved) => setItems((current) => current.map((item) => (item.id === saved.id ? saved : item)));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...values, dataAvaliacao: values.dataAvaliacao || null };
      if (editing === 'nova') {
        const created = await createEvaluation(patientId, data);
        setItems((current) => [...current, created]);
      } else {
        replace(await updateEvaluation(editing.id, { ...data, concluido: editing.concluido }));
      }
      setEditing(null);
      notify('success', 'Avaliação salva.');
    } catch (error) {
      notify('danger', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleConclude = async (evaluation) => {
    try {
      replace(await concludeEvaluation(evaluation.id));
      notify('success', 'Avaliação concluída.');
    } catch (error) {
      notify('danger', error.message);
    }
  };

  const handleDelete = async (evaluation) => {
    if (!window.confirm('Excluir esta avaliação? Essa ação não pode ser desfeita.')) return;
    try {
      await deleteEvaluation(evaluation.id);
      setItems((current) => current.filter((item) => item.id !== evaluation.id));
      notify('success', 'Avaliação excluída.');
    } catch (error) {
      notify('danger', error.message);
    }
  };

  if (loading) return <Spinner label="Carregando avaliações..." />;

  const sorted = [...items].sort((a, b) => (b.dataAvaliacao ?? '').localeCompare(a.dataAvaliacao ?? ''));

  return (
    <div className="flex flex-col gap-4">
      {editing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-4 rounded-md border border-line bg-mist/40 p-4">
          <h3 className="text-lg text-navy">{editing === 'nova' ? 'Nova avaliação' : 'Editar avaliação'}</h3>
          <Fields fields={evaluationFields} values={values} onChange={setValues} idPrefix="avaliacao" />
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={saving}>
              <Save size={16} aria-hidden="true" />
              {saving ? 'Salvando...' : 'Salvar avaliação'}
            </Button>
            <Button variant="secondary" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <div>
          <Button onClick={() => openForm(null)}>
            <Plus size={16} aria-hidden="true" />
            Nova avaliação
          </Button>
        </div>
      )}

      {sorted.length === 0 && !editing && <p className="text-sm text-muted">Nenhuma avaliação registrada.</p>}

      <ul className="flex flex-col gap-3">
        {sorted.map((evaluation) => (
          <li key={evaluation.id} className="flex flex-col gap-2 rounded-md border border-line bg-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-bold text-navy">{evaluation.tipoAvaliacao || 'Avaliação'}</p>
                <p className="text-sm text-muted">{formatDate(evaluation.dataAvaliacao)}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  evaluation.concluido ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                }`}
              >
                {evaluation.concluido ? 'Concluída' : 'Em andamento'}
              </span>
            </div>
            {evaluation.resultados && (
              <p className="text-sm text-ink">
                <span className="font-bold">Resultado: </span>
                {evaluation.resultados}
              </p>
            )}
            {evaluation.condutasPropostas && (
              <p className="text-sm text-ink">
                <span className="font-bold">Conduta: </span>
                {evaluation.condutasPropostas}
              </p>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              <Button variant="secondary" onClick={() => openForm(evaluation)}>
                <Pencil size={15} aria-hidden="true" /> Editar
              </Button>
              {!evaluation.concluido && (
                <Button variant="secondary" onClick={() => handleConclude(evaluation)}>
                  <CheckCircle2 size={15} aria-hidden="true" /> Concluir
                </Button>
              )}
              <Button variant="danger" onClick={() => handleDelete(evaluation)}>
                <Trash2 size={15} aria-hidden="true" /> Excluir
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PatientRecord({ patientId }) {
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('anamnese');
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    getPatient(patientId)
      .then(setPatient)
      .catch((err) => setError(err.message));
  }, [patientId]);

  const notify = useCallback((tone, text) => {
    setNotice({ tone, text });
    if (tone === 'success') setTimeout(() => setNotice(null), 4000);
  }, []);

  const age = ageFrom(patient?.dateOfBirth);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <a href="#/profissional/pacientes" className={buttonClass('tertiary')}>
          <ArrowLeft size={16} aria-hidden="true" /> Voltar para pacientes
        </a>
      </div>

      {error && (
        <Notice tone="danger" title="Não foi possível abrir o prontuário">
          {error}
        </Notice>
      )}

      {!patient && !error && <Spinner label="Carregando prontuário..." />}

      {patient && (
        <>
          <section className="flex flex-wrap items-center gap-4 rounded-md border border-line bg-surface p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-serif text-lg font-bold text-primary">
              {patient.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl text-navy">{patient.name}</h2>
              <p className="text-sm text-muted">
                {[age !== null && `${age} anos`, patient.contactPatient, patient.cpfPatient && `CPF ${patient.cpfPatient}`]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </div>
          </section>

          <div role="status">{notice && <Notice tone={notice.tone} title={notice.text} />}</div>

          <div className="flex flex-wrap gap-2 border-b border-line" role="tablist" aria-label="Seções do prontuário">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`-mb-px flex min-h-11 items-center gap-2 border-b-2 px-4 text-sm font-bold transition-colors ${
                  tab === id ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-navy'
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          <section role="tabpanel" className="rounded-md border border-line bg-surface p-5">
            {tab === 'anamnese' && (
              <SingleRecord
                patientId={patientId}
                fields={anamnesisFields}
                list={listAnamneses}
                create={createAnamnesis}
                update={updateAnamnesis}
                idPrefix="anamnese"
                notify={notify}
              />
            )}
            {tab === 'diagnostico' && (
              <SingleRecord
                patientId={patientId}
                fields={diagnosticFields}
                list={listDiagnostics}
                create={createDiagnostic}
                update={updateDiagnostic}
                idPrefix="diagnostico"
                notify={notify}
              />
            )}
            {tab === 'avaliacoes' && <Evaluations patientId={patientId} notify={notify} />}
          </section>
        </>
      )}
    </div>
  );
}
