const CACHE_NAME = 'mlbb-hero-randomizer-v1';
const ASSETS = [
  '/',
  'index.html',
  'style.css',
  'script.js',
  'hero_mlbb_with_images.json',
  'spin.mp3',
  'result.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
