self.importScripts('idb-keyval.js');

var aliases = {
  index: /^https?:\/\/[^/]+\/(index.html)?$/,
};

var configs;
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

  function onConfig(newConfigs) {
    if ((configs || newConfigs) && JSON.stringify(newConfigs) !== JSON.stringify(configs)) {
      configs = newConfigs;
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
  if (!configs) return;

  var url = event.request.url;
  console.log("fetch", event.request.url);

  // Look for matching configured hooks
  var keys = Object.keys(configs);
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    if (aliases[key] ? aliases[key].test(url) : key === url) {
      var customUrl = configs[key];
      console.warn("URL override via custom hook", url, customUrl);
      return event.respondWith(fetch(customUrl));
    }
  }

});
