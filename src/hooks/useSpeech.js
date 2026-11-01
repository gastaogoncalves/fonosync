import { useEffect, useRef, useState } from 'react';

// média de caracteres falados por segundo na velocidade 1x
const CHARS_PER_SECOND = 14;
const MAX_CHUNK = 220;
const HIGHLIGHT = 'fonosync-leitura';

const canHighlight = typeof CSS !== 'undefined' && 'highlights' in CSS && typeof Highlight !== 'undefined';

function blockOf(element) {
  let current = element;
  while (current && getComputedStyle(current).display.startsWith('inline')) {
    current = current.parentElement;
  }
  return current;
}

// junta o texto visível da área principal e guarda de qual nó veio cada trecho,
// para depois achar na página a palavra que está sendo falada
function collectText() {
  const root = document.querySelector('main') ?? document.getElementById('root');
  const parts = [];
  let text = '';
  let lastBlock = null;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!node.textContent.trim() || !parent) return NodeFilter.FILTER_REJECT;
      if (parent.closest('[data-no-read], [aria-hidden="true"], script, style')) return NodeFilter.FILTER_REJECT;
      if (parent.checkVisibility && !parent.checkVisibility()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const block = blockOf(node.parentElement);
    if (text && block !== lastBlock) text += '\n';
    parts.push({ node, start: text.length });
    text += node.textContent;
    lastBlock = block;
  }

  return { text, parts };
}

// o navegador corta falas muito longas, então o texto vai em pedaços
function splitText(text) {
  const chunks = [];
  const sentence = /[^.!?\n]+[.!?]*/g;
  for (let match = sentence.exec(text); match; match = sentence.exec(text)) {
    let start = match.index;
    let end = match.index + match[0].length;
    while (start < end && /\s/.test(text[start])) start += 1;
    while (end - start > MAX_CHUNK) {
      const cut = text.lastIndexOf(' ', start + MAX_CHUNK);
      const stop = cut > start ? cut : start + MAX_CHUNK;
      chunks.push({ start, end: stop });
      start = stop + 1;
    }
    if (text.slice(start, end).trim()) chunks.push({ start, end });
  }
  return chunks;
}

function findPart(parts, position) {
  let low = 0;
  let high = parts.length - 1;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (parts[middle].start <= position) low = middle;
    else high = middle - 1;
  }
  return parts[low];
}

function clearHighlight() {
  if (canHighlight) CSS.highlights.delete(HIGHLIGHT);
}

