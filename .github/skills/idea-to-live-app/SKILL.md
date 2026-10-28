---
name: idea-to-live-app
description: Guide a non-technical business analyst from a real problem to a small, tested, publicly shareable web app using AI, GitHub and Cloudflare's free tiers; help them iterate safely with branches and preview deployments.
---

# From idea to live app — guided BA prototyping skill

**Audience:** Business analysts and first-time app builders. **Outcome:** one useful, small web app with a shareable URL and a safe repeatable improvement loop.

This is a **guided conversation**, not an instruction to build everything immediately. Ordinary ChatGPT with an authorised GitHub MCP/plugin/connector can be sufficient for a small static app: it can create the files, update the repo and propose iterations in chat. Codex, Claude Code or ChatGPT Work are optional for more complex work, not prerequisites. You can paste this file's URL into a capable assistant, provide its contents, or install it in a skill-capable environment. A Markdown file alone does not grant GitHub or Cloudflare permissions; access and usage limits vary.

**Example:** [WAMCon Companion](https://wamcon-companion.markleonfreese.workers.dev/) is an *unofficial personal attendee experiment*, not an official WAM product. It assembled public conference programme information into a mobile view with Now/Next, filters, favourites and local notes. [Public example repository](https://github.com/markleonfreese/WAMCon-Companion). WAMCon was deployed using **Cloudflare Workers Static Assets**. For new BA-led prototypes, this guide defaults to **Cloudflare Workers Static Assets connected to GitHub via Workers Builds**. Cloudflare recommends Workers for new projects, and a Git-connected Worker can deploy automatically without a local terminal. Pages remains supported.

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
- **Recommended low-friction route:** Connect GitHub to ChatGPT or another chosen assistant via an authorised MCP/plugin/connector, if the user's account supports it. Verify which repo it can access and obtain permission for file creation or updates. In chat, ask the assistant to create the starter files and commit them to a new branch. No specialist coding agent or terminal is inherently required.
- **No Git tools installed:** Show the **Add file → Upload files** route on GitHub for a first draft; later use branches and GitHub's web editor, or an assistant with GitHub connection.
- **Git available:** Offer the CLI only as an optional advanced route.

Confirm that the repo has a README and no secrets or real personal data. **Do not paste access tokens into chat.**

## Stage 4 — Connect GitHub to Cloudflare Workers

Ask: **"Do you have a Cloudflare account?"**
- If not, direct them to [dash.cloudflare.com](https://dash.cloudflare.com/) to create a free account.
- Ask: **"Would you like a free public URL for the prototype, or do you already own a custom domain?"**
  - **Free URL:** Recommend the assigned `workers.dev` HTTPS address. No domain purchase required.
  - **Custom URL:** Optional. Domain registration and renewals may cost money. Only change DNS with explicit authorisation.
- Ask: **"Is the repository already linked to a Worker or a Pages project?"** Inspect or reuse the existing deployment where appropriate; do not create duplicates blindly.

### Cloudflare Workers — Git-connected, browser-led setup (default)

1. In the Cloudflare dashboard, open **Workers & Pages → Create application**, then choose the GitHub connection (dashboard labels may vary).
2. Authorise the appropriate GitHub repository and select the repository created in Stage 3.
3. Ensure the repository has an appropriate `wrangler.jsonc` file, which ChatGPT can add. For the example's `public/` folder, a minimal configuration is:

```json
{
  "name": "my-first-event-app",
  "compatibility_date": "2026-10-28",
  "assets": { "directory": "./public" }
}
```

4. Select the production branch (normally `main`). For plain static assets, the build command may be unnecessary; check the actual Workers Builds settings. Workers Builds uses its configured deployment command (normally `npx wrangler deploy`) on Cloudflare's infrastructure.
5. Save and deploy. Open the real assigned `workers.dev` URL on your phone. Check that the production build succeeded.

**The BA does not need to install or run Wrangler locally for this Git-connected path.** Changes to the configured production branch can trigger an automatic build and deployment. ChatGPT can manage the repo through GitHub permissions, and Cloudflare manages deployment through its separate GitHub connection.

**Why Workers instead of Pages?** Cloudflare recommends Workers Static Assets for new projects, including static sites and PWAs, and concentrates new features there. **Pages is still supported** and remains a usable alternate Git deployment path, with `pages.dev` addresses and previews. The same idea → Git → preview → production → feedback loop applies. Do not claim Pages has already shut down.

### Cloudflare Pages — supported alternative

If an existing Pages project is more suitable, connect it to GitHub, select `main`, use no framework or build command for plain static files, and set the output directory to `public`. Verify the actual production `pages.dev` address and deployment status. Do not assume a Pages project and a Worker are the same service.

## Stage 5 — Protect the live version using a branch

Ask: **"Is anybody using the live URL right now?"**

If **yes** (or unknown), tell ChatGPT to create a named feature branch, e.g. `feature/improve-session-search`, and modify the authorised repo there. Open a pull request into `main` and inspect the diff before approval.

With **Workers Builds**, non-production branch pushes can create separate Worker preview URLs **when preview builds are enabled and configured**. Check the actual URL in Cloudflare and GitHub's PR/build status; never invent it. The preview should not overwrite the public `workers.dev` production site. Preview URLs may themselves be publicly accessible: use only synthetic or approved public data.

After the user reviews the preview, tests the original task and accepts the changed behaviour, request explicit approval to merge into `main`. Workers Builds then automatically deploys production **if Git integration, branch settings and the build are working**. Verify success and the live URL: a commit does not guarantee a working site.

If the assistant lacks the necessary GitHub connection, explain the manual GitHub web-editor/PR route without pretending to edit or deploy files. If branch previews are not configured, explain the gap and arrange a safe isolated test; do not assume every branch has a URL.

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

- [Cloudflare Workers best practices (Workers for new projects)](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/)
- [Workers Builds: connect GitHub and deploy on push](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [Workers preview branches](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/)
- [Cloudflare Pages (still available)](https://developers.cloudflare.com/pages/)
- [GitHub getting started](https://docs.github.com/en/get-started)
- [WAMCon Companion example source](https://github.com/markleonfreese/WAMCon-Companion)

This is a **working educational guide**, not a guaranteed zero-cost production offer or an IIBA-approved operating procedure. Keep the exercise de-identified, use fictional data and validate provider instructions and tool permissions before acting.
