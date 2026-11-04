import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  A11Y_STORAGE_KEY,
  BACKGROUND_OPTIONS,
  DEFAULT_SETTINGS,
  DEFAULT_VOICE,
  FONT_MAX,
  FONT_MIN,
  FONT_STEP,
  LEADING_OPTIONS,
  SPEECH_RATES,
  TEXT_OPTIONS,
  TRACKING_OPTIONS,
  VOICE_OPTIONS,
} from '../utils/constants';

const noop = () => {};
const CHARS_PER_SECOND = 14; // estimativa de leitura em pt-BR a 1× (só para o relógio do player)
const EMPTY_TIMELINE = { prefix: [0], lengths: [], total: 0 };

const A11yContext = createContext({
  settings: DEFAULT_SETTINGS,
  draft: DEFAULT_SETTINGS,
  updateDraft: noop,
  hasUnsavedChanges: false,
  discardDraft: noop,
  savePreferences: noop,
  resetDefaults: noop,
  saveStatus: null,
  voiceGender: DEFAULT_VOICE.gender,
  setVoiceGender: noop,
  speechRate: DEFAULT_VOICE.rate,
  setSpeechRate: noop,
  isPlaying: false,
  isPlayerOpen: false,
  playerStatus: 'idle',
  currentTime: 0,
  duration: 0,
  speed: DEFAULT_VOICE.rate,
  volume: 100,
  pageTitle: '',
  speakPageContent: noop,
  speakText: noop,
  stopSpeaking: noop,
  playAudio: noop,
  pauseAudio: noop,
  stopAudio: noop,
  restartAudio: noop,
  setSpeed: noop,
  setVolume: noop,
});

/* ---------- preferências salvas ---------- */

function loadPreferences() {
  const fallback = { settings: DEFAULT_SETTINGS, voice: DEFAULT_VOICE };

  try {
    const raw = JSON.parse(window.localStorage.getItem(A11Y_STORAGE_KEY));
    if (!raw || typeof raw !== 'object') return fallback;

    const settings = { ...DEFAULT_SETTINGS };

    const font = Number(raw.fontPercent);
    if (font >= FONT_MIN && font <= FONT_MAX) {
      settings.fontPercent = Math.round(font / FONT_STEP) * FONT_STEP;
    }

    ['highContrast', 'darkMode', 'reduceMotion', 'largeTargets'].forEach((key) => {
      settings[key] = raw[key] === true;
    });

    if (BACKGROUND_OPTIONS.some((option) => option.id === raw.bgColor)) settings.bgColor = raw.bgColor;
    if (TEXT_OPTIONS.some((option) => option.id === raw.textColor)) settings.textColor = raw.textColor;
    if (LEADING_OPTIONS.some((option) => option.value === raw.leading)) settings.leading = raw.leading;
    if (TRACKING_OPTIONS.some((option) => option.value === raw.tracking)) settings.tracking = raw.tracking;

    const voice = {
      gender: VOICE_OPTIONS.some((option) => option.value === raw.voiceGender) ? raw.voiceGender : DEFAULT_VOICE.gender,
      rate: SPEECH_RATES.some((option) => option.value === Number(raw.speechRate)) ? Number(raw.speechRate) : DEFAULT_VOICE.rate,
    };

    return { settings, voice };
  } catch {
    return fallback;
  }
}

/* ---------- aplicação no documento ---------- */

function setAttr(root, name, value) {
  if (value) root.setAttribute(name, value);
  else root.removeAttribute(name);
}

function setVar(root, name, value) {
  if (value) root.style.setProperty(name, value);
  else root.style.removeProperty(name);
}

function applyToDocument(settings) {
  const root = document.documentElement;

  root.style.fontSize = `${settings.fontPercent}%`;
  setAttr(root, 'data-theme', settings.darkMode && 'dark');
  setAttr(root, 'data-contrast', settings.highContrast && 'high');
  setAttr(root, 'data-motion', settings.reduceMotion && 'reduce');
  setAttr(root, 'data-targets', settings.largeTargets && 'large');

  const leading = settings.leading !== 'normal' ? settings.leading : null;
  setAttr(root, 'data-leading', leading);
  setVar(root, '--a11y-leading', leading);

  const tracking = settings.tracking !== 'normal' ? settings.tracking : null;
  setAttr(root, 'data-tracking', tracking);
  setVar(root, '--a11y-tracking', tracking);

  const bgHex = BACKGROUND_OPTIONS.find((option) => option.id === settings.bgColor)?.hex;
  setAttr(root, 'data-a11y-bg', bgHex && settings.bgColor);
  setVar(root, '--a11y-bg', bgHex);

  const textHex = TEXT_OPTIONS.find((option) => option.id === settings.textColor)?.hex;
  setAttr(root, 'data-a11y-text', textHex && settings.textColor);
  setVar(root, '--a11y-text', textHex);
}

