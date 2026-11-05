export function scrollToId(id) {
  const target = document.getElementById(id);
  if (!target) return;

  const reduceMotion =
    document.documentElement.getAttribute('data-motion') === 'reduce' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}