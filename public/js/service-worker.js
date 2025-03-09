const CACHE_NAME = "oppskriftsapp-cache-v2";
const ASSETS_TO_CACHE = [
    "/",
    "/html/oppskriftsapp.html",
    "/css/styles.css",
    "/js/app.js"
];

// Installer service worker og legg filer i cache
self.addEventListener("install", (event) => {
    console.log("Service worker installert!");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Aktiver service worker og fjern gammel cache
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Håndter fetch-forespørsler
self.addEventListener("fetch", (event) => {
    if (event.request.url.includes("app.js")) {
        // Sørger for at app.js alltid hentes ferskt
        event.respondWith(fetch(event.request));
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});