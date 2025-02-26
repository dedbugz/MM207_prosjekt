
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
        .then(() => console.log("Service Worker registrert"))
        .catch(err => console.error("Service Worker feilet:", err));
}
