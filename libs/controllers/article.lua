local render = require('render-template')
local loadArticle = require('models/article')

return function (req, res, go)
  local article, err = loadArticle(req.params.name)
  assert(not err, err)
  if not article then return go() end
  if req.path:sub(-1) ~= "/" then
    res.code = 302
    res.headers.Location = req.path:sub(1, -2)
    return
  end
  res.body = render("article", article)
  res.code = 200
  res.headers["Content-Type"] = "text/html"
end
