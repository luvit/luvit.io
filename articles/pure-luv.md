{ title = "Pure Luv",
  subtitle = "Using Luvit without Luvit",
  author = {
    name = "Tim Caswell",
    email = "tim@creationix.com",
    twitter = "creationix",
    github = "creationix"
  },
  tags = { "lua", "luajit", "luarocks", "luv" },
  published = 1460656378
}

I started the Luvit project years ago as a reimplementation of [node.js][] for
[LuaJit][]. The project has had great success within [Rackspace][] where it's
used for the monitoring agent using the [virgo][] platform.

Luvit is a single binary that contains the lua vm, [libuv][], [openssl][],
[miniz][] as well as a host of [standard libraries][] implemented in lua that
closely resemble the public node.js APIs.  You give it a lua script to run and
it runs it in the context of this system.

## Luvit was so Nodey

The APIs follow the node style so closely that you can almost just translate the
syntax of most sample node.js programs from JS to Lua and they will run in
luvit.  

Compare the following programs:

```js
// node server.js
var http = require('http');

http.createServer(function (req, res) {
  var body = 'Hello world\n';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
```

```lua
-- luvit server.lua
local http = require('http')

http.createServer(function (req, res)
  local body = 'Hello world\n'
  res:setHeader('Content-Type', 'text/plain')
  res:setHeader("Content-Length", #body)
  res:finish(body)
end):listen(1337, '127.0.0.1')

print('Server running at http://127.0.0.1:1337/')
```

But over the years I've slowly realized this isn't ideal for a large portion of
the existing Lua community.

## Everyone Should Have Luv

For the last 5 months or so, I've been working on making the set of libraries
and primitives used by luvit available outside of luvit.

The inline-metadata format of lit was changed to embed in a lua comment instead
of assume a global `exports` table.  In fact, the whole [CJS][] style
`module.exports` system is no longer used by the core libraries.  Instead they
simply return their exports.

This means that luvit libraries can be loaded by lua's native `require` function
and not need any special globals injected into their namespace.

Also, work has been done to ensure that every release of the [luv][] bindings
are published to [luarocks][].

I'm still trying to figure out how to get the [openssl bindings][] we use to
work well in luarocks based workflows.  We may simply migrate to [luaossl][].

The good news is that many webservers don't actually need openssl bindings as
they are often deployed behind proxy servers that can do the TLS termination for
them.

## Mixing Module Ecosystems

For a quick simple example, let's use stock Lua 5.2 on Linux to create a
webserver complete with websockets and static file asset loading.

We'll pull in the `luv` and `bit` libraries from luarocks.

```sh
luarocks install luv        # You'll need cmake for this to compile
luarocks install luabitop   # Not needed if you're using LuaJit
```

And pull in `weblit`, `pretty-print`, and `uv` from lit's ecosystem.

```sh
mkdir myapp
cd myapp
lit install creationix/weblit creationix/uv luvit/pretty-print
```

If all goes well, you will now have `luv` and `bit` built and installed to
somewhere in lua's `package.cpath`. This is a system-wide install and is the
default workflow for luarocks based applications.  Lit will have created a new
`./deps` folder in your application and install the requested libraries as well
as their dependencies recursively.

Lua's require function doesn't know how to find the lit packages, but we can
teach it with a new require loader.  

```sh
curl -LO https://raw.githubusercontent.com/luvit/lit/master/luvit-loader.lua
```

I will sometime publish this to luarocks to ease this bootstrapping step.

Using this file, we should be able to require packages from either ecosystem
using native require.  Create the following test file and run it with lua to
verify you get the same table for both expressions.

```lua
-- test.lua
dofile 'luvit-loader.lua'
print(require('luv')) -- Require luv directly using package.cpath
print(require('uv')) -- Require luv indirectly using deps/uv.lua shim
```

```sh
$ lua test.lua
table: 0x7f9040c1e560
table: 0x7f9040c1e560
```

In luarocks, luv is required as `luv`, but in luvit and lit, it's `uv`.  The
`deps/uv.lua` shim is literally nothing more than `return require 'luv'` that
redirects any requires to the luarocks version.

## Using Weblit for Fun and Profit

[Weblit][] is a pretty fun little framework for creating coroutine-based
webservers.

Let's create a simple app using its declarative configuration syntax.

```lua
-- server.lua
dofile 'luvit-loader.lua' -- Enable require to find lit packages
local p = require('pretty-print').prettyPrint -- Simulate luvit's global p()

-- This returns a table that is the app instance.
-- All it's functions return the same table for chaining calls.
require('weblit-app')

  -- Bind to localhost on port 3000 and listen for connections.
  .bind({
    host = "0.0.0.0",
    port = 3000
  })

  -- Include a few useful middlewares.  Weblit uses a layered approach.
  .use(require('weblit-logger'))
  .use(require('weblit-auto-headers'))
  .use(require('weblit-etag-cache'))

  -- This is a custom route handler
  .route({
    method = "GET", -- Filter on HTTP verb
    path = "/greet/:name", -- Filter on url patterns and capture some parameters.
  }, function (req, res)
    p(req) -- Log the entire request table for debugging fun
    res.body = "Hello " .. req.params.name .. "\n"
    res.code = 200
  end)

  -- Actually start the server
  .start()

-- We also need to explicitly start the libuv event loop.
require('luv').run()
```

If we run this with `lua server.lua` and point our browser to
<http://localhost:3000/greet/Bob>, we should be greeted with a nice little hello
message in the browser.

There is so much more to explore in what weblit can do, but that will be saved
for another day.  The important thing to note here is we're using plain vanilla
`lua` to consume unmodified lit packages from the luvit ecosystem mixed with
packages installed from luarocks.

## Remember Your Deps

If you make an application this way, it's recommended you either commit your
deps folder along with your app in your version control or create a
`package.lua` file containing a `dependencies` section so that a simple `lit
install` can later install the needed deps from lit.

```lua
-- package.lua
return {
  name = "luvit/pure-luv-demo",
  version = "0.0.0",
  dependencies = {
    "creationix/weblit", -- Web Framework awesomeness.
    "creationix/uv", -- Used to make weblit run with luarocks luv
    "luvit/pretty-print" -- Used for p() function
  }
}
```

Let me know what you think about this approach. I find that between luvi apps
(single binaries) and normal lua or luajit apps, I have very little need for the
actual `luvit` binary for anything other than playing with its awesome repl and
pretty-printer.  The node.js style APIs are great for people migrating existing
systems from node, but when in Lua, I much prefer coroutines to callbacks.

[node.js]: https://nodejs.org/
[LuaJit]: http://luajit.org/
[Rackspace]: https://www.rackspace.com/
[virgo]: https://github.com/virgo-agent-toolkit/
[libuv]: http://libuv.org/
[openssl]: https://www.openssl.org/
[miniz]: https://github.com/luvit/luvi/blob/master/deps/miniz.c
[standard libraries]: https://github.com/luvit/luvit/tree/master/deps
[CJS]: https://nodejs.org/docs/latest/api/modules.html#modules_modules
[luv]: https://github.com/luvit/luv
[luarocks]: https://luarocks.org/modules/creationix/luv
[openssl bindings]: https://github.com/zhaozg/lua-openssl
[luaossl]: https://luarocks.org/modules/daurnimator/luaossl
[Weblit]: https://github.com/creationix/weblit
