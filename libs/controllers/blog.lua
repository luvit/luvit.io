local renderTemplate = require('render-template')
local pathJoin = require('luvi').path.join
local fs = require('coro-fs').chroot(pathJoin(module.dir, "../.."))
local loadContent = require('load-content')

local function loadArticles()
  local articles = {}
  for entry in fs.scandir("articles") do
    if entry.type == "file" and entry.name:match("%.md$") then
      local name = entry.name:match("^(.*)%.md$")
      local data = loadContent("articles", name)
      if data.published then
        articles[#articles + 1] = data
        articles[name] = data
      end
    end
  end
  table.sort(articles, function (a, b)
    return a.published > b.published
  end)
  for i = 1, #articles do
    local article = articles[i]
    if i > 1 then
      article.after = articles[i - 1]
    end
    if i < #articles then
      article.before = articles[i + 1]
    end
  end
  return articles
end

function exports.index(req, res, go)
  local articles = loadArticles()
  if #articles == 0 then
    return renderTemplate(res, "empty", {
      title = "Blog - Luvit.io",
    })
  end

  -- Redirect to the newest published article
  res.code = 302
  res.headers.Location = "/blog/" .. articles[1].name .. ".html"
  res.body = nil
end

function exports.tags(req, res, go)
  console.log("TODO: Implement tags")
  return go()
end

function exports.article(req, res, go)
  local name = req.params.name
  local articles = loadArticles()
  local article = articles[name] or loadContent("articles", name)
  if not article then return go() end
  return renderTemplate(res, "article", {
    title = article.title .. " - Blog - Luvit.io",
    article = article
  })
end
