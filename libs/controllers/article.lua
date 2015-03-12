local render = require('render-template')
local loadArticle = require('models/article')

return function (req, res, go)
  local article, err = loadArticle(req.params.name)
  assert(not err, err)
  if not article then return go() end
  local pathname, query = req.path:match("^([^#?]*)(.*)$")
  if pathname:sub(-1) ~= "/" then
    res.code = 302
    res.headers.Location = pathname .. '/' .. query
    return
  end
  res.body = render("article", {
    title = article.title,
    article = article
  })
  res.code = 200
  res.headers["Content-Type"] = "text/html"
end
