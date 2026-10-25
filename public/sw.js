/*
 * GOAT Atlas service worker.
 *
 * 目标很克制：让已经访问过的页面在断网时还能打开，不做全站预缓存。
 * - 导航请求：network-first，失败时回退到缓存页面或 /offline/
 * - /_next/static 与图片字体：cache-first
 * - 其他同源 GET：不拦截
 */

const CACHE_VERSION = "goat-atlas-v1";
const PAGE_CACHE = `${CACHE_VERSION}-pages`;
const STATIC_CACHE = `${CACHE_VERSION}-static`;

const SCOPE = self.registration.scope;
const OFFLINE_URL = new URL("offline/", SCOPE).href;
const PRECACHE_URLS = [SCOPE, OFFLINE_URL];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGE_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.startsWith(CACHE_VERSION))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.includes("/_next/static/") ||
    /\.(?:css|js|mjs|png|jpe?g|webp|avif|gif|svg|ico|woff2?|ttf)$/i.test(
      url.pathname,
    )
  );
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return new Response("", { status: 504, statusText: "Offline" });
  }
}

async function networkFirstPage(request) {
  const cache = await caches.open(PAGE_CACHE);

  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;

    const offline = await cache.match(OFFLINE_URL);
    if (offline) return offline;

    return new Response(
      "<!doctype html><meta charset=\"utf-8\"><title>离线</title><body style=\"font-family:system-ui;padding:2rem\"><h1>当前离线</h1><p>这个页面还没有被缓存。</p></body>",
      { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === new URL("sw.js", SCOPE).pathname) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
  }
});
