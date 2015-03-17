local renderTemplate = require('render-template')
local loadContent = require('load-content')

return function (req, res, go)
  local data = loadContent("pages", req.params.name)
  if not data then return go() end
  return renderTemplate(res, "page", data);
end