/* ---------- leitor de voz ---------- */

const supportsSpeech = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

// Quebra o texto em frases curtas: o progresso fica mais preciso e as vozes online não travam em textos longos
function splitIntoChunks(text) {
  const prepared = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (/[.!?…:;]$/.test(line) ? line : `${line}.`))
    .join(' ');

  const chunks = [];
  (prepared.match(/[^.!?…]+[.!?…]*\s*/g) || []).forEach((sentence) => {
    let rest = sentence.trim();
    while (rest.length > 200) {
      let cut = rest.lastIndexOf(' ', 200);
      if (cut < 80) cut = 200;
      chunks.push(rest.slice(0, cut).trim());
      rest = rest.slice(cut).trim();
    }
    if (rest) chunks.push(rest);
  });
  return chunks;
}

function pickVoice(voices, gender) {
  const portuguese = voices.filter((voice) => voice.lang && /pt|br/i.test(voice.lang));
  const matcher =
    gender === 'male'
      ? /\bmale\b|daniel|felipe|ricardo|homem|masculin/i
      : /female|luciana|maria|helena|google português|mulher|feminin/i;
  return portuguese.find((voice) => matcher.test(voice.name)) || portuguese[gender === 'male' ? 1 : 0] || portuguese[0] || voices[0] || null;
}

/* ---------- provider ---------- */

