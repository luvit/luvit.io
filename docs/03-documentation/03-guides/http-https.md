---
sidebar_position: 2
slug: /docs/tutorials/http-https
---

# Using the HTTP(S) APIs

In this tutorial, you'll learn how you can create HTTP(S) servers using the callback-based Luvit HTTP API. It also covers using the Coroutine-based HTTP APIs for a different approach. Finally, making HTTP Requests is another common use case that will be explained. After you've mastered all this, we'll use a Lit package to create a HTTP-based REST API that will take care of everything for you.

Please note that the goal of this tutorial isn't to explain all the details; it is to get you started building an app. If you want to learn more about the topics covered, we've included some resources for you to follow, but as always you can (and should) do your own research.

## Prerequisites

In order to follow along, you might want to read up on (the basics of) the following concepts first:

* The [Hypertext Transfer Protocol (HTTP)](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) is what we'll be using here to communicate with a server
* [Transport Layer Security](https://en.wikipedia.org/wiki/Transport_Layer_Security) is a security mechanism used to implement encryption on top of HTTP (this is called [HTTPS](https://en.wikipedia.org/wiki/HTTPS))
* [Restful State Transfer (REST)](https://en.wikipedia.org/wiki/Representational_state_transfer) is an architectural style we'll be using briefly at the end to demonstrate a realistic use case

Don't worry if you aren't very familiar with these topics; Luvit handles most difficulties for you and you can always learn details later.

## Using the Node-Style APIs

The `luvit` CLI tool can be used as a scripting platform just like `node`.  This
can be used to run lua scripts as standalone servers, clients, or other tools.

This simple web server written in Luvit responds with "Hello World" for every
request.

```lua
local http = require('http')

http.createServer(function (req, res)
  local body = "Hello world\n"
  res:setHeader("Content-Type", "text/plain")
  res:setHeader("Content-Length", #body)
  res:finish(body)
end):listen(1337, '127.0.0.1')

print('Server running at http://127.0.0.1:1337/')
```

And run this script using `luvit`.

```sh
> luvit server.lua
Server running at http://127.0.0.1:1337/
```

This script is a standalone HTTP server, there is no need for Apache or Nginx to
act as host.

## Creating HTTPS Servers

TODO: Demonstrate using TLS on top of the above

## Using the Coroutine-based APIs

TODO: Demonstrate using coro-http, coro-https


## HTTP Clients (Requests)

TODO: Demonstrate making GET, POST, UPDATE etc. requests via the HTTP API

## Making HTTPS Requests

TODO: Demonstrate using TLS on top of the above

## REST API (WebLit)

Luvit also has a package system that makes it easy to publish and consume
libraries.

For example, [creationix][] has made a set of libraries that use coroutines
instead of callbacks for async I/O and published these to lit.

Using `lit` install `creationix/weblit` to use an express-like framework built
on top of coroutines.

```sh
> mkdir myapp && cd myapp
> lit install creationix/weblit
> vim server.lua
> luvit server.lua
```

The `server.lua` file will contain:

```lua
local weblit = require('weblit')

weblit.app
  .bind({host = "127.0.0.1", port = 1337})

  -- Configure weblit server
  .use(weblit.logger)
  .use(weblit.autoHeaders)

  -- A custom route that sends back method and part of url.
  .route({ path = "/:name"}, function (req, res)
    res.body = req.method .. " - " .. req.params.name .. "\n"
    res.code = 200
    res.headers["Content-Type"] = "text/plain"
  end)

  -- Start the server
  .start()
```

## Further Reading

TODO: Performance, Security, Scalability, WebSockets, ... ?


## Feedback

Was this tutorial helpful? Is something wrong or not very understandable? Please let us know so we can improve it!