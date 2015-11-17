{ title = "Using Redis in Luvit",
  subtitle = "",
  author = {
    name = "Tim Caswell",
    email = "tim@creationix.com",
    twitter = "creationix",
    github = "creationix"
  },
  tags = { "redis", "websocket", "data" },
}

Have you ever wanted to use Redis with Luvit?  Now you can with the new
[`creationix/redis-client`](https://luvit.io/lit.html#author:creationix%20redis-client) package in lit!

One luvit program will consume a public [websocket based API][] to get live
RSVPs for meetup.com and write some data to redis.

Another luvit program will serve a webpage with a live leaderboard of most
popular group topics (also via websockets) to the browser.

![Sample Output](redis-client/sample.png)

## Processing the Event stream

Luvit is really good at speaking various TCP based network protocols. We've been
especially happy with the WebSocket protocol that's used by lit itself.

Naturally, connecting to a WebSocket based event stream is a piece of cake.

```lua
local redisConnect = require('redis-client')
local websocketConnect = require('websocket-client')

local function process()
  -- Connect to redis
  local send = redisConnect { host = "localhost", port = 6379 }
  -- Connect to event stream
  local read, write = websocketConnect "ws://stream.meetup.com/2/rsvps"

  -- TODO: process stream
end
```

 - `send(query) -> response` - Send Redis a command and get back the response.
 - `read() -> message` - Read a WebSocket message.
 - `write(message)` - Write a WebSocket message.

With `send`, `read`, and `write` we have a simple API for reading from the
WebSocket stream and writing commands to Redis.

Let's make a simple loop to extract out the topics and increment a sorted set
in Redis to count the frequency of the topics.

```lua
local jsonParse = require('json').parse

for message in read do
  if message.opcode == 1 then
    local topics = jsonParse(message.payload).group.group_topics
    for i = 1, #topics do
      local topic = topics[i]
      if send("exists", topic.urlkey) == 0 then
        -- Store the full name by key if it's not there yet.
        send("set", topic.urlkey, topic.topic_name)
      end
      -- Increment the entry in the sorted set.
      send("zincrby", "frequency", 1, topic.urlkey)
    end
  end
end
write()
```

The full script can be found at [process.lua][].

To put some data in our Redis we only need to run this with Luvit.  Leave it
running so we can see rankings change in real-time.

```sh
lit install creationix/redis-client creationix/websocket-client
luvit process.lua
```

## Making the Web Server

Luvit is also pretty good at creating web applications.  We'll be using the
WebLit framework again for http static file serving and WebSocket handling.

```lua
require('weblit-websocket')
require('weblit-app')

.bind({
  host = "0.0.0.0",
  port = 3000
})

.use(require('weblit-logger'))
.use(require('weblit-auto-headers'))
.use(require('weblit-etag-cache'))

.websocket({
  path = "/",
  protocol = "resp",
}, handleSocket)

.use(require('weblit-static')(module.dir .. "/www"))

.start()
```

This creates a server at <http://localhost:3000/> that serves up our client-side
JavaScript app.  We now need to write the `handleSocket` function that will
proxy data between the WebSocket client in the browser and the Redis server that
Luvit has access to.

```lua
local send
local names = {}
local function handleSocket(req, read, write)
  if not send then
    -- Connect to redis on first websocket client.
    send = require('redis-client')()
  end
  -- Read commands from the browser
  for message in read do
    if message.opcode == 1 then
      -- On text frames, split the command into a lua list.
      p(message.payload)
      local list = {}
      for part in message.payload:gmatch("%w+") do
        list[#list + 1] = part
      end

      -- And send the query to redis.
      local res = send(unpack(list))
      p(list, res)

      -- Then process the result a little
      for i = 1, #res, 2 do
        local key = res[i]
        local name = names[key]
        if not name then
          -- Replace short names with full names, lazy load from redis.
          name = send("GET", key)
          names[key] = name
        end
        res[i] = name
        -- Pre-parse the frequency to a number
        res[i + 1] = tonumber(res[i + 1])
      end

      -- Send the result as JSON to the browser
      write {
        opcode = 1,
        payload = jsonStringify(res)
      }
    end
  end

  -- Close the redis connection when the browser closes
  send()
end
```

The full script can be found at [server.lua][].

Run the server so our browser can talk to it.

```sh
lit install creationix/weblit
luvit server.lua
```

Open your browser to <http://localhost:3000/>.  If all goes well, you should
soon see colorful topics appear.


## The Browser Client

I won't show all the HTML, CSS and JavaScript that make up the client, full
source can be found at [www][], but the important part is how the client
connects to the WebSocket endpoint.

```js
window.onload = function () {
  var url = (""+window.location.origin).replace(/^http/, "ws");
  var connection = new WebSocket(url, ['resp']);

  connection.onopen = function (evt) {
    console.log("Connected to " + url);
    setInterval(update, 500);
    update();
  };

  function update() {
    connection.send("ZREVRANGEBYSCORE frequency inf 5 WITHSCORES LIMIT 0 200");
  }

  connection.onerror = function (evt) {
    console.error("Problem connecting to " + url);
  };

  connection.onmessage = function (evt) {
    var list = JSON.parse(evt.data);
    // TODO: update display with list.
  };
};
```

As you can see, the browser only needs to send a string query like
`ZREVRANGEBYSCORE frequency inf 5 WITHSCORES LIMIT 0 200` and will get back a
response in JSON form for easy consumption.

I hope this opens up doors to new possibilities for using Luvit and Redis
together.  Let me know what you think.

[websocket based API]: http://www.meetup.com/meetup_api/docs/stream/2/rsvps/#websockets
[www]: https://github.com/luvit/luvit.io/tree/master/articles/redis-client/www
[server.lua]: https://github.com/luvit/luvit.io/blob/master/articles/redis-client/server.lua
[process.lua]: https://github.com/luvit/luvit.io/blob/master/articles/redis-client/process.lua
