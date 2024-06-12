return {
  name = "luvit/blog.luvit.io",
  version = "0.0.3",
  private = true,
  dependencies = {
    -- hoedown ffi bindings for fast markdown compiling
    "creationix/hoedown@1.1.5",
    -- Web server framework
    "creationix/weblit-app@3.2.1",
    -- Core plugin for proper http headers
    "creationix/weblit-auto-headers@2.1.0",
    -- Serve static files from disk
    "creationix/weblit-static@2.2.2",
    -- Basic logger to stdout
    "creationix/weblit-logger@2.0.0",
  }
}
