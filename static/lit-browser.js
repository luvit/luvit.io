/*globals domChanger*/
window.addEventListener("load", function () {
"use strict";

function SearchApp(emit, refresh) {
  var matches = [], text = "", querying = false;

  return { render: render };

  function render() {
    return ["div",
      ["h3", "Lit Package Search"],
      ["form", { onsubmit: handleSubmit },
        ["input", {
          onchange: onChange,
          value: text
        }],
        ["button", "Search"]
      ],
      (querying ? ["p", "Querying..."] : [SearchResults, matches])
    ];
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    querying = true;
    refresh();
    var xhr = createCORSRequest("GET", "http://lit.luvit.io/search/" + window.escape(text));
    if (!xhr) { throw new Error("Your browser doesn't appear to support CORS requests"); }
    xhr.send();
    xhr.onerror = function () {
      throw new Error("There was a problem making the request");
    };
    xhr.onload = function () {
      var result = JSON.parse(xhr.responseText);
      matches.length = 0;
      querying = false;
      var keys = Object.keys(result.matches);
      for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i];
        var match = result.matches[key];
        match.name = key;
        matches[i] = match;
      }
      refresh();
    };
  }

  function onChange(evt) {
    text = evt.target.value;
  }
}

function SearchResults() {
  return { render: render };
  function render(matches) {
    return ["ul", matches.map(function (match) {
      return ["li", match.name];
    })];
  }
}

var container = document.getElementById("lit-browser");
container.textContent = "";
domChanger(SearchApp, container).update();

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest !== "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}


}, false);
