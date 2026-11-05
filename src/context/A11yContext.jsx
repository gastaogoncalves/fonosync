import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  A11Y_STORAGE_KEY,
  BUTTON_OPTIONS,
  COLOR_MODE_OPTIONS,
  DEFAULT_SETTINGS,
  DEFAULT_VOICE,
  FONT_MAX,
  FONT_MIN,
  FONT_STEP,
  LEADING_OPTIONS,
  SPEECH_RATE_MAX,
  SPEECH_RATE_MIN,
  SPEECH_RATE_STEP,
  TEXT_OPTIONS,
  TRACKING_OPTIONS,
  VOICE_OPTIONS,
} from '../utils/constants';

const noop = () => {};

const A11yContext = createContext({
  settings: DEFAULT_SETTINGS,
  updateSettings: noop,
  hasUnsavedChanges: false,
  savePreferences: noop,
  resetDefaults: noop,
  saveStatus: null,
  voiceGender: DEFAULT_VOICE.gender,
  setVoiceGender: noop,
  speechSupported: false,
  voiceInfo: { exact: false, hasPortuguese: false, name: null },
  speechRate: DEFAULT_VOICE.rate,
  setSpeechRate: noop,
  isPlaying: false,
  playerStatus: 'idle',
  pageTitle: '',
  speakPageContent: noop,
  speakText: noop,
  stopSpeaking: noop,
});

const validRate = (value) => Number(value) >= SPEECH_RATE_MIN && Number(value) <= SPEECH_RATE_MAX;
const roundRate = (value) => Math.round(Number(value) / SPEECH_RATE_STEP) * SPEECH_RATE_STEP;

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

    if (COLOR_MODE_OPTIONS.some((option) => option.value === raw.colorMode)) settings.colorMode = raw.colorMode;
    if (BUTTON_OPTIONS.some((option) => option.id === raw.buttonColor)) settings.buttonColor = raw.buttonColor;
    if (TEXT_OPTIONS.some((option) => option.id === raw.textColor)) settings.textColor = raw.textColor;
    if (LEADING_OPTIONS.some((option) => option.value === raw.leading)) settings.leading = raw.leading;
    if (TRACKING_OPTIONS.some((option) => option.value === raw.tracking)) settings.tracking = raw.tracking;

    const voice = {
      gender: VOICE_OPTIONS.some((option) => option.value === raw.voiceGender) ? raw.voiceGender : DEFAULT_VOICE.gender,
      rate: validRate(raw.speechRate) ? roundRate(raw.speechRate) : DEFAULT_VOICE.rate,
    };

    return { settings, voice };
  } catch {
    return fallback;
  }
}

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

  setAttr(root, 'data-colorblind', settings.colorMode !== 'default' && settings.colorMode);

  const buttonHex = BUTTON_OPTIONS.find((option) => option.id === settings.buttonColor)?.hex;
  setAttr(root, 'data-a11y-button', buttonHex && settings.buttonColor);
  setVar(root, '--a11y-button', buttonHex);

  const textHex = TEXT_OPTIONS.find((option) => option.id === settings.textColor)?.hex;
  setAttr(root, 'data-a11y-text', textHex && settings.textColor);
  setVar(root, '--a11y-text', textHex);
}

const COLOR_MATRICES = {
  protanopia: '1 0 0 0 0  0.4789 0.4769 0.0442 0 0  0.5973 -0.6887 1.0914 0 0  0 0 0 1 0',
  deuteranopia: '1 0 0 0 0  0.1628 0.725 0.1122 0 0  0.4547 -0.6454 1.1907 0 0  0 0 0 1 0',
  tritanopia: '0.7412 -0.4072 0.666 0 0  0.0751 0.5852 0.3397 0 0  0 0 1 0 0  0 0 0 1 0',
};

function ColorFilters() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: 'absolute' }}>
      {Object.entries(COLOR_MATRICES).map(([name, values]) => (
        <filter key={name} id={`a11y-${name}`} colorInterpolationFilters="linearRGB">
          <feColorMatrix type="matrix" values={values} />
        </filter>
      ))}
      <filter id="a11y-achromatopsia" colorInterpolationFilters="linearRGB">
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </svg>
  );
}

const supportsSpeech = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

