local renderTemplate = require('render-template')
local loadContent = require('load-content')

return function (req, res, go)
  local article = loadContent("articles", req.params.name)
  if not article then return go() end
  return renderTemplate(res, "article", {
    title = article.title .. " - Luvit.io Blog",
    article = article
  })
end
