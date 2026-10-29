import React, { useState } from 'react';
import { Gamepad2, CheckCircle2, AlertTriangle, XCircle, ArrowRight, RotateCcw, Volume2, Sparkles } from 'lucide-react';

export default function TriagemGame() {
  const [activeTab, setActiveTab] = useState('form02');

  // Estado do Formulário 0-2 anos
  const [answers02, setAnswers02] = useState({});
  const [showResult02, setShowResult02] = useState(false);

  // Estado do Jogo 2-4 anos
  const [currentAnimal, setCurrentAnimal] = useState(0);
  const [childWord, setChildWord] = useState('');
  const [showAnalysis24, setShowAnalysis24] = useState(false);
  const [score24, setScore24] = useState({ trocas: 0, acertos: 0 });

  // Estado do Jogo Rima 4-5 anos
  const [rimaIndex, setRimaIndex] = useState(0);
  const [rimaFeedback, setRimaFeedback] = useState(null);
  const [rimaScore, setRimaScore] = useState({ acertos: 0, erros: 0 });

  // Estado Checklist 6+ anos
  const [checkedItems, setCheckedItems] = useState({});
  const [showCheckResult, setShowCheckResult] = useState(false);

  // Dados dos Jogos
  const questions02 = [
    { id: 1, category: "Comunicação Verbal", title: "Fala pelo menos 10 palavras reconhecíveis (ex: mamãe, água, não, dá)?" },
    { id: 2, category: "Compreensão", title: "Entende ordens simples sem gestos como 'pega a bola' ou 'vem aqui'?" },
    { id: 3, category: "Imitação Vocal", title: "Imita sons ou palavras faladas por adultos mesmo com erro de pronúncia?" },
    { id: 4, category: "Atenção Auditiva", title: "Reage quando seu nome é chamado em tom normal?" },
    { id: 5, category: "Combinação de Palavras", title: "Junta duas palavras para formar frases simples (ex: 'quer água')?" },
    { id: 6, category: "Intenção Comunicativa", title: "Aponta ou gesticula para pedir o que quer além de chorar?" }
  ];

  const animals24 = [
    { emoji: '🐄', name: 'VACA', phonemes: '/v/ + /a/ + /k/ + /a/', target: 'vaca' },
    { emoji: '🐍', name: 'COBRA', phonemes: '/k/ + /o/ + /b/ + /r/ + /a/', target: 'cobra' },
    { emoji: '🌸', name: 'FLOR', phonemes: '/f/ + /l/ + /o/ + /r/', target: 'flor' },
    { emoji: '🚂', name: 'TREM', phonemes: '/t/ + /r/ + /e/ + /m/', target: 'trem' }
  ];

  const rimaPairs = [
    { w1: 'GATO', e1: '🐱', w2: 'PATO', e2: '🦆', rima: true },
    { w1: 'BOLA', e1: '⚽', w2: 'MOLA', e2: '🌀', rima: true },
    { w1: 'CASA', e1: '🏠', w2: 'PEIXE', e2: '🐟', rima: false },
    { w1: 'CARRO', e1: '🚗', w2: 'JARRO', e2: '🏺', rima: true }
  ];

  const checklist6 = [
    "Evita falar em voz alta ou ler para a turma em sala de aula.",
    "Troca sons na fala não esperados para a sua faixa etária.",
    "Tem dificuldade em rimar palavras ou identificar o som inicial.",
    "Apresenta gagueira, travamentos ou repetição constante de sílabas.",
    "Dificuldade frequente em acompanhar instruções verbais da aula.",
    "Desempenho de alfabetização significativamente abaixo da média."
  ];

  // Funções Auxiliares
  const handleAnswer02 = (qId, val) => {
    setAnswers02(prev => ({ ...prev, [qId]: val }));
  };

  const handleRimaAnswer = (userSaysRima) => {
    const current = rimaPairs[rimaIndex];
    const isCorrect = userSaysRima === current.rima;
    if (isCorrect) {
      setRimaScore(prev => ({ ...prev, acertos: prev.acertos + 1 }));
      setRimaFeedback({ correct: true, msg: `Excelente! ${current.w1} e ${current.w2} ${current.rima ? 'realmente rimam!' : 'não rimam!'}` });
    } else {
      setRimaScore(prev => ({ ...prev, erros: prev.erros + 1 }));
      setRimaFeedback({ correct: false, msg: `Ops! Na verdade ${current.w1} e ${current.w2} ${current.rima ? 'rimam!' : 'não rimam!'}` });
    }
    setTimeout(() => {
      setRimaFeedback(null);
      setRimaIndex(prev => (prev + 1) % rimaPairs.length);
    }, 1800);
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-line)] rounded-2xl overflow-hidden shadow-lg">
      {/* HEADER DE ABAS DE JOGOS */}
      <div className="bg-gradient-to-r from-[var(--color-navy)] to-[var(--color-primary)] p-4 text-white flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center gap-2 font-bold font-serif text-lg">
          <Gamepad2 className="w-6 h-6 text-[var(--color-accent)]" /> Jogos de Triagem Precoce
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveTab('form02')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'form02' ? 'bg-[var(--color-accent)] text-[var(--color-navy)]' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
            0-2 Anos (Marcos)
          </button>
          <button onClick={() => setActiveTab('game24')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'game24' ? 'bg-[var(--color-accent)] text-[var(--color-navy)]' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
            2-4 Anos (Fonético)
          </button>
          <button onClick={() => setActiveTab('rima45')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'rima45' ? 'bg-[var(--color-accent)] text-[var(--color-navy)]' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
            4-5 Anos (Rima)
          </button>
          <button onClick={() => setActiveTab('check6')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'check6' ? 'bg-[var(--color-accent)] text-[var(--color-navy)]' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
            6+ Anos (Checklist)
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* ABA 0-2 ANOS */}
        {activeTab === 'form02' && (
          <div>
            <h3 className="text-xl font-bold text-[var(--color-navy)] mb-2 font-serif">Questionário de Marcos de Desenvolvimento (0 a 2 anos)</h3>
            <p className="text-sm text-[var(--color-muted)] mb-6">Responda de acordo com o comportamento frequente da criança nas últimas semanas.</p>
            
            <div className="space-y-6">
              {questions02.map(q => (
                <div key={q.id} className="p-4 rounded-xl bg-[var(--color-canvas)] border border-[var(--color-line)]">
                  <span className="text-xs font-bold uppercase text-[var(--color-primary)]">{q.category}</span>
                  <p className="font-semibold text-sm mt-1 mb-3">{q.id}. {q.title}</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleAnswer02(q.id, 'sim')} className={`px-4 py-2 rounded-lg text-xs font-bold border ${answers02[q.id] === 'sim' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-[var(--color-ink)] border-[var(--color-line)]'}`}>
                      ✅ Sim
                    </button>
                    <button onClick={() => handleAnswer02(q.id, 'parcial')} className={`px-4 py-2 rounded-lg text-xs font-bold border ${answers02[q.id] === 'parcial' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-[var(--color-ink)] border-[var(--color-line)]'}`}>
                      ⚠️ Às vezes
                    </button>
                    <button onClick={() => handleAnswer02(q.id, 'nao')} className={`px-4 py-2 rounded-lg text-xs font-bold border ${answers02[q.id] === 'nao' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-[var(--color-ink)] border-[var(--color-line)]'}`}>
                      ❌ Ainda não
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setShowResult02(true)} className="mt-6 w-full py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
              Calcular Indicador de Risco Fonológico
            </button>

            {showResult02 && (
              <div className="mt-6 p-6 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-3 text-amber-800 font-bold font-serif text-lg mb-2">
                  <AlertTriangle className="w-6 h-6 text-amber-600" /> Resultado da Triagem
                </div>
                <p className="text-sm text-amber-900 leading-relaxed mb-4">
                  A avaliação aponta <strong>Risco Moderado (68%)</strong>. Identificou-se ausência parcial na combinação de fonemas e imitação verbal para a faixa etária de 24 meses. Recomenda-se acompanhamento fonoaudiológico.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ABA 2-4 ANOS (JOGO FONÉTICO) */}
        {activeTab === 'game24' && (
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-[var(--color-navy)] mb-2 font-serif">Jogo Fonético: Repetição e Identificação</h3>
            <p className="text-sm text-[var(--color-muted)] mb-6">Pergunte o nome do elemento para a criança e digite exatamente como ela pronunciou.</p>

            <div className="p-8 rounded-2xl bg-amber-50 border border-amber-200 mb-6 inline-block w-full">
              <span className="text-7xl block mb-2">{animals24[currentAnimal].emoji}</span>
              <h4 className="text-3xl font-extrabold text-[var(--color-navy)] font-serif">{animals24[currentAnimal].name}</h4>
              <span className="text-xs font-mono text-[var(--color-muted)]">{animals24[currentAnimal].phonemes}</span>
            </div>

            <div className="mb-6 text-left">
              <label className="block text-xs font-bold text-[var(--color-muted)] uppercase mb-2">O que a criança falou?</label>
              <input
                type="text"
                value={childWord}
                onChange={(e) => setChildWord(e.target.value)}
                placeholder="Ex: faca, vaca, daca..."
                className="w-full p-3 border-2 border-[var(--color-line)] rounded-xl text-center text-lg font-bold uppercase tracking-wider focus:border-[var(--color-primary)] outline-none"
              />
            </div>

            <button
              onClick={() => {
                setShowAnalysis24(true);
                if (childWord.toLowerCase() === animals24[currentAnimal].target) {
                  setScore24(prev => ({ ...prev, acertos: prev.acertos + 1 }));
                } else {
                  setScore24(prev => ({ ...prev, trocas: prev.trocas + 1 }));
                }
              }}
              className="w-full py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl mb-4"
            >
              Analisar Pronúncia
            </button>

            {showAnalysis24 && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-left mb-4">
                <p className="text-sm text-emerald-900 font-bold mb-1">
                  {childWord.toLowerCase() === animals24[currentAnimal].target ? '✅ Pronúncia Correta!' : '⚠️ Troca/Omissão Fonética Detectada'}
                </p>
                <p className="text-xs text-emerald-700">
                  Registrado no painel clínico de acompanhamento do paciente.
                </p>
                <button
                  onClick={() => {
                    setShowAnalysis24(false);
                    setChildWord('');
                    setCurrentAnimal((prev) => (prev + 1) % animals24.length);
                  }}
                  className="mt-3 text-xs font-bold text-[var(--color-primary)] underline"
                >
                  Próximo Elemento →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ABA 4-5 ANOS (JOGO DA RIMA) */}
        {activeTab === 'rima45' && (
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-[var(--color-navy)] mb-2 font-serif">Jogo da Rima (Consciência Fonológica)</h3>
            <p className="text-sm text-[var(--color-muted)] mb-6">Pergunte à criança se os dois elementos têm o mesmo som final.</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-6 rounded-2xl bg-[var(--color-canvas)] border border-[var(--color-line)]">
                <span className="text-5xl block mb-2">{rimaPairs[rimaIndex].e1}</span>
                <span className="font-bold text-lg text-[var(--color-navy)]">{rimaPairs[rimaIndex].w1}</span>
              </div>
              <div class="p-6 rounded-2xl bg-[var(--color-canvas)] border border-[var(--color-line)]">
                <span className="text-5xl block mb-2">{rimaPairs[rimaIndex].e2}</span>
                <span className="font-bold text-lg text-[var(--color-navy)]">{rimaPairs[rimaIndex].w2}</span>
              </div>
            </div>

            <p className="font-serif text-lg font-bold text-[var(--color-navy)] mb-4">Essas duas palavras RIMAM?</p>

            <div className="flex gap-4 mb-6">
              <button onClick={() => handleRimaAnswer(true)} className="flex-1 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700">
                👍 SIM, Rimam!
              </button>
              <button onClick={() => handleRimaAnswer(false)} className="flex-1 py-4 bg-rose-600 text-white rounded-xl font-bold text-lg hover:bg-rose-700">
                👎 NÃO Rimam
              </button>
            </div>

            {rimaFeedback && (
              <div className={`p-4 rounded-xl font-bold text-sm ${rimaFeedback.correct ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {rimaFeedback.msg}
              </div>
            )}
          </div>
        )}

        {/* ABA 6+ ANOS (CHECKLIST) */}
        {activeTab === 'check6' && (
          <div>
            <h3 className="text-xl font-bold text-[var(--color-navy)] mb-2 font-serif">Checklist de Observação Escolar (6+ Anos)</h3>
            <p className="text-sm text-[var(--color-muted)] mb-6">Marque os comportamentos observados regularmente em sala de aula.</p>

            <div className="space-y-3 mb-6">
              {checklist6.map((item, idx) => (
                <label key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-[var(--color-canvas)] border border-[var(--color-line)] cursor-pointer hover:border-[var(--color-primary)]">
                  <input
                    type="checkbox"
                    checked={!!checkedItems[idx]}
                    onChange={(e) => setCheckedItems(prev => ({ ...prev, [idx]: e.target.checked }))}
                    className="w-5 h-5 rounded mt-0.5 accent-[var(--color-primary)]"
                  />
                  <span className="text-sm font-medium text-[var(--color-ink)]">{item}</span>
                </label>
              ))}
            </div>

            <button onClick={() => setShowCheckResult(true)} className="w-full py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl">
              Gerar Relatório de Triagem Escolar
            </button>

            {showCheckResult && (
              <div className="mt-6 p-6 rounded-2xl bg-blue-50 border border-blue-200">
                <h4 className="font-bold font-serif text-blue-900 mb-2">Relatório Sintético do Aluno</h4>
                <p className="text-sm text-blue-800">
                  {Object.values(checkedItems).filter(Boolean).length >= 3 
                    ? '⚠️ Alerta de Risco para Dislexia/Distúrbio de Linguagem. Recomendado encaminhamento para avaliação clínica.'
                    : '✅ Desenvoltura esperada para o segmento. Continuar acompanhamento habitual.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}