function splitIntoChunks(text) {
  // Limpa e divide o texto em frases menores para evitar o corte do navegador
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const sentences = cleaned.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [cleaned];
  return sentences.map(s => s.trim()).filter(Boolean);
}

const MALE_VOICE = /\b(male|masculin[oa]?|homem)\b|daniel|felipe|ricardo|ant[oô]nio|donato|f[aá]bio|humberto|j[uú]lio|leandro|nicolau|val[eé]rio|thiago|eddy|reed|rocko|grandpa/i;
const FEMALE_VOICE = /female|feminin[oa]?|mulher|luciana|fernanda|maria|francisca|helena|helo[ií]sa|thalita|brenda|giovanna|let[ií]cia|manuela|yara|elza|joana|google portugu[eê]s|\bflo\b|sandy|shelley|grandma/i;
const MALE_FALLBACK_PITCH = 0.6;

const isBrazilian = (voice) => /^pt[-_]br$/i.test(voice.lang || '');

function resolveVoice(voices, gender) {
  const portuguese = voices.filter((voice) => /^pt([-_]|$)/i.test(voice.lang || ''));
  const ordered = [...portuguese.filter(isBrazilian), ...portuguese.filter((voice) => !isBrazilian(voice))];

  const wanted = gender === 'male' ? MALE_VOICE : FEMALE_VOICE;
  const other = gender === 'male' ? FEMALE_VOICE : MALE_VOICE;

  const exact = ordered.find((voice) => wanted.test(voice.name));
  if (exact) return { voice: exact, pitch: 1, exact: true };

  const neutral = ordered.find((voice) => !other.test(voice.name)) || ordered[0] || voices[0] || null;
  return { voice: neutral, pitch: gender === 'male' ? MALE_FALLBACK_PITCH : 1, exact: false };
}

function readablePageText() {
  const container = document.querySelector('main') || document.body;
  if (!container) return document.title || 'Página';

  const clone = container.cloneNode(true);
  clone.querySelectorAll('[data-a11y-skip], script, style, noscript').forEach((el) => el.remove());

  const text = clone.innerText || clone.textContent || '';
  return text.trim() || document.title || 'Conteúdo da página';
}

