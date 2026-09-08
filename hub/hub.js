const list = document.querySelector('#apps');
const template = document.querySelector('#card-template');
let apps = [];
function render(filter = 'all') {
  list.replaceChildren();
  const visible = apps.filter(app => filter === 'all' || app.category === filter);
  visible.sort((a, b) => String(b.updated || '').localeCompare(String(a.updated || '')) || String(b.created || '').localeCompare(String(a.created || '')));
  visible.forEach((app, index) => {
    const card = template.content.firstElementChild.cloneNode(true);
    card.style.setProperty('--accent', app.accent);
    card.querySelector('.number').textContent = String(index + 1).padStart(2, '0');
    card.querySelector('.category').textContent = app.category;
    const updatedEl = card.querySelector('.updated');
    if (updatedEl) updatedEl.textContent = app.updated ? `Aktualizacja: ${app.updated}` : '';
    const createdEl = card.querySelector('.created');
    if (createdEl) createdEl.textContent = app.created ? `Dodano: ${app.created}` : '';
    card.querySelector('h3').textContent = app.name;
    card.querySelector('p').textContent = app.description;
    card.querySelector('a').href = `/apps/${app.slug}/`;
    list.append(card);
  });
  if (!visible.length) list.innerHTML = '<p class="empty">Brak aplikacji w tej kategorii.</p>';
}
fetch('/registry/apps.json').then(response => { if (!response.ok) throw new Error('Nie udało się pobrać rejestru'); return response.json(); }).then(data => { apps = data.apps; document.querySelector('#app-count').textContent = apps.length; render(); }).catch(error => { list.innerHTML = `<p class="empty">${error.message}</p>`; });
document.querySelector('.filter').addEventListener('click', event => { if (!event.target.matches('button')) return; document.querySelectorAll('.filter button').forEach(button => button.classList.toggle('active', button === event.target)); render(event.target.dataset.filter); });
