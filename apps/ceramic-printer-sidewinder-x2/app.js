(() => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dots = document.getElementById('dots');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  let i = 0;

  slides.forEach((_, n) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', `Slajd ${n + 1}`);
    b.addEventListener('click', () => go(n));
    dots.appendChild(b);
  });
  const dotBtns = Array.from(dots.children);

  function go(n) {
    i = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach((s, k) => {
      s.classList.toggle('active', k === i);
      if (k === i) s.scrollTop = 0;
    });
    dotBtns.forEach((d, k) => d.setAttribute('aria-current', k === i ? 'true' : 'false'));
    prev.disabled = i === 0;
    next.disabled = i === slides.length - 1;
    location.hash = i + 1;
  }

  prev.addEventListener('click', () => go(i - 1));
  next.addEventListener('click', () => go(i + 1));

  document.addEventListener('keydown', (e) => {
    if (e.target instanceof Element && e.target.closest('a,button,input,textarea')) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); go(i + 1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(i - 1); }
    if (e.key === 'Home') go(0);
    if (e.key === 'End') go(slides.length - 1);
  });

  // Touch swipe
  let x0 = null, y0 = null;
  document.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    const dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) go(i + (dx < 0 ? 1 : -1));
    x0 = y0 = null;
  }, { passive: true });

  const start = parseInt(location.hash.slice(1), 10);
  go(Number.isInteger(start) && start >= 1 && start <= slides.length ? start - 1 : 0);
})();
