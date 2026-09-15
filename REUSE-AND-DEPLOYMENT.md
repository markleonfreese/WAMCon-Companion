# Reusing the WAMCon Companion pattern

This repository is event-specific, but the implementation pattern is deliberately simple enough to reuse for conferences, festivals, showcases and other multi-session events.

In another project I am working on, I am exploring how to automate this process so a non-developer can supply a website and programme PDF, review what was extracted, adjust the suggested app requirements and generate a similar PWA without editing code.

## What is event-specific here

The main WAMCon-specific inputs are:

- `schedule.json` - conference programme data;
- `showcase.json` - performance/set-time data;
- `artists.json` - optional personalisation/profile overlay;
- event wording, links and Showcase-specific UI in `index.html`;
- the Perth/AWST timezone and 2026 event dates in `app.js`;
- icons/branding.

Most of the useful attendee behaviour is generic:

- Now / Next;
- multi-day schedule;
- filters;
- My Plan/favourites;
- check-ins;
- notes;
- import/export;
- offline caching;
- installable PWA behaviour.

A reusable generator should move event-specific values into configuration/data and keep these behaviours as stable components.

## Events this pattern can suit

The same pattern can work for:

- professional conferences;
- industry summits;
- music festivals and showcases;
- arts/cultural programmes;
- multi-stage community festivals;
- conventions;
- university/open-day programmes;
- workshops and training days;
- association conferences;
- retreats and multi-day group itineraries;
- any event where attendees need to repeatedly answer `what is happening now, what is next, and what do I want to attend?`.

Different event shapes can enable different components. For example:

| Event characteristic | Useful companion capability |
| --- | --- |
| multiple days | day/date navigation |
| parallel sessions | My Plan + clash awareness |
| several rooms/venues | venue filter + maps |
| music/performance programme | set-time view + artist profiles |
| many speakers | speaker pages |
| weak connectivity | aggressive offline caching |
| lots of programme documents | mobile resource index |
| lots of choice | personal relevance/recommendations |
| live schedule changes | update/status banner |

## Manual reuse today

Before an automated companion builder exists, another developer or LLM can reuse this repository as a starting point:

1. Replace the WAMCon schedule/showcase JSON with structured data for the new event.
2. Update event dates and timezone.
3. Remove WAM-specific Showcase UI if it does not apply.
4. Update links, labels, title, description, manifest and icons.
5. Optionally create a new attendee-specific relevance layer.
6. Test Now/Next at representative event times.
7. Test offline behaviour and installation.
8. Publish the static directory to HTTPS hosting.

The important rule is to keep source-backed event facts separate from any LLM-generated summaries or personal recommendations.

## LLM-assisted reuse

A capable LLM can help with much of the transformation:

- analyse an event website/programme PDF;
- identify event shape and useful app requirements;
- convert programme information into the structured schedule format;
- identify conflicts or missing times/venues;
- suggest which WAMCon components should be retained or removed;
- adapt labels such as `Sessions`, `Acts`, `Workshops` or `Stages`;
- create a separate preference/relevance overlay for a specific attendee.

The future companion-builder work I am exploring formalises this as:

`sources -> analyse -> validate -> suggest requirements -> user adjusts -> preview -> render stable PWA -> publish`

The LLM should not be allowed to silently invent dates, times, venues or other logistics. Those should be validated and surfaced for review.

# How this WAMCon PWA is published on Cloudflare

The live version is:

https://wamcon-companion.markleonfreese.workers.dev/

This repository uses **Cloudflare Workers Static Assets**. There is no server application required for the WAMCon version.

The repository contains `wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "wamcon-companion",
  "compatibility_date": "2026-08-14",
  "assets": {
    "directory": "."
  }
}
```

`assets.directory` points to the repository root because the app itself is plain static HTML/CSS/JavaScript/JSON plus its PWA assets.

`.assetsignore` prevents repository/development files such as `.git`, `.github`, `node_modules`, the README and Wrangler configuration from being uploaded as public site assets.

## Workers Static Assets deployment

With Node/npm available and Cloudflare authentication configured, the project can be previewed with Wrangler and deployed with:

```bash
npx wrangler dev
npx wrangler deploy
```

Wrangler uploads the configured static assets and Cloudflare serves them from the Worker deployment. With the current Worker name this can be exposed on a `workers.dev` hostname such as the live WAMCon URL.

This is a particularly good fit for this PWA because:

- the build has no server runtime dependency;
- static assets can be cached globally;
- HTTPS is automatic, which is required for normal PWA/service-worker behaviour;
- updates can be deployed by replacing the static files and running Wrangler again;
- a custom domain can be added later without changing the PWA architecture.

## Cloudflare Pages alternative

The same static app can also be deployed using Cloudflare Pages. For a directory containing the final site files, Wrangler supports:

```bash
npx wrangler pages deploy . --project-name=<project-name>
```

Pages can also be connected to a Git repository for build/deploy workflows.

For new generated companions, Workers Static Assets is the preferred Cloudflare path because it is Cloudflare's current recommended direction for new static applications and gives a clean path to adding Worker/API logic later. Pages remains a valid option for simple static deployments.

## How a future Companion Builder should publish generated PWAs

### POC

Keep it almost identical to WAMCon:

```text
approved event model + app config
        |
render static PWA directory
        |
manifest + service worker + event JSON + UI
        |
Cloudflare Workers Static Assets
        |
shareable HTTPS URL
```

This proves that the generated output is a real portable PWA rather than only a preview inside a builder.

### Scale beyond the POC

Do not create and administratively manage a completely separate Cloudflare Worker for every free user forever.

A scalable version can use one shared companion runtime:

```text
companion.example.com/<event-slug>
        |
Cloudflare Worker / static app shell
        |
approved event configuration + data
        |
R2/KV/D1 or another suitable backing store
```

The shared shell can be cached globally while each event supplies its own validated configuration/data. Custom/export deployments can remain an optional path later.

That preserves the WAMCon experience while avoiding per-event deployment overhead.

## PWA requirements worth preserving

For any hosting option, generated apps should retain:

- HTTPS;
- valid web app manifest;
- service worker/offline cache;
- stable relative asset paths;
- icons;
- mobile viewport configuration;
- deterministic event timezone handling;
- source attribution and unofficial/official status;
- a cache/update strategy so changed schedules do not remain silently stale.
