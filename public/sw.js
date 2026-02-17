const CACHE_NAME = "smart-bookmark-v2";

// Install — activate immediately, no pre-caching dynamic routes
self.addEventListener("install", () => {
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, fallback to cache (only cache static assets)
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  if (e.request.url.startsWith("chrome-extension://")) return;

  // Only cache static assets (js, css, images, fonts), not HTML/API routes
  const url = new URL(e.request.url);
  const isStatic = /\.(js|css|png|jpg|jpeg|svg|gif|webp|woff2?|ttf|ico)$/i.test(url.pathname)
    || url.pathname.startsWith("/_next/static");

  if (isStatic) {
    e.respondWith(
      caches.match(e.request).then((cached) =>
        cached || fetch(e.request).then((res) => {
          if (res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => {
              try { cache.put(e.request, clone); } catch {}
            });
          }
          return res;
        })
      )
    );
  }
});
