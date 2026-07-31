# Cart — a home-screen app for RetroAchievements

A mobile-first Progressive Web App (PWA) for RetroAchievements. Once
installed on your phone, it opens from its own home-screen icon in its own
window — no address bar, no browser tabs, no re-typing a URL every time.

This version is deliberately just **4 files** — `index.html` (with all the
CSS and JS built in), `manifest.json`, `sw.js`, and two small icon images —
so the whole thing can be set up from a phone with no computer and no
folder uploads.

## Set it up entirely on Android, no computer needed

Do this in **Chrome or Samsung Internet** at github.com — not the GitHub
app, which can't create files or commits.

**1. Create the repo**
- Go to github.com, log in, tap **+** → **New repository**.
- Name it anything (e.g. `cart`), keep it Public, tap **Create repository**.

**2. Add the three text files**
For each of `index.html`, `manifest.json`, and `sw.js`:
- Tap **Add file → Create new file**.
- Type the filename exactly (e.g. `index.html`) in the name box.
- Open that file from this download on your phone (tap it, choose "Open
  with" a text viewer, or tap **Edit** if your file browser previews text),
  select all, copy, then paste the whole contents into GitHub's editor.
- Scroll down, tap **Commit changes**.

**3. Add the two icons**
- Tap **Add file → Create new file**, type `icons/.keep` as the name, leave
  it empty, **Commit changes** — this creates the `icons` folder.
- Tap into the new `icons` folder, tap **Add file → Upload files**, then
  pick `icon-192.png` and `icon-512.png` from your phone's storage (you may
  need to save them from this chat to your Downloads or Gallery first).
- Tap **Commit changes**.

**4. Turn on GitHub Pages**
- Go to the repo's **Settings** tab → **Pages** (left menu).
- Under "Build and deployment", set Source to **Deploy from a branch**,
  branch **main**, folder **/(root)**, tap **Save**.
- Wait ~1 minute, then refresh — GitHub shows the live URL at the top of
  that page (something like `https://yourname.github.io/cart/`).

**5. Install it**
- Open that URL in Chrome on your phone.
- Chrome's menu (⋮) → **Add to Home screen** — or use the app's own
  **Settings → Add to home screen** button.
- It now launches full-screen from its own icon, like a native app.

**6. Sign in**
- Log into retroachievements.org → your control panel → **Keys** section →
  copy the **Web API Key**.
- In the app: **Settings**, enter your username and that key, tap
  **Save & sync**.

## About CORS (read this if data won't load)

Browsers block a page from calling another site's API unless that API opts
in with a CORS header. RetroAchievements' API doesn't consistently send
one, so this app's direct requests can be silently blocked by the browser
even with correct credentials.

If Settings shows a "couldn't reach RetroAchievements directly" message,
the fix is `proxy-worker.js`, included alongside this app — deploy it to
Cloudflare Workers (free, works fine from a phone browser too, instructions
are in that file) and paste the resulting URL into **Settings → CORS proxy
URL**. It only relays your request and adds the missing header; your key
still goes straight from your device to RetroAchievements.

## Files

| File | Purpose |
|---|---|
| `index.html` | The entire app — markup, styling, and logic |
| `manifest.json` | Installability metadata |
| `sw.js` | Offline app-shell caching |
| `icons/` | Home-screen icons (2 files) |
| `proxy-worker.js` | Optional CORS workaround (see above) |

## Notes & limits

- Read-only: profile, recent unlocks, completion progress, awards, and
  per-game progress. Nothing writes back to your account.
- RetroAchievements enforces API rate limits; the app only fetches on tab
  open, not in the background, so normal use stays well within them.
- Field names follow RetroAchievements' current public API docs
  (api-docs.retroachievements.org). If a response shape changes, the fix is
  localized to the `RA` object near the top of the inline `<script>` in
  `index.html`.
