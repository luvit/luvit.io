self.importScripts('idb-keyval.js');

var hooks;
var updateConfig = (function () {
  var updating;
  var recheck;
  updateConfig();

  return updateConfig;

  function updateConfig() {
    if (updating) return recheck = true;
    updating = true;
    return idbKeyval.get("hookConfigs").then(onConfig);
  }

  function onConfig(configs) {
    if (configs || hooks) {
      hooks = [];
      for (var key in configs) {
        hooks.push(new RegExp(key), configs[key]);
      }
      if (hooks.length === 0) hooks = undefined;
      console.log("Hook Configs Updated");
      console.log(configs);
    }
    updating = false;
    if (!recheck) return;
    recheck = false;
    return updateConfig();
  }
}());

self.addEventListener('install', event => {
  // Bypass the waiting lifecycle stage,
  // just in case there's an older version of this SW registration.
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  // Take control of all pages under this SW's scope immediately,
  // instead of waiting for reload/navigation.
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', updateConfig);

self.addEventListener('fetch', event => {
  updateConfig();
  // If there are no custom configs (default state in production), do nothing.
  if (!hooks) return;

  var url = event.request.url;
  console.log("fetch", event.request.url);

  // Look for matching configured hooks
  for (var i = 0, l = hooks.length; i < l; i += 2) {
    if (hooks[i].test(url)) {
      var customUrl = url.replace(hooks[i], hooks[i + 1]);
      console.warn("URL override via custom hook", url, customUrl);
      return event.respondWith(fetch(customUrl));
    }
  }

});
