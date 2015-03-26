{ title = "libcurl Integration into Luvit",
  subtitle = "integrating loops",
  author = {
    name = "Ryan Phillips",
    email = "ryan@trolocsis.com",
    twitter = "rphillips",
    github = "rphillips"
  },
  tags = { "tutorial", "libuv" },
  published = nil
}

In Tim's previous blog post titled [Hardware Control][] he introduced 
[LuaJit's FFI][]. FFI is short for 'Foreign Function Interface.' In Luvit's context
the FFI allows Lua to load and run code from shared libraries without writing C
bindings. In most cases, the FFI layer is faster at calling the function than
the standard C Lua API.

To show off more on how Luvit and the FFI can work together, I have taken
libcurl and bound the libcurl event loop to Luvit's libuv event loop. The advantage 
is that both libraries work in harmony with each other.

*libcurl just celebrated it's 17 year birthday - Happy Birthday!*

## libuv

libcurl handles the socket management for us and exposes a smart API to expose
the file descriptor(s) needed to add them to the libuv event loop.

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

## libcurl

```lua
local ffi = require('ffi')
local libcurl = ffi.load('libcurl')
ffi.cdef[[
  enum CURLMSG {
    CURLMSG_NONE,
    CURLMSG_DONE,
    CURLMSG_LAST
  };

  struct CURLMsg {
    enum CURLMSG msg;
    void *easy_handle;
    union {
      void *whatever;
      int result;
    } data;
  };

  enum curl_global_option
  {
    CURL_GLOBAL_ALL = 2,
  };

  enum curl_multi_option
  {
    CURLMOPT_SOCKETFUNCTION = 20000 + 1,
    CURLMOPT_TIMERFUNCTION = 20000 + 4
  };

  enum curl_socket_option
  {
    CURL_SOCKET_TIMEOUT = -1
  };

  enum curl_poll_option
  {
    CURL_POLL_IN = 1,
    CURL_POLL_OUT = 2,
    CURL_POLL_REMOVE = 4
  };

  enum curl_option
  {
    CURLOPT_CAINFO    = 10065,
    CURLOPT_CONNECTTIMEOUT  = 78,
    CURLOPT_COOKIE    = 10022,
    CURLOPT_FOLLOWLOCATION  = 52,
    CURLOPT_HEADER    = 42,
    CURLOPT_HTTPHEADER  = 10023,
    CURLOPT_INTERFACE   = 10062,
    CURLOPT_POST    = 47,
    CURLOPT_POSTFIELDS  = 10015,
    CURLOPT_REFERER   = 10016,
    CURLOPT_SSL_VERIFYPEER  = 64,
    CURLOPT_URL   = 10002,
    CURLOPT_USERAGENT   = 10018,
    CURLOPT_WRITEFUNCTION = 20011
  };

  enum curl_cselect_option
  {
    CURL_CSELECT_IN = 0x01,
    CURL_CSELECT_OUT = 0x02
  };

  void *curl_easy_init();
  int   curl_easy_setopt(void *curl, enum curl_option option, ...);
  int   curl_easy_perform(void *curl);
  void  curl_easy_cleanup(void *curl);
  char *curl_easy_strerror(int code);

  int   curl_global_init(enum curl_global_option option);

  void *curl_multi_init();
  int   curl_multi_setopt(void *curlm, enum curl_multi_option option, ...);
  int   curl_multi_add_handle(void *curlm, void *curl_handle);
  int   curl_multi_socket_action(void *curlm, int s, int ev_bitmask, int *running_handles);
  int   curl_multi_assign(void *curlm, int sockfd, void *sockp);
  int   curl_multi_remove_handle(void *curlm, void *curl_handle);
  struct CURLMsg *curl_multi_info_read(void *culm, int *msgs_in_queue);

  typedef int (*curlm_socketfunction_ptr_t)(void *curlm, int sockfd, int ev_bitmask, int *running_handles);
  typedef int (*curlm_timeoutfunction_ptr_t)(void *curlm, long timeout_ms, int *userp);
  typedef size_t (*curl_datafunction_ptr_t)(char *ptr, size_t size, size_t nmemb, void *userdata);
]]
```
[libcurl]: http://curl.haxx.se/libcurl/
[LuaJit's FFI]: http://luajit.org/ext_ffi.html
[Hardware Control]: https://luvit.io/blog/hardware-control.html
[External I/O]: http://nikhilm.github.io/uvbook/utilities.html#external-i-o-with-polling
