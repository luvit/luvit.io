local redisConnect = require('redis-client')

local websocketConnect = require('websocket-client')
local jsonParse = require('json').parse

coroutine.wrap(function ()
  -- Connect to redis
  local send = redisConnect { host = "localhost", port = 6379 }

  local read, write = websocketConnect "ws://stream.meetup.com/2/rsvps"

  for message in read do
    if message.opcode == 1 then
      local topics = jsonParse(message.payload).group.group_topics
      for i = 1, #topics do
        local topic = topics[i]
        p(topic)
        if send("exists", topic.urlkey) == 0 then
          send("set", topic.urlkey, topic.topic_name)
        end
        send("zincrby", "frequency", 1, topic.urlkey)
      end
    end
  end
  write()

  -- -- Send some commands
  -- p(send("set", "name", "Tim"))
  -- p(send("get", "name"))
  -- local name = send("get", "name")
  -- assert(name == "Tim")
  --
  -- -- Close the connection
  -- send()
end)()
