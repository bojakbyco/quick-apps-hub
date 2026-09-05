const slides = [...document.querySelectorAll('.slide')]; let current = 0;
function show(index) { current = (index + slides.length) % slides.length; slides.forEach((slide, i) => slide.classList.toggle('active', i === current)); document.querySelector('#counter').textContent = `${String(current + 1).padStart(2,'0')} — ${String(slides.length).padStart(2,'0')}`; }
document.querySelector('#prev').addEventListener('click', () => show(current - 1));
document.querySelector('#next').addEventListener('click', () => show(current + 1));
document.addEventListener('keydown', event => { if (['ArrowRight',' ','PageDown'].includes(event.key)) { event.preventDefault(); show(current + 1); } if (['ArrowLeft','PageUp'].includes(event.key)) show(current - 1); if (event.key === 'Home') show(0); if (event.key === 'End') show(slides.length - 1); });
let touchStart = 0; document.addEventListener('touchstart', e => touchStart = e.changedTouches[0].screenX); document.addEventListener('touchend', e => { const delta = e.changedTouches[0].screenX - touchStart; if (Math.abs(delta) > 50) show(current + (delta < 0 ? 1 : -1)); });
