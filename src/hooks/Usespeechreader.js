import { useCallback, useEffect, useRef, useState } from 'react';
import { VOICE_OPTIONS } from '../utils/constants';

/*
  Leitor de voz da página (Web Speech API).
  Entrega exatamente os nomes que AccessibilityPanel e AudioPlayerBar já consomem via useA11y():
  speechSupported, isPlaying, playerStatus, isPlayerOpen, currentTime, duration, pageTitle,
  speed/speechRate, volume, voiceGender, speakPageContent, stopSpeaking, playAudio, pauseAudio,
  stopAudio, restartAudio, setSpeed, setSpeechRate, setVolume, setVoiceGender.
*/

const supported =
  typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

const CHARS_PER_SECOND = 14; // fala média em pt-BR com velocidade 1× (só para estimar o tempo)
const MAX_CHUNK = 180; // trechos curtos evitam o corte de ~15 s do Chrome e permitem trocar voz/velocidade

const SKIP = '[data-a11y-skip], [aria-hidden="true"], [hidden], [inert], script, style, noscript, svg';
const PAUSE_TAGS = /^(H[1-6]|LI|TH|TD|LABEL|BUTTON|FIGCAPTION)$/;
const FEMALE = /maria|francisca|luciana|vit[oó]ria|fernanda|helena|camila|thalita|raquel|joana|female|feminin|google portugu/i;
const MALE = /daniel|felipe|ant[oô]nio|donato|ricardo|jorge|\bmale\b|masculin/i;

const classify = (voice) => (FEMALE.test(voice.name) ? 'f' : MALE.test(voice.name) ? 'm' : null);

function cleanText(text) {
  return text
    .replace(/[\p{Extended_Pictographic}\u200d\ufe0f]/gu, '') // emojis não são lidos
    .replace(/[→←↑↓↗↘]/g, '')
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .trim();
}

// Lê só o conteúdo visível da página, ignorando painel/barra de acessibilidade e itens ocultos.
function collectText() {
  const root = document.querySelector('main') ?? document.body;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const parts = [];

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    let text = node.nodeValue.replace(/\s+/g, ' ').trim();
    const parent = node.parentElement;
    if (!text || !parent || parent.closest(SKIP) || parent.getClientRects().length === 0) continue;
    if (PAUSE_TAGS.test(parent.tagName) && !/[.!?:;,]$/.test(text)) text += '.';
    parts.push(text);
  }
  return cleanText(parts.join(' '));
}

function splitChunks(text) {
  const sentences = text.match(/[^.!?…]+[.!?…]*\s*/g) ?? [text];
  const pieces = [];
  let current = '';

  for (const sentence of sentences) {
    if (current && (current + sentence).length > MAX_CHUNK) {
      pieces.push(current.trim());
      current = '';
    }
    current += sentence;
    while (current.length > MAX_CHUNK * 1.5) {
      let cut = current.lastIndexOf(', ', MAX_CHUNK);
      if (cut < 40) cut = current.lastIndexOf(' ', MAX_CHUNK);
      if (cut < 1) cut = MAX_CHUNK;
      pieces.push(current.slice(0, cut + 1).trim());
      current = current.slice(cut + 1);
    }
  }
  if (current.trim()) pieces.push(current.trim());

  let position = 0;
  const chunks = pieces.map((piece) => {
    const chunk = { text: piece, start: position };
    position += piece.length + 1;
    return chunk;
  });
  return { chunks, total: position };
}

