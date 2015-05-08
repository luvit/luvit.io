/*globals domChanger, moment*/
window.addEventListener("load", function () {
"use strict";

function SearchApp(emit, refresh) {
  var matches = [], query = [], text = "", querying = false, error = false;

  window.addEventListener("hashchange", function (evt) {
    evt.preventDefault();
    refresh();
  }, false);

  return { render: render };

  function checkHash() {
    var match = window.location.hash.match("#?(.*)")[1];
    if (match !== text) {
      text = match;
      search();
    }
  }

  function render() {
    checkHash();

    var searchBox = ["section.single",
      ["form", { onsubmit: handleSubmit },
        ["input", {
          onchange: onChange,
          value: text
        }], ["button", "Search"],
      ]
    ];
    var summary = ["section.single", query.map(function (term, i) {
      return ["span.term",
        ["a", {href:"#solo",onclick:solo,title:"Single out this term"}, term],
        " ",
        ["a.close", {href:"#remove",onclick:remove,title:"Remove this term"}, "×"]
      ];
      function solo(evt) {
        evt.preventDefault();
        query.length = 0;
        query.push(term);
        window.location.hash = term;
      }
      function remove(evt) {
        evt.preventDefault();
        query.splice(i, 1);
        window.location.hash = query.join(' ');
      }
    })];

    if (!(error || querying)) {
      return [searchBox, summary, [SearchResults, matches]];
    }
    if (error) {
      summary.push(["p", error]);
    }
    else if (querying) {
      summary.push(["p", "Querying..."]);
    }
    return [searchBox, summary];
  }

  function search() {
    querying = true;
    refresh();
    var xhr = createCORSRequest("GET", "//lit.luvit.io/search/" + window.escape(text || "*"));
    if (!xhr) { throw new Error("Your browser doesn't appear to support CORS requests"); }
    xhr.send();
    xhr.onerror = function () {
      querying = false;
      error = "There was a problem making the request";
      refresh();
    };
    xhr.onload = function () {
      var result = JSON.parse(xhr.responseText);
      querying = false;
      error = false;
      matches.length = 0;
      var keys = Object.keys(result.matches);
      var key;
      for (var i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        var match = result.matches[key];
        match.name = key;
        matches[i] = match;
      }
      matches.sort(function (a, b) {
        if (a.score !== b.score) {
          return a.score - b.score;
        }
        if (a.tagger && b.tagger) {
          return b.tagger.date.seconds - a.tagger.date.seconds;
        }
        return a.name.localeCompare(b.name);
      });
      query.length = 0;
      keys = Object.keys(result.query);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        if (key === "raw") { continue; }
        var terms = result.query[key];
        for (var j = 0, end = terms.length; j < end; j++) {
          var term = terms[j]
          .replace(/%f\[@\]$/, '')
          .replace(/%./, function (match) {
            return match[1];
          })
          .replace(".*", "*")
          .replace(/^\^/, '')
          .replace(/\$$/, '');
          if (key !== "search") {
            term = key + ":" + term;
          }
          query.push(term);
        }
      }
      refresh();
    };
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    window.location.hash = text;
    search();
  }

  function onChange(evt) {
    text = evt.target.value;
  }
}

function SearchResults() {
  return { render: render };
  function render(matches) {
    var start = 0;
    if (matches.length === 0) {
      return ["section.single", "No matches, try making a broader search."];
    }

    return [
      ["section.single", "Found " + matches.length + " match" + (matches.length === 1 ? "" : "es")],
      matches.map(function (match, i) {
        var tag = "section.third.card";
        if (i % 3 === start) {
          tag += ".clear";
        }
          return [tag, [PackageCard, match]];
      })
    ];
  }
}

function PackageCard(emit, refresh) {
  var open = false;
  return { render: render };
  function render(item) {
    var matches = item.name.match(/(.*)\/([^\/]*)/);
    var author = matches[1];
    var name = matches[2];
    var tag = author + "/" + name;
    var body = [["span.icon-book"],
      ["a", {href:"#author:" + author}, author],
      "/",
      ["a", {href:"#depends:" + tag}, ["strong", name]]];
    if (item.description) {
      body.push(["p", item.description]);
    }
    var rows = [];
    if (item.private) {
      rows.push([["span.icon-eye-blocked"], "Private Module"]);
    }
    if (item.homepage) {
      rows.push([["span.icon-earth"], ["a", {href: item.homepage}, "Homepage"]]);
    }
    if (item.version) {
      rows.push([["span.icon-price-tag"], "v" + item.version]);
    }
    if (item.tagger) {
      var tagger = item.tagger;
      var date = moment.unix(tagger.date.seconds).utcOffset(tagger.date.offset);
      var details = date.toString() + "\n" +
        tagger.name + " <" + tagger.email + ">";
      rows.push([["span.icon-calendar"], ["span",
        {title: details}, date.fromNow()]]);
    }
    if (item.license) {
      rows.push([["span.icon-hammer2"], item.license + " licenced"]);
    }
    if (item.author) {
      rows.push([["span.icon-user"], [Person, item.author]]);
    }
    if (item.contributors) {
      rows.push([["span.icon-users"], "Contributors:", ["ul", item.contributors.map(function (person) {
        return ["li", [Person, person]];
      })]]);
    }
    if (item.luvi) {
      var luvi = "Luvi: ";
      if (item.luvi.flavor) {
        luvi += " " + item.luvi.flavor;
      }
      if (item.luvi.version) {
        luvi += " v" + item.luvi.version;
      }
      rows.push([["span.icon-cog"], luvi]);
    }
    if (item.keywords) {
      if (item.tags) {
        item.tags.push.apply(item.tags, item.keywords);
      }
      else {
        item.tags = item.keywords;
      }
      delete item.keywords;
    }
    if (item.tags) {
      rows.push([["span.icon-price-tags"], item.tags.map(function (tag) {
        var line = ["a.keyword", {href: "#tag:" + tag}, tag];
        return line;
      })]);
    }
    if (item.dependencies) {
      var count = item.dependencies.length;
      var row = [
        ["span.icon-books"],
        ["a", {href:"#", onclick: toggleDeps},
          (open ? "Hide " : "Show ") +
          count + " dependenc" + (count === 1 ? "y" : "ies")
        ]
      ];
      if (open) {
        row.push(["ul", item.dependencies.map(function (dependency) {
          var match = dependency.match(/^(.*)\/([^\/@]+)(?:@(.*))?$/);
          var author = match[1];
          var name = match[2];
          var line = ["li", ["a", {href: "#author:" + author + " name:" + name, title:dependency}, name]];
          if (match[3]) {
            line.push(" v" + match[3]);
          }
          return line;
        })]);
      }
      rows.push(row);
    }
    body.push(["ul", rows.map(function (row) {
      return ["li"].concat(row);
    })]);

    return body;

  }

  function toggleDeps(evt) {
    evt.preventDefault();
    open = !open;
    refresh();
  }
}

function Person() {
  return { render: render };
  function render(person) {
    if (typeof person === "string") {
      var match = person.match(/^(.*?) *(?:<([^>]+)>)?$/);
      if (match) {
        person = {
          name: match[1],
          email: match[2],
        };
      }
    }
    var line = person.name;
    if (person.email && !person.url) {
      person.url = "mailto:" + person.email;
    }
    if (person.url) {
      var attribs = {href: person.url};
      if (person.email) {
        attribs.title = person.email;
      }
      return ["a", attribs, line];
    }
    return ["span", line];
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
