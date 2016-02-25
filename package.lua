return {
  name = "luvit/blog.luvit.io",
  version = "0.0.2",
  private = true,
  dependencies = {
    -- hoedown ffi bindings for fast markdown compiling
    "creationix/hoedown@1.1.2",
    -- Web server framework
    "creationix/weblit-app@2.1.0",
    -- Core plugin for proper http headers
    "creationix/weblit-auto-headers@2.0.1",
    -- Serve static files from disk
    "creationix/weblit-static@2.0.0",
    -- In-memory caching of http responses
    "creationix/weblit-etag-cache@2.0.0",
    -- Basic logger to stdout
    "creationix/weblit-logger@2.0.0",
  }
}
