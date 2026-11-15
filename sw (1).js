/*
 * Nullpunkt Service Worker: macht die App offline nutzbar.
 * Er speichert nur die Dateien der App selbst, nie Finanzdaten
 * (die liegen verschlüsselt in IndexedDB) und fragt nie fremde Adressen an.
 *
 * Bei jeder Änderung an einer Datei: VERSION erhöhen.
 */
const VERSION = '1.0.2';
const CACHE = `nullpunkt-${VERSION}`;
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

/* Alte Versionen aus dem Cache entfernen */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('nullpunkt-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  /* Nur eigene Dateien. Alles andere geht nicht durch den Service Worker. */
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    /* Seite: zuerst aus dem Netz, damit Updates sofort ankommen. Offline aus dem Cache. */
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const res = await fetch(req, { cache: 'no-cache' });
        if (res.ok) cache.put('./index.html', res.clone());
        return res;
      } catch (e) {
        return (await cache.match('./index.html')) || (await cache.match('./')) || Response.error();
      }
    })());
    return;
  }

  /* Übrige Dateien (Symbole, Manifest): zuerst aus dem Cache */
  event.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});
