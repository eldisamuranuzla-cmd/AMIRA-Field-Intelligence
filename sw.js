const CACHE="amira-v16-worker-item-v1";
const ASSETS=["./","./index.html","./manifest.webmanifest","./astra-agro-50-header.png","./astra-agro-logo-compact.png","./astra-agro-logo.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const req=e.request;if(req.method!=="GET")return;e.respondWith(fetch(req).then(r=>{const c=r.clone();caches.open(CACHE).then(cache=>cache.put(req,c)).catch(()=>{});return r}).catch(()=>caches.match(req).then(r=>r||caches.match("./index.html"))))});
