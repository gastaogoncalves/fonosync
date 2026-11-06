import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { A11yContext } from '../hooks/useA11y';
import { clearReadingHighlight, collectPageText, highlightWordAt, splitPageText } from '../utils/readingHighlight';
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
    if ([...BUTTON_OPTIONS.light, ...BUTTON_OPTIONS.dark].some((option) => option.id === raw.buttonColor)) settings.buttonColor = raw.buttonColor;
    if ([...TEXT_OPTIONS.light, ...TEXT_OPTIONS.dark].some((option) => option.id === raw.textColor)) settings.textColor = raw.textColor;
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

  setAttr(root, 'data-color-vision', settings.colorMode !== 'default' && settings.colorMode);

  const theme = settings.darkMode ? 'dark' : 'light';
  const buttonHex = !settings.highContrast && BUTTON_OPTIONS[theme].find((option) => option.id === settings.buttonColor)?.hex;
  setAttr(root, 'data-a11y-button', buttonHex && settings.buttonColor);
  setVar(root, '--a11y-button', buttonHex);

  const textHex = !settings.highContrast && TEXT_OPTIONS[theme].find((option) => option.id === settings.textColor)?.hex;
  setAttr(root, 'data-a11y-text', textHex && settings.textColor);
  setVar(root, '--a11y-text', textHex);
}

// média de caracteres falados por segundo na velocidade 1x
const CHARS_PER_SECOND = 14;

const supportsSpeech = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

function splitIntoChunks(text) {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const sentences = cleaned.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [cleaned];
  return sentences.map(s => s.trim()).filter(Boolean);
}

const MALE_VOICE = /\b(male|masculin[oa]?|homem)\b|daniel|felipe|ricardo|ant[oô]nio|donato|f[aá]bio|humberto|j[uú]lio|leandro|nicolau|val[eé]rio|thiago|eddy|reed|rocko|grandpa/i;
const FEMALE_VOICE = /female|feminin[oa]?|mulher|luciana|fernanda|maria|francisca|helena|helo[ií]sa|thalita|brenda|giovanna|let[ií]cia|manuela|yara|elza|joana|google portugu[eê]s|\bflo\b|sandy|shelley|grandma/i;
const MALE_FALLBACK_PITCH = 0.6;

const isBrazilian = (voice) => /^pt[-_]br$/i.test(voice.lang || '');

// vozes neurais (Edge) e do Google soam mais humanas que as instaladas no sistema
function voiceScore(voice) {
  let score = isBrazilian(voice) ? 1 : 0;
  if (/natural|neural|online/i.test(voice.name)) score += 4;
  else if (/google/i.test(voice.name)) score += 2;
  return score;
}