export function A11yProvider({ children }) {
  const [initial] = useState(loadPreferences);

  const [settings, setSettings] = useState(initial.settings);
  const [saved, setSaved] = useState(initial.settings);
  const [saveStatus, setSaveStatus] = useState(null);

  const [voiceGender, setVoiceGender] = useState(initial.voice.gender);
  const [speechRate, setSpeechRate] = useState(initial.voice.rate);
  const [savedVoice, setSavedVoice] = useState(initial.voice);
  const [availableVoices, setAvailableVoices] = useState([]);

  const [playerStatus, setPlayerStatus] = useState('idle');

  const chunksRef = useRef([]);
  const indexRef = useRef(0);
  const liveRef = useRef({ rate: speechRate, gender: voiceGender, voices: [] });

  useEffect(() => {
    liveRef.current = { rate: speechRate, gender: voiceGender, voices: availableVoices };
  }, [speechRate, voiceGender, availableVoices]);

  useLayoutEffect(() => {
    applyToDocument(settings);
  }, [settings]);

  const updateSettings = useCallback((patch) => {
    setSettings((current) => ({ ...current, ...patch }));
    setSaveStatus(null);
  }, []);

  const hasUnsavedChanges =
    Object.keys(settings).some((key) => settings[key] !== saved[key]) ||
    voiceGender !== savedVoice.gender ||
    speechRate !== savedVoice.rate;

  const savePreferences = () => {
    setSaved(settings);
    setSavedVoice({ gender: voiceGender, rate: speechRate });

    try {
      window.localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify({ ...settings, voiceGender, speechRate }));
      setSaveStatus('success');
    } catch {
      setSaveStatus('warning');
    }
  };

  const resetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    setSaved(DEFAULT_SETTINGS);
    setSavedVoice(DEFAULT_VOICE);
    setVoiceGender(DEFAULT_VOICE.gender);
    setSpeechRate(DEFAULT_VOICE.rate);
    liveRef.current = { ...liveRef.current, gender: DEFAULT_VOICE.gender, rate: DEFAULT_VOICE.rate };

    try {
      window.localStorage.removeItem(A11Y_STORAGE_KEY);
    } catch {}
    setSaveStatus('reset');
  };

  useEffect(() => {
    if (!supportsSpeech()) return undefined;
    const synth = window.speechSynthesis;

    const updateVoices = () => {
      const voices = synth.getVoices() || [];
      setAvailableVoices(voices);
    };

    updateVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = updateVoices;
    }

    const stopOnNavigate = () => {
      synth.cancel();
      setPlayerStatus('idle');
    };

    window.addEventListener('hashchange', stopOnNavigate);

    return () => {
      synth.onvoiceschanged = null;
      window.removeEventListener('hashchange', stopOnNavigate);
      synth.cancel();
    };
  }, []);

  const speakNextChunk = () => {
    if (!supportsSpeech()) return;
    const synth = window.speechSynthesis;

    if (indexRef.current >= chunksRef.current.length) {
      setPlayerStatus('done');
      return;
    }

    const textChunk = chunksRef.current[indexRef.current];
    const live = liveRef.current;
    const utterance = new SpeechSynthesisUtterance(textChunk);

    const { voice, pitch } = resolveVoice(live.voices, live.gender);
    if (voice) utterance.voice = voice;
    utterance.lang = 'pt-BR';
    utterance.pitch = pitch;
    utterance.rate = live.rate;
    utterance.volume = 1.0;

    utterance.onend = () => {
      indexRef.current += 1;
      speakNextChunk();
    };

    utterance.onerror = () => {
      setPlayerStatus('idle');
    };

    setPlayerStatus('playing');
    synth.speak(utterance);
  };

  const startReading = (customText) => {
    if (!supportsSpeech()) {
      alert('Seu navegador não suporta leitura por síntese de voz.');
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel(); // Limpa qualquer áudio anterior preso na fila

    const textToRead = (typeof customText === 'string' ? customText : readablePageText());
    const chunks = splitIntoChunks(textToRead);
    
    if (chunks.length === 0) return;

    chunksRef.current = chunks;
    indexRef.current = 0;

    // Pequeno atraso para garantir que o navegador processe o cancel() antes de iniciar
    setTimeout(() => {
      synth.resume();
      speakNextChunk();
    }, 100);
  };

  const speakPageContent = (customText) => {
    if (playerStatus === 'playing' && typeof customText !== 'string') {
      stopAudio();
      return;
    }
    startReading(customText);
  };

  const speakText = (text) => {
    if (!supportsSpeech()) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    synth.resume();

    const live = liveRef.current;
    const utterance = new SpeechSynthesisUtterance(text);
    const { voice, pitch } = resolveVoice(live.voices, live.gender);
    if (voice) utterance.voice = voice;
    utterance.lang = 'pt-BR';
    utterance.pitch = pitch;
    utterance.rate = live.rate;
    utterance.volume = 1.0;

    synth.speak(utterance);
  };

  function stopAudio() {
    if (supportsSpeech()) {
      window.speechSynthesis.cancel();
    }
    setPlayerStatus('idle');
  }

  const setSpeed = (value) => {
    const rate = roundRate(Math.min(SPEECH_RATE_MAX, Math.max(SPEECH_RATE_MIN, Number(value))));
    setSpeechRate(rate);
    liveRef.current = { ...liveRef.current, rate };
  };

  const changeVoiceGender = (gender) => {
    setVoiceGender(gender);
    liveRef.current = { ...liveRef.current, gender };
  };

  const resolved = resolveVoice(availableVoices, voiceGender);
  const voiceInfo = { exact: resolved.exact, hasPortuguese: Boolean(resolved.voice), name: resolved.voice?.name ?? null };

  return (
    <A11yContext.Provider
      value={{
        settings,
        updateSettings,
        hasUnsavedChanges,
        savePreferences,
        resetDefaults,
        saveStatus,
        voiceGender,
        setVoiceGender: changeVoiceGender,
        speechRate,
        setSpeechRate: setSpeed,
        speechSupported: supportsSpeech(),
        voiceInfo,
        isPlaying: playerStatus === 'playing',
        playerStatus,
        speakPageContent,
        speakText,
        stopSpeaking: stopAudio,
      }}
    >
      {children}
      <ColorFilters />
    </A11yContext.Provider>
  );
}

export const useA11y = () => useContext(A11yContext);