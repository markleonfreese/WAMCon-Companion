# WAMCon 2026 Companion PWA

An unofficial personal companion I built for WAMCon / WA Music Week 2026 so the programme was easier to use while moving around the event.

Live demo: https://wamcon-companion.markleonfreese.workers.dev/

This was a personal attendee experiment, not an official WAM product and not commissioned by or affiliated with WAM.

## What it does

- Live Perth/AWST clock and `Now / Next` view
- Friday/Saturday programme
- WAM Showcase timetable
- Search/filter-style programme views
- Personal `My plan` favourites
- Session check-ins
- Per-session notes saved locally on the attendee's device
- Export/import of personal notes
- Offline caching after first load
- Installable PWA when served over HTTPS
- Experimental personalised artist/profile recommendations

## Why I built it

Conference programmes are often published as websites, PDFs and timetable images that are useful before the event but awkward to navigate quickly on a phone during it.

The prototype tests a simple idea: take the event information that already exists, turn it into structured data, and render an opinionated mobile companion focused on what an attendee needs in the moment.

That pattern is now being explored further in another project I am working on, rather than remaining a one-off WAMCon build.

## Using the same pattern for other events

This repository can be adapted for other conferences, festivals, showcases, conventions, training days and other multi-session events.

The WAMCon-specific pieces are mostly the event data, dates/timezone, labels, links and Showcase presentation. The reusable pieces are the attendee experience: Now/Next, multi-day schedule, filters, My Plan, notes/check-ins, profiles, offline caching and installability.

A developer or capable LLM can use this repository as a reference implementation, replace the source-backed event data and adjust the event-specific configuration while keeping the core interaction model intact.

In another project I am working on, I am exploring how to automate that process for non-developers:

`website/PDF/docs -> analyse event -> suggest app requirements -> user adjusts -> preview -> generate PWA -> share`

The user does not need to be the event organiser. An attendee can build the companion they wish the event had and share it with others, as happened here with WAMCon.

See `REUSE-AND-DEPLOYMENT.md` for the reusable event pattern and Cloudflare deployment approach.

## Privacy

There is no attendee account or backend database in this prototype.

Check-ins, favourites and notes are stored in browser `localStorage` under `wamcon-companion-v1`. The Export Notes button creates a local plain-text backup.

Personal attendee notes are never committed to this repository.

## Personalisation experiment

The Showcase `fit` scores and recommendation notes in `artists.json` were created collaboratively with ChatGPT as an experimental personal preference-matching layer for my own use.

They are **not artist ratings**, WAM recommendations or objective assessments. They answer a different question:

> Based on what is known about this attendee's tastes and interests, how relevant might this artist or session be to them?

The same approach can be used for conference sessions, workshops, speakers, performances or any event with more choices than one attendee can realistically experience.

The event data and the personalisation layer should remain separate:

- schedule, artist/session names, times and venues = source-backed event facts;
- `fit`, relevance and recommendation notes = user-specific interpretation;
- changing the user profile should change recommendations, not event facts.

### Personalise this repo with an LLM

Someone can take this repository to ChatGPT, Claude, Gemini or another capable LLM and ask it to regenerate the preference layer for them.

A simple workflow is:

1. Give the LLM this repository or the structured `schedule.json`, `showcase.json` and `artists.json` files.
2. Give it relevant information about your interests and what you want from the event.
3. Ask it to rank or annotate artists/sessions for personal relevance while preserving all source event data unchanged.
4. Review the recommendations.
5. Replace only the personalisation fields such as `fit`, `why`, recommended flags or future session-relevance fields.

Example instruction:

```text
Use the event data in this repository as factual source material. Do not change dates, times, venues, names or programme facts.

Using what you know about my interests, goals and preferences, create a personal relevance layer for the artists and sessions. Explain briefly why each recommendation may or may not suit me. Treat scores as preference matching, not quality ratings.

Keep factual event data and personal interpretation clearly separate.
```

### Attribution and provenance for the personalisation pattern

This experiment is also intended to show where the personalisation idea came from. If you adapt and publicly share this WAMCon Companion or its personal-relevance approach, please retain a small acknowledgement that the pattern originated in Mark Freese's WAMCon Companion experiment.

I am also developing this idea further in another project I am working on, including a reusable companion-builder and optional personalisation layer.

Where a future tool generates, stores, imports or renders personal relevance, the attendee experience should make it clear that the scores are personalised recommendations rather than event ratings, and should identify how the recommendations were generated where practical.

A useful provenance model is:

- **Event facts:** sourced from the event material.
- **Personalisation pattern/schema:** based on the WAMCon Companion experiment.
- **Recommendation generation:** the user's selected LLM or future companion-builder tooling.
- **Preference context:** supplied or explicitly authorised by the attendee.

This prevents an unexplained `4.8/5` beside an artist or session from looking like an official event rating.

### Future connected personalisation

A future companion generator could make this much more useful by letting the attendee explicitly choose personal context sources to inform recommendations.

Possible authorised inputs include:

- a short preference questionnaire;
- previous event favourites/check-ins/notes;
- selected Google Drive documents;
- selected Gmail context where relevant;
- music listening history or saved artists from services such as Spotify or YouTube Music;
- playlists supplied by the user;
- the attendee's stated professional goals, topics of interest or people they want to meet;
- other user-controlled knowledge sources.

The important boundary is consent and separation. Personal sources should only be used when the attendee deliberately connects or supplies them, and they should influence recommendations rather than overwrite the underlying event record.

A production implementation should also show users what context influenced a recommendation and allow personalisation to be disabled or regenerated.

## Data sources

The schedule was transcribed and structured from publicly available WAMCon / WA Music Week programme material, including the official programme PDF, event pages and Showcase timetable.

Programme descriptions in this prototype are concise attendee-oriented summaries/paraphrases for navigation. Event names, programme information and third-party marks remain the property of their respective owners.

## Licence and third-party content

My original software code and original repository documentation are released under the **MIT License**. See `LICENSE`.

That licence does not grant rights to WAM/WAMCon/WA Music Week branding, programme material, artist or speaker material, logos, images, maps or other third-party content. Those rights remain with their respective owners. See `THIRD-PARTY-NOTICE.md` for the detailed boundary.

If you adapt this repository for another event, replace or remove event-specific third-party material unless you have permission or another lawful basis to use it.

## Local testing

From this folder:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deployment

The live PWA is published through **Cloudflare Workers Static Assets**.

This repository's `wrangler.jsonc` names the Worker `wamcon-companion` and serves the repository root as its static asset directory. With Cloudflare/Wrangler authentication configured, the current deployment pattern is:

```bash
npx wrangler dev
npx wrangler deploy
```

That produces an HTTPS-hosted static PWA on a Cloudflare `workers.dev` URL, which gives the service worker and installable PWA the secure origin they need.

The same static app could also be published using Cloudflare Pages, including with Wrangler's `pages deploy` command. For new generated companions, Workers Static Assets is the preferred direction because it keeps the static deployment simple while leaving a clean path to add Worker/API behaviour later.

See `REUSE-AND-DEPLOYMENT.md` for the detailed Workers/Pages deployment pattern and how this should scale for generated companions.

## Reuse direction

The reusable product pattern I am exploring in another project is:

`website + PDF + itinerary + docs/Drive -> analyse event -> suggest requirements -> user adjusts -> structured event companion PWA`

The intent is not to build another giant event-management suite. The useful wedge is helping anyone turn existing event material into the companion they wish the event had, with optional personal relevance/recommendation layers kept separate from source-backed event facts.
