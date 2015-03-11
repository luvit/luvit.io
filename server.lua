local pathJoin = require('luvi').path.join

require('weblit-app')

  .bind({host = "0.0.0.0", port = 8080})

  .use(require('weblit-logger'))

  .use(require('weblit-auto-headers'))

  .use(require('weblit-etag-cache'))

  .use(require('weblit-static')(pathJoin(module.dir, "static")))

  .start()
