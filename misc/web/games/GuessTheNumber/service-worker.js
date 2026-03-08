const CACHE_NAME = "guess-number-cache-v1";

const CORE_FILES = [
  "./",
  "./index.html",
  "./scripts/game.js",
  "./scripts/speech.js",
  "./scripts/sound.js",
  "./styles/graphics.css",
  "./manifest.json",
  "./assets/icons/icon-192.png"
];
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_FILES);
    })
  );
});
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(() => {
        return caches.match("./index.html");
      });
    })
  );
}
);
