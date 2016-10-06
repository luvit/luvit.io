if ('serviceWorker' in navigator) {

  navigator.serviceWorker.register('service-worker.js').then(reg => {
    // console.log("Global url override system installed:\n  hookSet(name, value)\n  hookClear()\n");
  }).catch(error => {
    console.error('Registration failed with ' + error);
  });

  function any(obj) {
    for (var key in obj) return true;
    return false;
  }

  function hookSet(name, value) {
    // Load the config from indexedDB
    idbKeyval.get("hookConfigs").then(configs => {
      configs = configs || {};

      // Update the configs
      if (value) configs[name] = value;
      else delete configs[name];

      // And save
      return any(configs) ?
        idbKeyval.set("hookConfigs", configs) :
        idbKeyval.delete("hookConfigs");
    }).then(() => {
      // Notify the serviceWorker there was a change.
      navigator.serviceWorker.controller.postMessage(true);
    });
  }

  function hookClear() {
    // Clear the config from indexedDB
    idbKeyval.delete("hookConfigs").then(() => {
      // Notify the serviceWorker there was a change.
      navigator.serviceWorker.controller.postMessage(true);
    });
  }

  (function() {
    /*
    Copyright 2016, Jake Archibald

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
    */
    'use strict';
    var db;

    function getDB() {
      if (!db) {
        db = new Promise(function(resolve, reject) {
          var openreq = indexedDB.open('keyval-store', 1);

          openreq.onerror = function() {
            reject(openreq.error);
          };

          openreq.onupgradeneeded = function() {
            // First time setup: create an empty object store
            openreq.result.createObjectStore('keyval');
          };

          openreq.onsuccess = function() {
            resolve(openreq.result);
          };
        });
      }
      return db;
    }

    function withStore(type, callback) {
      return getDB().then(function(db) {
        return new Promise(function(resolve, reject) {
          var transaction = db.transaction('keyval', type);
          transaction.oncomplete = function() {
            resolve();
          };
          transaction.onerror = function() {
            reject(transaction.error);
          };
          callback(transaction.objectStore('keyval'));
        });
      });
    }

    var idbKeyval = {
      get: function(key) {
        var req;
        return withStore('readonly', function(store) {
          req = store.get(key);
        }).then(function() {
          return req.result;
        });
      },
      set: function(key, value) {
        return withStore('readwrite', function(store) {
          store.put(value, key);
        });
      },
      delete: function(key) {
        return withStore('readwrite', function(store) {
          store.delete(key);
        });
      },
      clear: function() {
        return withStore('readwrite', function(store) {
          store.clear();
        });
      },
      keys: function() {
        var keys = [];
        return withStore('readonly', function(store) {
          // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
          // And openKeyCursor isn't supported by Safari.
          (store.openKeyCursor || store.openCursor).call(store).onsuccess = function() {
            if (!this.result) return;
            keys.push(this.result.key);
            this.result.continue();
          };
        }).then(function() {
          return keys;
        });
      }
    };

    if (typeof module != 'undefined' && module.exports) {
      module.exports = idbKeyval;
    } else {
      self.idbKeyval = idbKeyval;
    }
  }());

}
