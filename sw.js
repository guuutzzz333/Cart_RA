const CACHE = "cart-shell-v59";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./fonts/GoogleSansFlex.ttf",
  "./fonts/MozillaHeadline.ttf",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      // cache.addAll() is all-or-nothing: one 404 (e.g. a mistyped icon
      // filename) fails the whole install, which stops the service worker
      // from ever activating — and Chrome requires an active service
      // worker before it will offer "Add to Home screen". Cache each file
      // independently instead, so a bad file just gets skipped.
      const results = await Promise.allSettled(SHELL.map((url) => cache.add(url)));
      results.forEach((r, i) => {
        if (r.status === "rejected") {
          console.warn("[sw] failed to cache", SHELL[i], r.reason);
        }
      });
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// App shell: cache-first. Everything else (the RetroAchievements API, badge
// images): network-first, falling back to cache if we've seen it before.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const isShell = url.origin === self.location.origin;

  if (isShell) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
