
self.addEventListener("install", (event) => {
    console.log("Service Worker installert");
    event.waitUntil(
        caches.open("oppskriftsapp-cache").then((cache) => {
            return cache.addAll([
                "/",
                "/html/oppskriftsapp.html",
                "/css/styles.css",
                "/js/app.js"
            ]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
