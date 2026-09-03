---
name: quick-apps-hub
description: Use when adding a quick web artifact to the shared hub.
version: 1.0.0
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
6. Uruchom `npm run check`, `npm test`, `npm run build`. Sprawdź hub i nową trasę na desktopie i mobile, w tym główną interakcję.
7. Commituj tylko źródła (nigdy `dist/`), wypchnij `main`, wdroż Dokku app `quick-apps-hub` i zweryfikuj HTTPS, `/health` oraz dokładny URL aplikacji.
8. Odpowiedź końcowa zawsze zawiera kopiowalny URL `https://apps.dev.jakbyco.com/apps/<slug>/`.

## Jakość

Artefakt ma być gotowy do pokazania, nie placeholderem. Zachowaj fokus klawiatury, kontrast, 44 px touch targets, reduced motion i responsywność. Dane demo oznaczaj uczciwie. Hash nie jest kontrolą dostępu.
