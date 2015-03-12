local pathJoin = require('luvi').path.join
local fs = require('coro-fs').chroot(pathJoin(module.dir, "../../articles"))

return function (name)
  local meta, markdown, err
  markdown, err = fs.readFile(name .. ".md")
  if not markdown then return nil, err end
  meta, markdown = markdown:match("^(%b{})%s*(.*)$")
  local fn = assert(loadstring("return " .. meta, "article:" .. name))
  setfenv(fn, {})
  local article = fn()
  article.content = markdown
  article.name = name
  return article
end
