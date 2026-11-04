import { X, Volume2, VolumeX, Save, RotateCcw, CheckCircle2, Sliders, UserCheck } from 'lucide-react';
import { useA11y } from '../context/A11yContext';

export default function A11yModal({ isOpen, onClose }) {
  const {
    textSize,
    setTextSize,
    highContrast,
    setHighContrast,
    darkMode,
    setDarkMode,
    bgColor,
    setBgColor,
    textColor,
    setTextColor,
    lineHeight,
    setLineHeight,
    letterSpacing,
    setLetterSpacing,
    savedNotice,
    savePreferences,
    resetDefaults,
    isPlaying,
    voiceGender,
    setVoiceGender,
    speechRate,
    setSpeechRate,
    speakPageContent,
    stopSpeaking,
  } = useA11y();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-surface rounded-2xl border border-navy/20 p-6 shadow-2xl relative space-y-5 text-navy font-sans max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-line pb-3">
          <h2 className="text-xl font-bold font-serif text-navy flex items-center gap-2">
            ♿ Painel de Acessibilidade
          </h2>
          <button
            onClick={onClose}
            className="text-navy/70 hover:text-navy p-1 rounded-md"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* LEITOR DE VOZ DENTRO DO MODAL */}
        <div className="p-4 rounded-xl bg-mist border border-line space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-navy flex items-center gap-1.5">
              <Volume2 size={16} className="text-primary" /> Leitor de Voz da Página
            </span>
            <button
              type="button"
              onClick={() => (isPlaying ? stopSpeaking() : speakPageContent())}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                isPlaying 
                  ? 'bg-rose-600 text-white animate-pulse' 
                  : 'bg-primary text-white hover:brightness-90 shadow-sm'
              }`}
            >
              {isPlaying ? <VolumeX size={14} /> : <Volume2 size={14} />}
              {isPlaying ? 'Parar Leitura' : 'Ouvir Agora'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-ink mb-1 flex items-center gap-1">
                <UserCheck size={13} /> Voz do Leitor:
              </label>
              <select
                value={voiceGender}
                onChange={(e) => setVoiceGender(e.target.value)}
                className="w-full p-2 rounded-md border border-line bg-surface text-xs font-bold text-navy"
              >
                <option value="female">Feminina</option>
                <option value="male">Masculina</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-ink mb-1 flex items-center gap-1">
                <Sliders size={13} /> Velocidade:
              </label>
              <select
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                className="w-full p-2 rounded-md border border-line bg-surface text-xs font-bold text-navy"
              >
                <option value={0.75}>0.75x (Lento)</option>
                <option value={1}>1.0x (Normal)</option>
                <option value={1.25}>1.25x (Rápido)</option>
                <option value={1.5}>1.5x (Muito Rápido)</option>
                <option value={2}>2.0x (Máximo)</option>
              </select>
            </div>
          </div>
        </div>

        {/* AJUSTES VISUAIS */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-navy">Tamanho do texto</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTextSize(Math.max(80, textSize - 10))}
              className="flex-1 py-2 px-3 border border-primary rounded-lg text-xs font-bold text-primary hover:bg-mist"
            >
              – Reduzir
            </button>
            <button
              type="button"
              onClick={() => setTextSize(Math.min(140, textSize + 10))}
              className="flex-1 py-2 px-3 border border-primary rounded-lg text-xs font-bold text-primary hover:bg-mist"
            >
              + Aumentar
            </button>
          </div>
        </div>

        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between text-xs font-medium">
            <span>Alto contraste</span>
            <button
              type="button"
              onClick={() => setHighContrast(!highContrast)}
              className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                highContrast ? 'bg-primary' : 'bg-slate-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${highContrast ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs font-medium">
            <span>Modo escuro</span>
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                darkMode ? 'bg-primary' : 'bg-slate-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-navy mb-1">Cor de fundo</label>
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full p-2 border border-line rounded-lg text-xs text-ink bg-surface font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-navy mb-1">Cor do texto</label>
            <input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-full p-2 border border-line rounded-lg text-xs text-ink bg-surface font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-navy mb-1">Entre linhas</label>
            <select
              value={lineHeight}
              onChange={(e) => setLineHeight(e.target.value)}
              className="w-full p-2 border border-line rounded-lg text-xs text-ink bg-surface"
            >
              <option value="1.0x">1.0x</option>
              <option value="1.5x">1.5x</option>
              <option value="2.0x">2.0x</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-navy mb-1">Entre letras</label>
            <select
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(e.target.value)}
              className="w-full p-2 border border-line rounded-lg text-xs text-ink bg-surface"
            >
              <option value="Normal">Normal</option>
              <option value="Expandido">Expandido</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={savePreferences}
            className="w-full py-2.5 bg-primary text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:brightness-90 transition-all shadow-sm"
          >
            <Save size={16} /> Salvar preferências
          </button>

          <button
            type="button"
            onClick={resetDefaults}
            className="w-full flex items-center justify-start gap-1 text-[11px] font-bold text-navy hover:underline px-1"
          >
            <RotateCcw size={13} /> Restaurar padrão
          </button>
        </div>

        {savedNotice && (
          <div className="p-3 rounded-xl bg-emerald-50 border-l-4 border-emerald-500 flex items-center gap-2 text-xs font-bold text-emerald-950">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            Preferências salvas com sucesso!
          </div>
        )}
      </div>
    </div>
  );
}