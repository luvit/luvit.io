local pathJoin = require('luvi').path.join
local fs = require('coro-fs').chroot(pathJoin(module.dir, "../../articles"))
local loadArticle = require('./article')

return function ()
  local articles = {}
  for entry in fs.scandir("") do
    local name = entry.type == "file" and entry.name:match("^(.*)%.md$")
    if name then
      articles[#articles + 1] = loadArticle(name)
    end
  end
  return articles
end
