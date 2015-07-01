{ title = "libcurl Integration into Luvit",
  subtitle = "integrating loops",
  author = {
    name = "Ryan Phillips",
    email = "ryan@trolocsis.com",
    twitter = "rphillips",
    github = "rphillips"
  },
  tags = { "tutorial", "libuv" },
  published = 1435769029
}

In Tim's previous blog post titled [Hardware Control][] he introduced 
[LuaJit's FFI][]. FFI is short for 'Foreign Function Interface.' In Luvit's context
the FFI allows Lua to load and run code from shared libraries without writing C
bindings. In most cases, the FFI layer is faster at calling the function than
the standard C Lua API.

To show off more on how Luvit and the FFI can work together, I have taken
libcurl and bound the libcurl event loop to Luvit's libuv event loop. The advantage 
is that both libraries work in harmony with each other.

<center>![libuv](uv-poll-libcurl/uv.jpg)</center>

## libuv

libcurl handles the socket management for us and exposes a smart API to expose
the file descriptor needed to add them to the libuv event loop.

libuv contains a `uv_poll_t` data structure that watches a file descriptor for
read and write events ([External I/O][]). 

We are going to use the following functions from the LUV API:

```lua
local function perform(err, events) end
local poll = uv.new_poll(sockfd)
uv.poll_start(poll, 'r', perform)
uv.poll_start(poll, 'w', perform)
uv.poll_stop(poll)
uv.close(poll)
```

<center>![libcurl](uv-poll-libcurl/curl-refined.jpg)</center>

## The binding

The latest version of the example is located within Luvit repository [poll-libcurl.lua][].

To start out the binding we:

  1. Create a libcurl multi handle
  2. hook libcurl's socket and timer callback within the constructor `initialize` of the `Multi`
class.

```lua
self.socketWrapper = ffi.cast('curlm_socketfunction_ptr_t', utils.bind(Multi._onSocket, self))
self.timeoutWrapper = ffi.cast('curlm_timeoutfunction_ptr_t', utils.bind(Multi._onTimeout, self))
self.multi = libcurl.curl_multi_init()
libcurl.curl_multi_setopt(self.multi, ffi.C.CURLMOPT_SOCKETFUNCTION, self.socketWrapper)
libcurl.curl_multi_setopt(self.multi, ffi.C.CURLMOPT_TIMERFUNCTION, self.timeoutWrapper)
```

When libcurl wants the event loop to trigger an action, it will call the `_onSocket` callback. This callback 
receives three parameters:

  1. the easy handle
  2. the socket file descriptor
  3. the action (in, out, or remove).

Depending on the type of the action, we will read, write, or remove the event.

```lua
if action == ffi.C.CURL_POLL_IN then
  uv.poll_start(poll, 'r', perform)
elseif action == ffi.C.CURL_POLL_OUT then
  uv.poll_start(poll, 'w', perform)
elseif action == ffi.C.CURL_POLL_REMOVE then
  uv.poll_stop(poll)
  uv.close(poll)
  self.polls[sockfd] = nil -- remove from map
end
```

## Dig it

Luajit's FFI interface is extremely powerful and easy to use. Many [Luajit
Bindings][] have been created and are in use today. Remember to keep in mind
that some bindings may use blocking APIs and block the libuv event loop.

[Luajit Bindings]: http://wiki.luajit.org/FFI-Bindings
[poll-libcurl.lua]: https://github.com/luvit/luvit/blob/master/examples/poll-libcurl.lua
[libcurl]: http://curl.haxx.se/libcurl/
[LuaJit's FFI]: http://luajit.org/ext_ffi.html
[Hardware Control]: https://luvit.io/blog/hardware-control.html
[External I/O]: http://nikhilm.github.io/uvbook/utilities.html#external-i-o-with-polling
