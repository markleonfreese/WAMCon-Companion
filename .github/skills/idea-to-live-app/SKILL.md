---
name: idea-to-live-app
description: Guide a non-technical business analyst from a real problem to a small, tested, publicly shareable web app using AI, GitHub and Cloudflare's free tiers; help them iterate safely with branches and preview deployments.
---

# From idea to live app — guided BA prototyping skill

**Audience:** Business analysts and first-time app builders. **Outcome:** one useful, small web app with a shareable URL and a safe repeatable improvement loop.

This is a **guided conversation**, not an instruction to build everything immediately. You can paste this file's URL into a coding assistant, provide its contents, or install it in a skill-capable environment. A Markdown file alone does not give an assistant GitHub or Cloudflare permissions.

**Example:** [WAMCon Companion](https://wamcon-companion.markleonfreese.workers.dev/) is an *unofficial personal attendee experiment*, not an official WAM product. It assembled public conference programme information into a mobile view with Now/Next, filters, favourites and local notes. [Public example repository](https://github.com/markleonfreese/WAMCon-Companion). WAMCon was deployed using **Cloudflare Workers Static Assets**. For new BA-led prototypes, this guide defaults to **Cloudflare Pages with GitHub integration**, which is often simpler and offers automatic preview builds.

## Assistant operating rules

- **Ask one practical question at a time.** Offer examples when the BA is uncertain, and periodically summarise decisions in plain language.
- Do not require a formal BRD, PRD, cloud expertise or paid tools. Capture a small **BA mini-brief**.
- Make no changes to repositories, cloud accounts, domains, permissions or published sites without the user's explicit authorisation. Check actual connected-tool access; otherwise provide clicks or copyable files/commands. Never imply something was deployed when it was not.
- Prefer the **smallest static site** with HTML, CSS, JavaScript and synthetic JSON data. No login, payments, analytics, tracking, personal data, database or external API unless the hypothesis truly needs one.
- Treat AI-created source code as untrusted until reviewed and tested. Do not put secrets, API keys, tokens, contact lists or private member/attendee data in prompts, code, or a public repository.
- Default to **preview branch → test → user approves → merge to production** if anyone is relying on the live site. Avoid direct pushes to `main` by default. For a throwaway first demo, confirm before using a direct-`main` workflow.
- Free tiers have limits, which may change; the AI coding tool may have separate fees. Do not promise a zero-cost production service or automatically upgrade a paid plan.

## Stage 1 — Discover the smallest useful problem

Ask, one at a time:
1. "Who will use it, and what task is frustrating today?"
2. "What would a person actually do in your app? Tell me one simple example."
3. "What do we need to learn from the first version?"
4. "Which ONE user journey should work first?"
5. "What would tell us that it worked? Who can test it?"
6. "Does the example need any real data or accounts, or could fictional data prove the idea?"

Produce this short brief and ask the BA to confirm:

| Mini-brief | Answer |
|---|---|
| User & problem | [one sentence] |
| One task | [one sentence] |
| Hypothesis | [one uncertainty] |
| First-version scope | [maximum three small behaviours] |
| Out of scope | [features deliberately excluded] |
| Test | [task + observable pass condition] |
| Data | [synthetic or approved public source] |
| Reviewer | [one person who did not build it] |

**Stop point:** If a clickable mock-up, form or spreadsheet would answer the question more cheaply, recommend that instead. Do not push toward an app unnecessarily.

## Stage 2 — Choose the simplest implementation

Default recommendation for a basic website:
- `index.html` — layout
- `styles.css` — appearance
- `app.js` — interactions
- `schedule.json` or `data.json` — fictional sample records
- `README.md` — how to use, test and update the app
- `.gitignore` — files that must not be committed

Make it **phone-first**; support keyboard use, visible labels, readable contrast, loading/empty/error states and browser refresh. Use `localStorage` only for non-sensitive, on-device favourites. Explain that browser storage is tied to one browser/device and can be cleared. A PWA manifest and offline support are **optional enhancements**, not prerequisites to publishing.

### Prompt to generate the app

> I am a business analyst, not an expert developer. Using the confirmed mini-brief below, build the smallest static mobile-first web app with only HTML, CSS and vanilla JavaScript. Put publishable files in a `public/` folder, include a README, use fictional data, and write three observable acceptance tests. Explain which files are created. Do not introduce authentication, a backend, analytics, paid APIs or an AI feature unless we agree it is necessary. First show the brief and proposed file list; wait for my approval before coding.
>
> [Paste mini-brief here.]

If the assistant has repository-editing tools, verify the working directory and requested repo before touching anything. Without those tools, let the BA download generated files and upload them through the GitHub website.

## Stage 3 — Set up GitHub (ask before creating anything)

Ask: **"Do you already have a GitHub account and a repository for this idea?"**

- **No account:** Explain how to create one at [github.com](https://github.com/) using its free account option; do not ask for their password or verification code.
- **No repository:** Guide them to **New repository** → descriptive name → **Public** only if the content is safe to publish (otherwise private, then verify hosting access) → Create repository. If local files already contain a README, avoid GitHub's initial README to prevent an unnecessary conflict.
- **Existing repository:** Ask for the URL and check whether it already contains a site and whether anyone relies on its `main` branch. Avoid overwriting unrelated work.
- **No Git tools installed:** Show the **Add file → Upload files** route on GitHub for a first draft; later use branches and GitHub's web editor, or an assistant with GitHub connection.
- **Git available:** Offer the CLI only as an optional advanced route.

Confirm that the repo has a README and no secrets or real personal data. **Do not paste access tokens into chat.**

## Stage 4 — Set up Cloudflare and select an address

Ask: **"Do you have a Cloudflare account?"**
- If not, direct them to [dash.cloudflare.com](https://dash.cloudflare.com/) to create a free account.
- Ask: **"Do you want a free public URL now, or do you already own a custom domain?"**
  - **Free URL:** Recommend `<project>.pages.dev` for this workflow. No domain purchase required.
  - **Custom URL:** Optional. Explain that domain registration/renewal may cost money; only connect a domain they own or are authorised to control. **Do not modify DNS without permission.**
- Ask: **"Is there already a Pages project connected to this GitHub repository?"** Reuse it when practical.

### Cloudflare Pages — browser-based Git integration (default)

In the Cloudflare dashboard, choose **Workers & Pages → Pages → Connect to Git** (interface labels may change). Authorise the required GitHub repository. Select its production branch (normally `main`). For the recommended `public/` folder of plain static files:
- **Framework preset:** None
- **Build command:** Leave empty / none
- **Build output directory:** `public`

Check the deployment result and visit the assigned `pages.dev` URL on a phone. Cloudflare Pages can automatically rebuild after pushes to the connected production branch.

**WAMCon reference only:** Its existing public `workers.dev` site uses a separate Workers Static Assets configuration and `npx wrangler deploy`. Do not tell a new user that Cloudflare Pages and Workers are the same deployment, or that a GitHub push automatically deploys a manually configured Workers project.

## Stage 5 — Protect the live version using a branch

Ask: **"Is anybody using the current live URL?"**

If **yes** (or unknown), use a feature branch, such as `feature/improve-session-search`. In the GitHub web UI, create the branch from `main`; edit/upload changes there. Open a **pull request into `main`**, then review and test before merging.

For a Git-integrated **Cloudflare Pages** project, non-production branches and in-repository pull requests can generate **preview deployments**, subject to branch-control settings. The preview has its own URL and does not overwrite the production `pages.dev` address. Find the actual URL in Cloudflare's deployments or the PR checks; **never guess a URL**. Preview URLs may be public, so they must not contain secrets or private data.

Only after reviewing the preview, acceptance results and changed files, ask the BA to **approve merging**. When approved, merge to `main`; Pages should deploy production automatically if integration and branch settings are enabled. Confirm that the build passed and **test the production URL again**. A successful push is not proof of a successful deployment.

If no Git integration or preview deployment is available, explain that limitation and arrange a manual isolated preview; do not claim a branch automatically receives a web URL.

## Stage 6 — THE REPEAT LOOP (not optional)

`Problem → Small build → Preview → Observe → Decide → Improve → Preview → Approve → Publish → Observe again`

Run this after the first demo and after every meaningful change:

1. **Observe:** Ask a new tester to attempt the original user task without coaching.
2. **Record:** Expected / observed / pass? / friction / link or screenshot / date.
3. **Prioritise:** Pick **one** improvement that best addresses the observed problem. Avoid expanding into five features.
4. **Change safely:** Tell the coding assistant to modify **only** what is needed on a feature branch; ask it to explain the diff and identify affected behaviour.
5. **Preview:** Open the actual preview URL on desktop and mobile; test the original task and the one changed behaviour.
6. **Approve:** BA or owner accepts/rejects the change; merge only if tests pass.
7. **Publish:** Wait for successful deployment, verify the live URL, and record what changed.
8. **Repeat or stop:** Ask whether the uncertainty was answered. Stop, pivot or extend only on evidence.

Keep a tiny change record in the README or a `CHANGELOG.md`:

| Date | Observed problem | Change | Preview test | Released? |
|---|---|---|---|---|
| YYYY-MM-DD | Tester could not find saved item | Add My Plan label | Passed on phone | Yes/No |

### Prompt for a single iteration

> We have a working app at [repo URL] and [live URL]. Here is one observed problem: [description]. Our acceptance check is [test]. Please propose the *smallest* change. Work on a feature branch rather than `main` unless I explicitly approve otherwise. Show changed files, explain possible regressions and give me the preview URL only if it actually exists. Stop before merging or production deployment for my approval.

## Stage 7 — Wrap up / handover

Confirm the BA can answer:
- What problem did we test, and what did we learn?
- Where are the **repository**, **working preview**, and **production URL**?
- How does a GitHub change reach the live site? Is automatic deployment **verified**?
- Who can approve merges or domain changes?
- How would another person test, roll back or improve this version?
- Is it still a POC, or does it now need accessibility, privacy, security, support and operational review before real use?

Create a two-minute handover with those answers. Do not label a POC production-ready just because it has a public URL.

## Sources and free-tier caveats

- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Cloudflare Pages preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
- [Cloudflare Pages free-tier limits](https://developers.cloudflare.com/pages/platform/limits/)
- [GitHub getting started](https://docs.github.com/en/get-started)
- [WAMCon Companion example source](https://github.com/markleonfreese/WAMCon-Companion)

This is a **working educational guide**, not a guaranteed zero-cost production offer or an IIBA-approved operating procedure. Keep the exercise de-identified, use fictional data and validate any current provider instructions before acting.
