---
name: quick-apps-hub
description: Use when adding a quick web artifact to the shared hub.
version: 1.1.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [frontend, presentations, landing-pages, dashboards, dokku]
    related_skills: [web-product-delivery, dokku-containerized-deployments]
---

# Quick Apps Hub

Repozytorium: `/root/quick-apps-hub`. Produkcja: `https://apps.dev.jakbyco.com`.

## Zasady

1. Twórz artefakt pod stabilnym `/apps/<slug>/`; użyj semantycznej nazwy lub `--hash` na jawne życzenie.
2. Uruchom `npm run scaffold -- --name "Nazwa" --template <presentation|landing|dashboard|blank>`.
3. Trzymaj wszystkie pliki aplikacji w `apps/<slug>/` i używaj lokalnych ścieżek względnych. Nie importuj CSS huba.
4. `registry/apps.json` jest jedynym źródłem katalogu. Dodaj dokładnie jeden kompletny wpis.
5. Inny framework stosuj tylko na jawne życzenie. Izoluj źródła i zależności pod katalogiem aplikacji oraz dostarcz statyczny wynik; runtime serwerowy wymaga osobnego deploymentu.
6. Uruchom `npm run check`, `npm test`, `npm run build`. Sprawdź hub i nową trasę na desktopie oraz w realnej przeglądarce na viewportach `360×780` (Galaxy S24 baseline), `390×844` i minimum `360×640`, w tym główną interakcję.
7. Commituj tylko źródła (nigdy `dist/`), wypchnij `main`, wdroż Dokku app `quick-apps-hub` i zweryfikuj HTTPS, `/health` oraz dokładny URL aplikacji.
8. Odpowiedź końcowa zawsze zawiera kopiowalny URL `https://apps.dev.jakbyco.com/apps/<slug>/`.

## Jakość

Artefakt ma być gotowy do pokazania, nie placeholderem. Mobile jest wymaganiem bazowym, nie późniejszą poprawką:

- projektuj mobile-first od szerokości 360 px i wysokości 640 px;
- na Galaxy S24 (`360×780` CSS px) żadna ważna treść ani kontrolka nie może być przykryta przez stały header/footer;
- dokument nie może mieć przypadkowego poziomego overflow; karuzele poziome są dozwolone tylko jako jawny, dotykowy wzorzec z `scroll-snap`;
- prezentacje muszą mieścić kluczową myśl slajdu w jednym ekranie S24; jeśli treść wymaga przewijania, ma być ono wewnętrzne, oczywiste i kończyć się nad nawigacją;
- dashboardy na mobile używają kompaktowych kart/karuzel zamiast ściskania desktopowej siatki;
- nagłówki mają płynną skalę (`clamp()`), media zachowują proporcje, a komponenty nie używają sztywnej szerokości większej niż viewport;
- wszystkie cele dotykowe mają minimum 44×44 px, focus jest widoczny, a animacje respektują `prefers-reduced-motion`.

QA jest zaliczone dopiero po automatycznym sprawdzeniu `scrollWidth <= innerWidth` oraz wizualnym screenshot review co najmniej na `360×780` i szerokim desktopie. Dane demo oznaczaj uczciwie. Hash nie jest kontrolą dostępu.
