local render = require('render-template')
local loadIndex = require('models/index')

return function (req, res, go)
  local articles = loadIndex()
  res.body = render("index", {title="Index", articles=articles})
  res.code = 200
  res.headers["Content-Type"] = "text/html"
end