// marca a palavra que contém a posição, como um marca-texto
function highlightAt(page, position, scroll) {
  if (!canHighlight || !page.parts.length) return;
  const part = findPart(page.parts, position);
  const content = part.node.textContent;
  let start = Math.max(0, Math.min(position - part.start, content.length - 1));
  while (start > 0 && /[\p{L}\p{N}]/u.test(content[start - 1])) start -= 1;
  while (start < content.length && !/[\p{L}\p{N}]/u.test(content[start])) start += 1;
  let end = start;
  while (end < content.length && /[\p{L}\p{N}'-]/u.test(content[end])) end += 1;
  if (end <= start) return;

  const range = new Range();
  range.setStart(part.node, start);
  range.setEnd(part.node, end);
  CSS.highlights.set(HIGHLIGHT, new Highlight(range));

  if (scroll) {
    const box = range.getBoundingClientRect();
    if (box.top < 80 || box.bottom > window.innerHeight - 280) {
      const smooth = !document.documentElement.hasAttribute('data-motion');
      window.scrollBy({ top: box.top - window.innerHeight / 3, behavior: smooth ? 'smooth' : 'auto' });
    }
  }
}

function pickVoice() {
  return window.speechSynthesis.getVoices().find((voice) => voice.lang?.toLowerCase().startsWith('pt'));
}

export function useSpeech() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [status, setStatus] = useState('idle');
  const [rate, setRateState] = useState(1);
  const [volume, setVolumeState] = useState(1);
  const [spokenChars, setSpokenChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);

  const page = useRef({ text: '', parts: [] });
  const chunks = useRef([]);
  const index = useRef(0);
  const current = useRef(null);
  const settings = useRef({ rate: 1, volume: 1 });
  const chunkStart = useRef(0);
  const pausedAt = useRef(0);
  const usesBoundary = useRef(false);
  const lastWord = useRef(-1);

  function mark(position) {
    if (position === lastWord.current) return;
    lastWord.current = position;
    highlightAt(page.current, position, true);
  }

  function speakFrom(position) {
    current.current = null;
    window.speechSynthesis.cancel();

    const chunk = chunks.current[position];
    if (!chunk) {
      setStatus('idle');
      setSpokenChars(0);
      clearHighlight();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(page.current.text.slice(chunk.start, chunk.end));
    utterance.lang = 'pt-BR';
    utterance.voice = pickVoice() ?? null;
    utterance.rate = settings.current.rate;
    utterance.volume = settings.current.volume;
    utterance.onstart = () => {
      chunkStart.current = Date.now();
    };
    // algumas vozes avisam cada palavra falada; outras não, e aí o destaque vai por estimativa
    utterance.onboundary = (event) => {
      if (current.current !== utterance || event.name !== 'word') return;
      usesBoundary.current = true;
      mark(chunk.start + event.charIndex);
    };
    utterance.onend = () => {
      if (current.current === utterance) speakFrom(position + 1);
    };

    index.current = position;
    current.current = utterance;
    chunkStart.current = Date.now();
    setSpokenChars(chunk.start);
    mark(chunk.start);
    window.speechSynthesis.speak(utterance);
  }

  function start() {
    page.current = collectText();
    chunks.current = splitText(page.current.text);
    usesBoundary.current = false;
    lastWord.current = -1;
    setTotalChars(page.current.text.length);
    setStatus('playing');
    speakFrom(0);
  }

  function play() {
    if (!supported) return;
    if (status === 'paused') {
      chunkStart.current = Date.now() - pausedAt.current;
      window.speechSynthesis.resume();
      setStatus('playing');
    } else if (status === 'idle') {
      start();
    }
  }

  function pause() {
    if (status !== 'playing') return;
    pausedAt.current = Date.now() - chunkStart.current;
    window.speechSynthesis.pause();
    setStatus('paused');
  }

  function stop() {
    if (!supported) return;
    current.current = null;
    window.speechSynthesis.cancel();
    clearHighlight();
    setStatus('idle');
    setSpokenChars(0);
  }

  function restart() {
    if (!supported) return;
    start();
  }

  // mudar velocidade ou volume recomeça a frase atual com o novo valor
  function setRate(value) {
    settings.current.rate = value;
    setRateState(value);
    if (status !== 'idle') {
      setStatus('playing');
      speakFrom(index.current);
    }
  }

  function setVolume(value) {
    settings.current.volume = value;
    setVolumeState(value);
    if (status === 'playing') speakFrom(index.current);
  }

  // avança o tempo enquanto fala (e o destaque, quando a voz não avisa as palavras)
  useEffect(() => {
    if (status !== 'playing') return undefined;
    const timer = setInterval(() => {
      const chunk = chunks.current[index.current];
      if (!chunk) return;
      const seconds = (Date.now() - chunkStart.current) / 1000;
      const said = Math.min(chunk.end - chunk.start, seconds * CHARS_PER_SECOND * settings.current.rate);
      setSpokenChars(chunk.start + said);
      if (!usesBoundary.current) mark(chunk.start + Math.floor(said));
    }, 250);
    return () => clearInterval(timer);
  }, [status]);

  // para de falar ao sair da página
  useEffect(() => {
    return () => {
      if (supported) {
        current.current = null;
        window.speechSynthesis.cancel();
        clearHighlight();
      }
    };
  }, [supported]);

  const speed = CHARS_PER_SECOND * rate;

  return {
    supported,
    status,
    play,
    pause,
    stop,
    restart,
    rate,
    setRate,
    volume,
    setVolume,
    progress: totalChars ? spokenChars / totalChars : 0,
    elapsed: spokenChars / speed,
    duration: totalChars / speed,
  };
}
