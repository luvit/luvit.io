window.addEventListener("load", function () {
  "use strict";
  var map = {
    lua: "text/x-lua",
    sh: "text/x-sh",
  };
  var codes = document.querySelectorAll("pre code");
  for (var i = 0, l = codes.length; i < l; i++) {
    var code = codes[i];
    var mode = code.getAttribute("class");
    if (mode) {
      mode = mode.match("^language-(.*)$");
      if (mode) {
        mode = map[mode[1]];
      }
    }
    if (!mode) { mode = "text/plain"; }
    var pre = code.parentElement;
    window.CodeMirror.runMode(code.textContent, mode, pre);
    pre.setAttribute("class", "cm-s-luvit");
  }

});
