// CariSchool en ligne — service worker : tout le site est mis en cache pour fonctionner hors ligne.
// La liste des fichiers est injectée à la compilation (vite.web.config.ts).
const VERSION = '1.3.0-1792431626429';
const PRECACHE = ["./","./apple-touch-icon.png","./assets/01-cp-Bw-VaTLI.js","./assets/02-ce1-DKxBRW_d.js","./assets/03-ce2-sNXk0Ikm.js","./assets/04-cm1-DOuJ-wmZ.js","./assets/05-cm2-DauSbEzU.js","./assets/06-6e-CFAu0_L4.js","./assets/07-5e-BfPziCsD.js","./assets/08-4e-Dv0wee7j.js","./assets/09-3e-C5QVd1LO.js","./assets/10-2nde-D_9ZYnYx.js","./assets/11-1re-BtsuSJ7O.js","./assets/12-term-B5CsSdcH.js","./assets/20-formats-riches-BqHQEM4J.js","./assets/21-italien-u6XlT7oM.js","./assets/30-gen-01-cp-DYY78UXX.js","./assets/30-gen-02-ce1-DhtbsaYQ.js","./assets/30-gen-03-ce2-CQZ3_Mck.js","./assets/30-gen-04-cm1-BaswwxiL.js","./assets/30-gen-05-cm2-CqBOofmY.js","./assets/30-gen-06-6e-Bwg1rB17.js","./assets/30-gen-07-5e-6a3iODVs.js","./assets/30-gen-08-4e-BlH0XvYz.js","./assets/30-gen-09-3e-C76EgMkV.js","./assets/30-gen-10-2nde-B60AuVPH.js","./assets/30-gen-11-1re-DiJj2iXw.js","./assets/30-gen-12-term-BRYYMXV2.js","./assets/fredoka-hebrew-wght-normal-DdnsCkLr.woff2","./assets/fredoka-latin-ext-wght-normal-CYrqKuxd.woff2","./assets/fredoka-latin-wght-normal-DM6njrJ3.woff2","./assets/web-C-fozWji.css","./assets/web-VzC16ZrQ.js","./favicon.svg","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./manifest.webmanifest","./index.html"];
const CACHE = `carischool-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('carischool-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(
      (hit) =>
        hit ||
        fetch(req)
          .then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => (req.mode === 'navigate' ? caches.match('./index.html') : Response.error())),
    ),
  );
});
