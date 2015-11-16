local redisConnect = require('redis-client')
local websocketConnect = require('websocket-client')
local jsonParse = require('json').parse

local function process()
  -- Connect to redis
  local send = redisConnect { host = "localhost", port = 6379 }
  -- Connect to event stream
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

end

coroutine.wrap(process)()
