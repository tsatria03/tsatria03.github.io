const VERSION = "2.2";
const CACHE_NAME = "guess-number-cache-" + VERSION;
const CORE_FILES = [
  "./",
  "./index.html",
  "./game.js",
  "./modules/speech.js",
  "./modules/sound.js",
  "./style.css",
  "./manifest.json",
"./assets/audio/start.mp3",
"./assets/audio/stop.mp3",
"./assets/audio/high.mp3",
"./assets/audio/low.mp3",
  "./assets/icons/icon-192.png"
];
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_FILES))
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
      }).catch(() => caches.match("./index.html"));
    })
  );
}
);
