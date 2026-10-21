// CariSchool en ligne — service worker : tout le site est mis en cache pour fonctionner hors ligne.
// La liste des fichiers est injectée à la compilation (vite.web.config.ts).
const VERSION = '1.4.0-1792597838080';
const PRECACHE = ["./","./apple-touch-icon.png","./assets/01-cp-Bw-VaTLI.js","./assets/02-ce1-DKxBRW_d.js","./assets/03-ce2-sNXk0Ikm.js","./assets/04-cm1-DOuJ-wmZ.js","./assets/05-cm2-DauSbEzU.js","./assets/06-6e-CFAu0_L4.js","./assets/07-5e-BfPziCsD.js","./assets/08-4e-Dv0wee7j.js","./assets/09-3e-C5QVd1LO.js","./assets/10-2nde-D_9ZYnYx.js","./assets/11-1re-BtsuSJ7O.js","./assets/12-term-B5CsSdcH.js","./assets/20-formats-riches-BqHQEM4J.js","./assets/21-italien-u6XlT7oM.js","./assets/30-gen-01-cp-BuPPXK2b.js","./assets/30-gen-02-ce1-B-8hafcP.js","./assets/30-gen-03-ce2-sMcEeR_J.js","./assets/30-gen-04-cm1-BrF9U0f4.js","./assets/30-gen-05-cm2-DtDMHiwB.js","./assets/30-gen-06-6e-CaSr67in.js","./assets/30-gen-07-5e-BM2gcbXc.js","./assets/30-gen-08-4e-DxrgZ5q_.js","./assets/30-gen-09-3e-C5OK1E_l.js","./assets/30-gen-10-2nde-BqVKzR0E.js","./assets/30-gen-11-1re-BWxMHhGi.js","./assets/30-gen-12-term-C289xI9F.js","./assets/fredoka-hebrew-wght-normal-DdnsCkLr.woff2","./assets/fredoka-latin-ext-wght-normal-CYrqKuxd.woff2","./assets/fredoka-latin-wght-normal-DM6njrJ3.woff2","./assets/web-C-fozWji.css","./assets/web-CC_4p5GV.js","./favicon.svg","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./manifest.webmanifest","./index.html"];
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