export function A11yProvider({ children }) {
  const [initial] = useState(loadPreferences);

  // applied = o que está valendo no site; draft = o que está sendo editado no painel
  const [state, setState] = useState({ applied: initial.settings, draft: initial.settings });
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'warning' | 'reset' | null

  const [voiceGender, setVoiceGender] = useState(initial.voice.gender);
  const [speechRate, setSpeechRate] = useState(initial.voice.rate);
  const [volume, setVolume] = useState(100);
  const [availableVoices, setAvailableVoices] = useState([]);

  const [playerStatus, setPlayerStatus] = useState('idle'); // 'idle' | 'playing' | 'paused' | 'done'
  const [pageTitle, setPageTitle] = useState('');
  const [timeline, setTimeline] = useState(EMPTY_TIMELINE);
  const [position, setPosition] = useState({ index: 0, elapsed: 0 });

  const chunksRef = useRef([]);
  const indexRef = useRef(0);
  const runRef = useRef(0); // invalida callbacks de falas antigas
  const liveRef = useRef({ rate: speechRate, volume, gender: voiceGender, voices: [] });

  useEffect(() => {
    liveRef.current = { rate: speechRate, volume, gender: voiceGender, voices: availableVoices };
  }, [speechRate, volume, voiceGender, availableVoices]);

  // Só o que foi salvo vai para a página
  useLayoutEffect(() => {
    applyToDocument(state.applied);
  }, [state.applied]);

  const updateDraft = useCallback((patch) => {
    setState((current) => ({ ...current, draft: { ...current.draft, ...patch } }));
    setSaveStatus(null);
  }, []);

  const discardDraft = useCallback(() => {
    setState((current) => ({ ...current, draft: current.applied }));
    setSaveStatus(null);
  }, []);

  const hasUnsavedChanges = Object.keys(state.draft).some((key) => state.draft[key] !== state.applied[key]);

  const savePreferences = () => {
    const next = state.draft;
    setState({ applied: next, draft: next });

    try {
      window.localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify({ ...next, voiceGender, speechRate }));
      setSaveStatus('success');
    } catch {
      setSaveStatus('warning');
    }
  };

  const resetDefaults = () => {
    setState({ applied: DEFAULT_SETTINGS, draft: DEFAULT_SETTINGS });
    setVoiceGender(DEFAULT_VOICE.gender);
    setSpeechRate(DEFAULT_VOICE.rate);

    try {
      window.localStorage.removeItem(A11Y_STORAGE_KEY);
    } catch {
      // sem armazenamento, nada para limpar
    }
    setSaveStatus('reset');
  };

  /* vozes + parar a leitura ao trocar de página */
  useEffect(() => {
    if (!supportsSpeech()) return undefined;
    const synth = window.speechSynthesis;

    const updateVoices = () => setAvailableVoices(synth.getVoices() || []);
    const stopOnNavigate = () => {
      runRef.current += 1;
      synth.cancel();
      setPlayerStatus('idle');
    };

    updateVoices();
    synth.onvoiceschanged = updateVoices;
    window.addEventListener('hashchange', stopOnNavigate);

    return () => {
      synth.onvoiceschanged = null;
      window.removeEventListener('hashchange', stopOnNavigate);
      synth.cancel();
    };
  }, []);

  // Relógio do player enquanto fala
  useEffect(() => {
    if (playerStatus !== 'playing') return undefined;
    const timer = setInterval(() => setPosition((current) => ({ ...current, elapsed: current.elapsed + 0.25 })), 250);
    return () => clearInterval(timer);
  }, [playerStatus]);

  const buildUtterance = (text, overrides = {}) => {
    const live = liveRef.current;
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickVoice(live.voices, live.gender);
    if (voice) utterance.voice = voice;
    utterance.lang = 'pt-BR';
    utterance.rate = overrides.rate ?? live.rate;
    utterance.volume = (overrides.volume ?? live.volume) / 100;
    return utterance;
  };

  const speakChunk = (index, overrides) => {
    const runId = ++runRef.current;
    window.speechSynthesis.cancel();

    const chunks = chunksRef.current;
    if (index >= chunks.length) {
      setPlayerStatus('done');
      return;
    }

    indexRef.current = index;
    setPosition({ index, elapsed: 0 });
    setPlayerStatus('playing');

    const utterance = buildUtterance(chunks[index], overrides);
    utterance.onend = () => {
      if (runRef.current === runId) speakChunk(index + 1);
    };
    utterance.onerror = (event) => {
      if (runRef.current !== runId || event.error === 'canceled' || event.error === 'interrupted') return;
      setPlayerStatus('idle');
    };
    window.speechSynthesis.speak(utterance);
  };

  const startReading = (customText) => {
    if (!supportsSpeech()) {
      alert('Seu navegador não suporta leitura por síntese de voz.');
      return;
    }

    const root = document.querySelector('main') || document.body;
    const text = (typeof customText === 'string' ? customText : root.innerText).slice(0, 8000);
    const chunks = splitIntoChunks(text);
    if (chunks.length === 0) return;

    const lengths = chunks.map((chunk) => chunk.length);
    const prefix = lengths.reduce((acc, length) => [...acc, acc[acc.length - 1] + length], [0]);

    chunksRef.current = chunks;
    setTimeline({ prefix, lengths, total: prefix[prefix.length - 1] });
    setPageTitle(root.querySelector('h1')?.textContent?.trim() || document.title || 'Página');
    speakChunk(0);
  };

  // Liga e desliga (usado pelos botões "Ouvir página")
  const speakPageContent = (customText) => {
    if (playerStatus !== 'idle' && typeof customText !== 'string') {
      stopAudio();
      return;
    }
    startReading(customText);
  };

  // Fala uma palavra ou frase curta sem abrir o player
  const speakText = (text) => {
    if (!supportsSpeech()) {
      alert('Seu navegador não suporta leitura por síntese de voz.');
      return;
    }
    runRef.current += 1;
    setPlayerStatus('idle');
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(buildUtterance(text));
  };

  const playAudio = () => {
    if (playerStatus === 'playing') return;
    speakChunk(playerStatus === 'done' ? 0 : indexRef.current);
  };

  // Pausa de forma estável: para a frase atual e retoma do começo dela
  const pauseAudio = () => {
    if (playerStatus !== 'playing') return;
    runRef.current += 1;
    window.speechSynthesis.cancel();
    setPlayerStatus('paused');
  };

  function stopAudio() {
    runRef.current += 1;
    if (supportsSpeech()) window.speechSynthesis.cancel();
    setPlayerStatus('idle');
  }

  const restartAudio = () => speakChunk(0);

  const setSpeed = (rate) => {
    setSpeechRate(rate);
    if (playerStatus === 'playing') speakChunk(indexRef.current, { rate });
  };

  /* relógio do player */
  const effectiveSpeed = CHARS_PER_SECOND * speechRate;
  const charsBefore = timeline.prefix[position.index] ?? 0;
  const withinChunk = Math.min(timeline.lengths[position.index] ?? 0, position.elapsed * effectiveSpeed);
  const charsDone = playerStatus === 'done' ? timeline.total : charsBefore + withinChunk;

  return (
    <A11yContext.Provider
      value={{
        settings: state.applied,
        draft: state.draft,
        updateDraft,
        hasUnsavedChanges,
        discardDraft,
        savePreferences,
        resetDefaults,
        saveStatus,
        voiceGender,
        setVoiceGender,
        speechRate,
        setSpeechRate,
        isPlaying: playerStatus !== 'idle',
        isPlayerOpen: playerStatus !== 'idle',
        playerStatus,
        currentTime: charsDone / effectiveSpeed,
        duration: timeline.total / effectiveSpeed,
        speed: speechRate,
        volume,
        pageTitle,
        speakPageContent,
        speakText,
        stopSpeaking: stopAudio,
        playAudio,
        pauseAudio,
        stopAudio,
        restartAudio,
        setSpeed,
        setVolume,
      }}
    >
      {children}
    </A11yContext.Provider>
  );
}

export const useA11y = () => useContext(A11yContext);