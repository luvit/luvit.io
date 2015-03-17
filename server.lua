local pathJoin = require('luvi').path.join
local static = require('weblit-static')

require('weblit-app')

  .bind({host = "0.0.0.0", port = 8080})

  -- Configure weblit server
  .use(require('weblit-logger'))
  .use(require('weblit-auto-headers'))
  .use(require('weblit-etag-cache'))

  -- Serve non-blog content pages
  .route({ method = "GET", path = "/" }, require('controllers/page'))
  .route({ method = "GET", path = "/:name.html" }, require('controllers/page'))

  -- Serve blog articles
  .route({ method = "GET", path = "/blog/index.html" }, require('controllers/articles'))
  .route({ method = "GET", path = "/blog/:name.html" }, require('controllers/article'))

  .route({ method = "GET", path = "/blog/:path:"}, static(pathJoin(module.dir, "articles")))
  .use(static(pathJoin(module.dir, "static")))

  .start()
