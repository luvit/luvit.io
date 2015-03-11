return {
  name = "luvit/blog.luvit.io",
  version = "0.0.1",
  private = true,
  dependencies = {
    -- hoedown ffi bindings for fast markdown compiling
    "creationix/hoedown@1.0.1",
    -- Web server framework
    "creationix/weblit-app@0.1.0",
    -- Core plugin for proper http headers
    "creationix/weblit-auto-headers@0.1.0",
    -- Serve static files from disk
    "creationix/weblit-static@0.2.0",
    -- In-memory caching of http responses
    "creationix/weblit-etag-cache@0.1.0",
    -- Basic logger to stdout
    "creationix/weblit-logger@0.1.0",
  }
}
