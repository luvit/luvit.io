local pathJoin = require('luvi').path.join
local static = require('weblit-static')
local blog = require('controllers/blog')
local env = require('env')
local jsonStringify = require('json').stringify
local uv = require('uv')

require('weblit-app')

  .bind({host = "0.0.0.0", port = env.get("PORT") or 8080})

  -- Configure weblit server
  .use(require('weblit-logger'))
  .use(require('weblit-auto-headers'))
  .use(require('weblit-etag-cache'))

  -- Serve non-blog content pages
  .route({ method = "GET", path = "/" }, require('controllers/page'))
  .route({ method = "GET", path = "/:name.html" }, require('controllers/page'))

  -- Serve blog articles
  .route({ method = "GET", path = "/blog/"}, blog.index)
  .route({ method = "GET", path = "/blog/tags/:tag"}, blog.tags)
  .route({ method = "GET", path = "/blog/:name.html" }, blog.article)

  .route({ method = "GET", path = "/blog/:path:"}, static(pathJoin(module.dir, "articles")))
  .use(static(pathJoin(module.dir, "static")))

  .route({ method = "GET", path = "/handles"}, function (req, res)
    local handles = {}
    uv.walk(function (handle)
      local name = tostring(handle)
      if name:match("^uv_tcp_t:") then
        local peer = handle:getpeername()
        local sock = handle:getsockname()

        name = {name,sock,peer}
      end
      handles[#handles + 1] = name
    end)
    res.code = 200
    res.headers["Content-Type"] = "application/json"
    res.body = jsonStringify(handles)
  end)
  .start()

