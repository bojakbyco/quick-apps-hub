# Quick Apps Hub

Wspólny, statyczny agregator szybkich prezentacji, landing pages, dashboardów i małych aplikacji frontendowych.

- Produkcja: https://apps.dev.jakbyco.com
- GitHub: https://github.com/bojakbyco/quick-apps-hub
- Trasy aplikacji: `/apps/<slug>/`

## Architektura

`registry/apps.json` jest jedynym źródłem katalogu. Każda aplikacja jest osobnym dokumentem w `apps/<slug>/`, z własnymi stylami i skryptami. Root build kopiuje aplikacje do `dist/apps/<slug>/`; `dist/` nie jest commitowany. Dzięki temu style i zależności nie nakładają się.

## Komendy

```bash
npm run check
npm test
npm run build
npm run scaffold -- --name "Nazwa" --template presentation
npm run scaffold -- --name "Nazwa" --template landing
npm run scaffold -- --name "Nazwa" --template dashboard
npm run scaffold -- --name "Tajny szkic" --template blank --hash
```

Dostępne template’y: `presentation`, `landing`, `dashboard`, `blank`. `--hash` tworzy losowy, krótki slug; nie jest to zabezpieczenie dostępu.

## Dodawanie realizacji

1. Uruchom scaffold albo utwórz `apps/<slug>/`.
2. Cały HTML/CSS/JS i assety trzymaj w tym katalogu, używając ścieżek względnych.
3. Uzupełnij jeden wpis w `registry/apps.json`.
4. Uruchom check, test i build.
5. Sprawdź `/` i `/apps/<slug>/` na desktopie oraz mobile.
6. Commit, push do `main`, deploy Dokku `quick-apps-hub`.

Jeśli użytkownik jawnie chce inny framework, można go trzymać w `apps/<slug>/source/`, ale wynik musi być statyczny i trafić do katalogu aplikacji przed root buildem. Aplikacje wymagające procesu serwerowego dostają osobne repo i deployment.

## Przykłady

- `/apps/signal-deck/` — prezentacja sterowana klawiaturą i gestem.
- `/apps/northstar-landing/` — landing produktowy.
- `/apps/pulse-dashboard/` — dashboard z filtrem zakresu i eksportem CSV.

## Deployment

Obraz buduje statyczny bundle w Node 22, a następnie serwuje go przez nginx. Endpoint `/health` zwraca `ok`.
