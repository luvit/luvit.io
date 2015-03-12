local pathJoin = require('luvi').path.join

require('weblit-app')

  .bind({host = "0.0.0.0", port = 8080})

  .use(require('weblit-logger'))

  .use(require('weblit-auto-headers'))

  .use(require('weblit-etag-cache'))

  -- Serve dynamic content and static assets for front page
  .route({ method = "GET", path = "/" }, require('controllers/index'))
  .use(require('weblit-static')(pathJoin(module.dir, "static")))

  -- Serve dynamic content and static assets for article pages
  .route({ method = "GET", path = "/:name" }, require('controllers/article'))
  .route({ method = "GET", path = "/:name/" }, require('controllers/article'))
  .use(require('weblit-static')(pathJoin(module.dir, "articles")))



  .start()
