const HIGHLIGHT = 'fonosync-leitura';
const MAX_CHUNK = 200;
const MAX_TEXT = 8000;

const canHighlight = () => typeof CSS !== 'undefined' && 'highlights' in CSS && typeof Highlight !== 'undefined';

function blockOf(element) {
  let current = element;
  while (current && getComputedStyle(current).display.startsWith('inline')) {
    current = current.parentElement;
  }
  return current;
}

// texto visível da página, guardando de qual nó veio cada trecho
export function collectPageText(root) {
  const parts = [];
  let text = '';
  let lastBlock = null;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!node.textContent.trim() || !parent) return NodeFilter.FILTER_REJECT;
      if (parent.closest('[aria-hidden="true"], [data-a11y-skip], script, style, [role="dialog"]')) return NodeFilter.FILTER_REJECT;
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

// divide em frases curtas e guarda onde cada uma começa no texto
export function splitPageText(text) {
  const chunks = [];
  const sentence = /[^.!?…\n]+[.!?…]*/g;
  for (let match = sentence.exec(text); match && match.index < MAX_TEXT; match = sentence.exec(text)) {
    let start = match.index;
    const end = match.index + match[0].length;
    while (start < end && /\s/.test(text[start])) start += 1;
    while (end - start > MAX_CHUNK) {
      const cut = text.lastIndexOf(' ', start + MAX_CHUNK);
      const stop = cut > start + 80 ? cut : start + MAX_CHUNK;
      chunks.push({ text: text.slice(start, stop), start });
      start = stop + 1;
    }
    const rest = text.slice(start, end).trim();
    if (rest) chunks.push({ text: rest, start });
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

export function clearReadingHighlight() {
  if (canHighlight()) CSS.highlights.delete(HIGHLIGHT);
}

// pinta a palavra que contém a posição, como um marca-texto
export function highlightWordAt(page, position) {
  if (!canHighlight() || !page?.parts.length) return;
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

  const box = range.getBoundingClientRect();
  if (box.top < 80 || box.bottom > window.innerHeight - 200) {
    const smooth = !document.documentElement.hasAttribute('data-motion');
    window.scrollBy({ top: box.top - window.innerHeight / 3, behavior: smooth ? 'smooth' : 'auto' });
  }
}
