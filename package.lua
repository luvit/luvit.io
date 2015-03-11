return {
  name = "luvit/blog.luvit.io",
  version = "0.0.1",
  private = true,
  dependencies = {
    -- hoedown ffi bindings for fast markdown compiling
    "creationix/hoedown@1.0.1",
    -- simple mime database for serving static files
    "creationix/mime@0.1.0",
    -- Web server framework
    "creationix/weblit-app@0.1.0",
    -- Core plugin for proper http headers
    "creationix/weblit-auto-headers@0.1.0",
    -- In-memory caching of http responses
    "creationix/weblit-etag-cache@0.1.0",
    -- Basic logger to stdout
    "creationix/weblit-logger@0.1.0",
  }
}
