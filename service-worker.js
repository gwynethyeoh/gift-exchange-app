const CACHE_NAME='gift-exchange-cache-v1';

const urlsToCache=[

  './',

  './index.html',

  './app.js',

  './manifest.json',

  './icons/icon-192.png',

  './icons/icon-512.png',

  // Add all design images

  './images/风将起.jpg',

  './images/你在我喜欢的世界里.jpg',

  './images/像晴天像雨天.jpg',

  './images/倒影里的星星.jpg',

  './images/在惊涛骇浪里.jpg',

  './images/黑梦.jpg',

  './images/共赴.jpg',

  './images/情骨.jpg',

  './images/去见你.jpg',

  './images/耿.jpg'

];

self.addEventListener('install', event=>{

  event.waitUntil(

    caches.open(CACHE_NAME)

    .then(cache=>cache.addAll(urlsToCache))

  );

});

self.addEventListener('fetch', event=>{

  event.respondWith(

    caches.match(event.request)

    .then(response=>response || fetch(event.request))

  );

});