function resolveVoice(voices, gender) {
  const portuguese = voices.filter((voice) => /^pt([-_]|$)/i.test(voice.lang || ''));
  const ordered = [...portuguese].sort((first, second) => voiceScore(second) - voiceScore(first));

  const wanted = gender === 'male' ? MALE_VOICE : FEMALE_VOICE;
  const other = gender === 'male' ? FEMALE_VOICE : MALE_VOICE;

  const exact = ordered.find((voice) => wanted.test(voice.name));
  if (exact) return { voice: exact, pitch: 1, exact: true };

  const neutral = ordered.find((voice) => !other.test(voice.name)) || ordered[0] || voices[0] || null;
  return { voice: neutral, pitch: gender === 'male' ? MALE_FALLBACK_PITCH : 1, exact: false };
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
  const [playerOpen, setPlayerOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const [volume, setVolumeState] = useState(1);
  const [spokenChars, setSpokenChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);

  const runRef = useRef(0);
  const chunkStartRef = useRef(0);
  const chunksRef = useRef([]);
  const startsRef = useRef([]);
  const pageRef = useRef(null);
  const indexRef = useRef(0);
  const liveRef = useRef({ rate: speechRate, gender: voiceGender, voices: [], volume: 1 });

  useEffect(() => {
    liveRef.current = { rate: speechRate, gender: voiceGender, voices: availableVoices, volume };
  }, [speechRate, voiceGender, availableVoices, volume]);

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
    } catch {
      // sem armazenamento, nada para limpar
    }
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
      runRef.current += 1;
      synth.cancel();
      clearReadingHighlight();
      setPlayerStatus('idle');
      setPlayerOpen(false);
    };

    window.addEventListener('hashchange', stopOnNavigate);

    return () => {
      synth.onvoiceschanged = null;
      window.removeEventListener('hashchange', stopOnNavigate);
      synth.cancel();
      clearReadingHighlight();
    };
  }, []);

  const charsBefore = (index) => chunksRef.current.slice(0, index).reduce((sum, chunk) => sum + chunk.length, 0);

  const speakChunk = (index) => {
    if (!supportsSpeech()) return;
    const synth = window.speechSynthesis;
    runRef.current += 1;
    const runId = runRef.current;
    synth.cancel();

    if (index >= chunksRef.current.length) {
      clearReadingHighlight();
      setSpokenChars(0);
      setPlayerStatus('done');
      return;
    }

    const live = liveRef.current;
    const utterance = new SpeechSynthesisUtterance(chunksRef.current[index]);
    const { voice, pitch } = resolveVoice(live.voices, live.gender);
    if (voice) utterance.voice = voice;
    utterance.lang = 'pt-BR';
    utterance.pitch = pitch;
    utterance.rate = live.rate;
    utterance.volume = live.volume;

    const page = pageRef.current;
    const start = startsRef.current[index];
    if (page) {
      highlightWordAt(page, start);
      utterance.onboundary = (event) => {
        if (runRef.current === runId && event.name === 'word') highlightWordAt(page, start + event.charIndex);
      };
    }

    utterance.onstart = () => {
      chunkStartRef.current = Date.now();
    };
    // o cancel() também dispara onend e onerror, então falas antigas são ignoradas
    utterance.onend = () => {
      if (runRef.current === runId) speakChunk(index + 1);
    };
    utterance.onerror = (event) => {
      if (runRef.current !== runId || event.error === 'interrupted' || event.error === 'canceled') return;
      clearReadingHighlight();
      setPlayerStatus('idle');
    };

    indexRef.current = index;
    chunkStartRef.current = 0;
    setSpokenChars(charsBefore(index));
    setPlayerStatus('playing');

    // o navegador precisa de um instante depois do cancel(), senão corta a fala nova
    setTimeout(() => {
      if (runRef.current !== runId) return;
      synth.resume();
      synth.speak(utterance);
    }, 100);
  };

  const startReading = (customText) => {
    if (!supportsSpeech()) {
      alert('Seu navegador não suporta leitura por síntese de voz.');
      return;
    }

    let chunks;
    if (typeof customText === 'string') {
      pageRef.current = null;
      chunks = splitIntoChunks(customText);
    } else {
      const page = collectPageText(document.querySelector('main') || document.body);
      const parts = splitPageText(page.text);
      pageRef.current = page;
      startsRef.current = parts.map((part) => part.start);
      chunks = parts.map((part) => part.text);
      const heading = document.querySelector('main h1') || document.querySelector('h1');
      setPageTitle(heading?.innerText.trim() || document.title);
      setPlayerOpen(true);
    }
    if (chunks.length === 0) return;

    chunksRef.current = chunks;
    setTotalChars(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
    speakChunk(0);
  };

  function stopAudio() {
    runRef.current += 1;
    if (supportsSpeech()) window.speechSynthesis.cancel();
    clearReadingHighlight();
    setSpokenChars(0);
    setPlayerStatus('idle');
  }

  const closePlayer = () => {
    stopAudio();
    setPlayerOpen(false);
  };

  const speakPageContent = (customText) => {
    if (playerOpen && typeof customText !== 'string') {
      closePlayer();
      return;
    }
    startReading(customText);
  };

  const playAudio = () => {
    if (playerStatus === 'paused') speakChunk(indexRef.current);
    else if (playerStatus !== 'playing') startReading();
  };

  // pausar para a frase atual; ao continuar, ela recomeça do início
  const pauseAudio = () => {
    if (playerStatus !== 'playing') return;
    runRef.current += 1;
    window.speechSynthesis.cancel();
    setPlayerStatus('paused');
  };

  const speakText = (text) => {
    if (!supportsSpeech()) return;
    const synth = window.speechSynthesis;
    runRef.current += 1;
    synth.cancel();
    clearReadingHighlight();
    setPlayerStatus('idle');
    synth.resume();

    const live = liveRef.current;
    const utterance = new SpeechSynthesisUtterance(text);
    const { voice, pitch } = resolveVoice(live.voices, live.gender);
    if (voice) utterance.voice = voice;
    utterance.lang = 'pt-BR';
    utterance.pitch = pitch;
    utterance.rate = live.rate;
    utterance.volume = live.volume;

    synth.speak(utterance);
  };

  // tempo do player, estimado pela quantidade de texto
  useEffect(() => {
    if (playerStatus !== 'playing') return undefined;
    const timer = setInterval(() => {
      const index = indexRef.current;
      const chunk = chunksRef.current[index] || '';
      if (!chunkStartRef.current) return;
      const seconds = (Date.now() - chunkStartRef.current) / 1000;
      const said = Math.min(chunk.length, seconds * CHARS_PER_SECOND * liveRef.current.rate);
      setSpokenChars(charsBefore(index) + said);
    }, 250);
    return () => clearInterval(timer);
  }, [playerStatus]);

  // mudar voz, velocidade ou volume recomeça a frase atual com o novo valor
  const applyLive = (patch) => {
    liveRef.current = { ...liveRef.current, ...patch };
    if (playerStatus === 'playing') speakChunk(indexRef.current);
  };

  const setSpeed = (value) => {
    const rate = roundRate(Math.min(SPEECH_RATE_MAX, Math.max(SPEECH_RATE_MIN, Number(value))));
    setSpeechRate(rate);
    applyLive({ rate });
  };

  const setVolume = (value) => {
    setVolumeState(value);
    applyLive({ volume: value });
  };

  const changeVoiceGender = (gender) => {
    setVoiceGender(gender);
    applyLive({ gender });
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
        isPlayerOpen: playerOpen,
        playerStatus,
        pageTitle,
        volume,
        setVolume,
        elapsed: spokenChars / (CHARS_PER_SECOND * speechRate),
        duration: totalChars / (CHARS_PER_SECOND * speechRate),
        progress: totalChars ? spokenChars / totalChars : 0,
        speakPageContent,
        speakText,
        playAudio,
        pauseAudio,
        stopAudio,
        restartAudio: () => startReading(),
        closePlayer,
        stopSpeaking: closePlayer,
      }}
    >
      {children}
    </A11yContext.Provider>
  );
}
