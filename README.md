# WAMCon 2026 Companion PWA

An unofficial, independent mobile companion built as a rapid proof of concept for navigating WAMCon 2026.

## What it demonstrates

- Live Perth/AWST clock and event-state awareness
- Session schedule and now/next navigation
- Personal planning and check-in state
- Per-session notes stored locally on-device
- Export/import of notes
- Offline caching after first load
- Installable PWA behaviour when served over HTTPS

## Run locally

No build step is required.

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Data and privacy

User-created plans, check-ins and notes are stored only in browser `localStorage` under `wamcon-companion-v1`. There is no account system or server-side user database in this version.

The public-readiness cleanup removes the original private/personal artist-recommendation dataset and its fit scores. Those recommendations were useful for the original personal prototype but are not needed to demonstrate the product concept.

## Event information and attribution

This is not an official WAM or WAMCon product. Event information was compiled from public WAMCon/WAM Music Week sources for navigation convenience. The official sources remain authoritative.

The repository still contains event-specific schedule/program data. That data is distinct from the application code and should not automatically be assumed to be covered by any future software licence.

## Publication decision

Current recommendation:

- **Publicly document:** yes
- **Public demo:** yes, after a final browser test and review of event-specific data/attribution
- **Open source:** not yet

Before open-sourcing, either separate the reusable application shell from the WAMCon event dataset or replace the event dataset with synthetic sample data. Do not add an open-source licence until that split is deliberate.

## Status

Historical event POC; useful as a compact example of rapid problem identification, mobile-first prototyping, local-first state and PWA delivery.
