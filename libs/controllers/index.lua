local render = require('render-template')

return function (req, res, go)
  local articles = {
    {
      title = "My first entry",
      content = "this is a paragraph"
    }
  }
  res.body = render("index", {title="Index", articles=articles})
  res.code = 200
  res.headers["Content-Type"] = "text/html"
end
