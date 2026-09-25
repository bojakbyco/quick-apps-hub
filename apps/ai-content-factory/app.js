// AI Content Factory — drobna interakcja: podświetlanie aktywnej sekcji w TOC.
(function () {
  const links = document.querySelectorAll('.toc a');
  if (!links.length) return;
  const sections = [];
  links.forEach(function (l) {
    const id = l.getAttribute('href').replace('#', '');
    const el = document.getElementById(id);
    if (el) sections.push({ id: id, el: el, link: l });
  });
  if (!sections.length) return;

  const obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      sections.forEach(function (s) {
        s.link.style.borderColor = s.id === e.target.id ? '#a78bfa' : '';
        s.link.style.color = s.id === e.target.id ? '#a78bfa' : '';
      });
    });
  }, { rootMargin: '-20% 0px -60% 0px' });
  sections.forEach(function (s) { obs.observe(s.el); });
})();