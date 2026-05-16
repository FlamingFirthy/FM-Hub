const CACHE_NAME = "fmhub-cache-v30";

const urlsToCache = [
  "./",
  "./index.html",
  "./saves.html",
  "./squad.html",
  "./people.html",
  "./notes.html",
  "./links.html",
  "./firebase.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, copy);
        });

        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
