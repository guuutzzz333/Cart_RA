# Cart — a home-screen app for RetroAchievements

A mobile-first Progressive Web App (PWA) for RetroAchievements. Once installed
on an Android phone, it opens from its own home-screen icon in its own
window — no address bar, no browser tabs, no re-typing a URL every time.
It shows your recent unlocks, your game library with progress bars, and your
site awards.

## What makes it feel like an app, not a website

- **Installable** — `manifest.json` + `sw.js` let Chrome on Android offer
  "Add to Home Screen" (the in-app button in Settings triggers this too).
  Once installed it launches in `standalone` mode: full-screen, its own
  task-switcher entry, its own icon.
- **Offline app shell** — the service worker caches the HTML/CSS/JS, so the
  interface still opens instantly with no signal; only live data needs a
  connection.
- **One-time login** — your username and API key are saved with
  `localStorage` on the device, so you sign in once, not every visit.

## 1. Get your API key

Log into retroachievements.org → your control panel → **Keys** section →
copy the **Web API Key**. Treat it like a password.

## 2. Host the files

This is a static site — any static host works: GitHub Pages, Cloudflare
Pages, Netlify, Vercel, or your own server. A service worker requires
**HTTPS** (or `localhost`), so opening `index.html` directly from disk won't
let it install as an app, even though the page itself will still load.

Quickest path with GitHub Pages:
1. Push this folder to a new GitHub repo.
2. Repo Settings → Pages → deploy from the `main` branch, root folder.
3. Visit the URL GitHub gives you on your Android phone.

## 3. Install it on Android

Open the hosted URL in Chrome → you'll see an **"Add to Home screen"**
banner, or use the app's own **Settings → Add to home screen** button, or
Chrome's ⋮ menu → *Add to Home screen*. It now behaves like a native app.

## 4. Sign in

In the app, go to **Settings**, enter your username and API key, tap
**Save & sync**.

## About CORS (read this if data won't load)

Browsers block a page from calling another site's API unless that API opts
in with a CORS header. RetroAchievements' API doesn't consistently send
one, so a direct request from this app can be silently blocked by the
browser even though your credentials are correct.

If Settings shows a "couldn't reach RetroAchievements directly" message,
deploy the included `proxy-worker.js` to Cloudflare Workers (free tier,
about a minute — instructions are in that file) and paste the resulting URL
into **Settings → CORS proxy URL**. The proxy only relays your request and
adds the missing header; your key still goes straight from your device to
RetroAchievements.

## Files

| File | Purpose |
|---|---|
| `index.html` | App shell markup |
| `css/styles.css` | Visual design |
| `js/api.js` | RetroAchievements API client |
| `js/app.js` | Screens, rendering, settings |
| `manifest.json` | Installability metadata |
| `sw.js` | Offline app-shell caching |
| `icons/` | Home-screen icons |
| `proxy-worker.js` | Optional CORS workaround (see above) |

## Notes & limits

- Uses the read endpoints only (profile, recent unlocks, completion
  progress, awards, per-game progress) — nothing writes back to your
  account.
- RetroAchievements enforces API rate limits; the app doesn't poll in the
  background, only on tab open, so normal use stays well within them.
- Field names are based on RetroAchievements' current public API docs
  (api-docs.retroachievements.org). If they change a response shape, the
  fix is localized to `js/api.js` and the render functions in `js/app.js`.
