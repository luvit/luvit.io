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
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://lit.luvit.io/search/" + window.escape(text), true);
    xhr.send();
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) { return; }
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

}, false);
