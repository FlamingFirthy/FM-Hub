const CACHE_NAME = "fmhub-cache-v1";

const urlsToCache = [
  "./",
  "./index.html",
  "./saves.html",
  "./squad.html",
  "./people.html",
  "./notes.html",
  "./links.html",
  "./firebase.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});