export function useSpeechReader() {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [playerStatus, setPlayerStatus] = useState('idle'); // idle | playing | paused | done
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [pageTitle, setPageTitle] = useState('');
  const [speechRate, setSpeechRateState] = useState(1);
  const [volume, setVolume] = useState(100);
  const [voiceGender, setVoiceGender] = useState(VOICE_OPTIONS[0]?.value ?? 'feminina');

  const runRef = useRef(0); // invalida callbacks de falas antigas
  const statusRef = useRef('idle');
  const chunksRef = useRef([]);
  const totalRef = useRef(0);
  const indexRef = useRef(0);
  const progressRef = useRef(0);
  const voicesRef = useRef([]);
  const settingsRef = useRef({ rate: 1, volume: 100, male: false });

  const setStatus = useCallback((status) => {
    statusRef.current = status;
    setPlayerStatus(status);
  }, []);

  const syncTime = useCallback(() => {
    const perSecond = CHARS_PER_SECOND * settingsRef.current.rate;
    setDuration(totalRef.current / perSecond);
    setCurrentTime(Math.min(progressRef.current, totalRef.current) / perSecond);
  }, []);

  const pickVoice = useCallback((male) => {
    const portuguese = voicesRef.current.filter((voice) => /^pt/i.test(voice.lang));
    const brazilian = portuguese.filter((voice) => /^pt[-_]BR/i.test(voice.lang));
    const pool = brazilian.length ? brazilian : portuguese;
    const wanted = male ? 'm' : 'f';
    return pool.find((voice) => classify(voice) === wanted) ?? pool[0] ?? null;
  }, []);

  const speakChunk = useCallback(
    (index, run) => {
      if (!supported || run !== runRef.current) return;
      const chunks = chunksRef.current;

      if (index >= chunks.length) {
        progressRef.current = totalRef.current;
        syncTime();
        setStatus('done');
        return;
      }

      indexRef.current = index;
      progressRef.current = chunks[index].start;
      syncTime();

      const { rate, volume: level, male } = settingsRef.current;
      const voice = pickVoice(male);
      const utterance = new SpeechSynthesisUtterance(chunks[index].text);
      utterance.lang = voice?.lang || 'pt-BR';
      if (voice) utterance.voice = voice;
      utterance.rate = rate;
      utterance.volume = level / 100;
      // Sem voz masculina instalada, deixa a voz disponível mais grave para marcar a diferença
      utterance.pitch = male && (!voice || classify(voice) !== 'm') ? 0.8 : 1;

      utterance.onboundary = (event) => {
        if (run !== runRef.current) return;
        progressRef.current = chunks[index].start + event.charIndex;
        syncTime();
      };
      utterance.onend = () => {
        if (run === runRef.current) speakChunk(index + 1, run);
      };
      utterance.onerror = (event) => {
        if (run !== runRef.current || event.error === 'canceled' || event.error === 'interrupted') return;
        setStatus('idle');
      };

      window.speechSynthesis.speak(utterance);
    },
    [pickVoice, setStatus, syncTime],
  );

  const startFrom = useCallback(
    (index) => {
      if (!supported) return;
      runRef.current += 1;
      const run = runRef.current;
      window.speechSynthesis.cancel();
      setStatus('playing');
      setTimeout(() => speakChunk(index, run), 50); // evita perder a fala logo após cancel()
    },
    [setStatus, speakChunk],
  );

  const speakPageContent = useCallback(() => {
    if (!supported) return;
    const text = collectText();
    if (!text) return;

    const { chunks, total } = splitChunks(text);
    chunksRef.current = chunks;
    totalRef.current = total;
    setPageTitle(document.title || 'Página');
    setIsPlayerOpen(true);
    startFrom(0);
  }, [startFrom]);

  const pauseAudio = useCallback(() => {
    if (!supported || statusRef.current !== 'playing') return;
    runRef.current += 1;
    window.speechSynthesis.cancel(); // pausa = parar e guardar o trecho (funciona em todos os navegadores)
    setStatus('paused');
  }, [setStatus]);

  const playAudio = useCallback(() => {
    const status = statusRef.current;
    if (status === 'playing') return;
    if (status === 'paused') startFrom(indexRef.current);
    else speakPageContent();
  }, [speakPageContent, startFrom]);

  const stopAudio = useCallback(() => {
    if (!supported) return;
    runRef.current += 1;
    window.speechSynthesis.cancel();
    indexRef.current = 0;
    progressRef.current = 0;
    syncTime();
    setStatus('idle');
  }, [setStatus, syncTime]);

  const stopSpeaking = useCallback(() => {
    stopAudio();
    setIsPlayerOpen(false);
  }, [stopAudio]);

  const restartAudio = useCallback(() => {
    if (chunksRef.current.length === 0) speakPageContent();
    else startFrom(0);
  }, [speakPageContent, startFrom]);

  const setSpeechRate = useCallback((value) => {
    setSpeechRateState(Math.min(2.5, Math.max(0.5, Number(value) || 1)));
  }, []);

  // Vozes carregam de forma assíncrona em alguns navegadores; pára a fala ao trocar de tela
  useEffect(() => {
    if (!supported) return undefined;
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      voicesRef.current = synth.getVoices();
    };
    const halt = () => {
      runRef.current += 1;
      synth.cancel();
    };

    loadVoices();
    synth.addEventListener?.('voiceschanged', loadVoices);
    window.addEventListener('hashchange', stopSpeaking);
    window.addEventListener('pagehide', halt);
    return () => {
      synth.removeEventListener?.('voiceschanged', loadVoices);
      window.removeEventListener('hashchange', stopSpeaking);
      window.removeEventListener('pagehide', halt);
      halt();
    };
  }, [stopSpeaking]);

  // Mudou voz, velocidade ou volume: aplica no trecho atual (com pequeno atraso para o slider)
  useEffect(() => {
    settingsRef.current = { rate: speechRate, volume, male: /^m/i.test(String(voiceGender)) };
    if (statusRef.current !== 'playing') {
      syncTime();
      return undefined;
    }
    const timer = setTimeout(() => startFrom(indexRef.current), 250);
    return () => clearTimeout(timer);
  }, [speechRate, volume, voiceGender, startFrom, syncTime]);

  return {
    speechSupported: supported,
    isPlayerOpen,
    playerStatus,
    isPlaying: playerStatus === 'playing',
    currentTime,
    duration,
    pageTitle,
    speed: speechRate,
    speechRate,
    volume,
    voiceGender,
    setSpeed: setSpeechRate,
    setSpeechRate,
    setVolume,
    setVoiceGender,
    speakPageContent,
    stopSpeaking,
    playAudio,
    pauseAudio,
    stopAudio,
    restartAudio,
  };
}