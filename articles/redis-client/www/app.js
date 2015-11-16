window.onload = function () {
  var url = (""+window.location.origin).replace(/^http/, "ws");
  var connection = new WebSocket(url, ['resp']);

  connection.onopen = function (evt) {
    console.log("Connected to " + url);
    setInterval(update, 500);
    update();
  };

  function update() {
    connection.send("ZREVRANGEBYSCORE frequency inf 5 WITHSCORES LIMIT 0 200");
  }

  connection.onerror = function (evt) {
    console.error("Problem connecting to " + url);
  };

  connection.onmessage = function (evt) {
    var items = [];
    var data = {};
    var list = JSON.parse(evt.data);

    for (var i = 0; i < list.length; i += 2) {
      var name = list[i], freq = list[i + 1];
      data[name] = freq;
      items.push([".entry", {style:{
        backgroundColor:"#" + string_to_color(name, 40),
        color:"#" + string_to_color(name, -20),
        borderColor:"#" + string_to_color(name, -10),
      }},
        ["span.name", name],
        " ",
        ["span.freq", freq]
      ]);
    }
    console.log(data);
    var root = domBuilder(items);
    document.body.textContent = "";
    document.body.appendChild(root);
  };

};
