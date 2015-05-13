return {
  name = "luvit/blog.luvit.io",
  version = "0.0.1",
  private = true,
  dependencies = {
    -- hoedown ffi bindings for fast markdown compiling
    "creationix/hoedown@1.1.0",
    -- Web server framework
    "creationix/weblit-app@0.2.6",
    -- Core plugin for proper http headers
    "creationix/weblit-auto-headers@0.1.2",
    -- Serve static files from disk
    "creationix/weblit-static@0.2.4",
    -- In-memory caching of http responses
    "creationix/weblit-etag-cache@0.1.1",
    -- Basic logger to stdout
    "creationix/weblit-logger@0.1.1",
  }
}
