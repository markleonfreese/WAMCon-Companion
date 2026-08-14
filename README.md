# WAMCon 2026 Companion PWA

Unofficial personal companion for WAMCon 2026.

## Features
- Live Perth/AWST clock
- Highlights sessions running now and the next session
- Friday/Saturday schedule
- Recommended-session filter
- Add sessions to "My plan"
- Check in to sessions
- Per-session notes, saved locally on-device
- Export notes to a text file
- Offline caching after first load
- Installable as a PWA when served over HTTPS

## Quickest way to use it on Android
1. Upload the contents of this folder to any HTTPS static host, such as GitHub Pages, Netlify, Cloudflare Pages or Firebase Hosting.
2. Open the deployed URL in Chrome.
3. Use "Install app" when offered, or Chrome menu > Add to Home screen.

## Local testing
From this folder:
    python3 -m http.server 8080
Then open http://localhost:8080

## Data
All check-ins, plans and notes are stored in browser localStorage under `wamcon-companion-v1`.
The Export Notes button creates a plain-text backup.

## Sources
Schedule was transcribed from the official WAMCon 2026 program PDF and event page on 14 August 2026.
This is not an official WAM/WAMCon app.
