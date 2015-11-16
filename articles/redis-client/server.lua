local jsonStringify = require('json').stringify
local send
local names = {}

local function handleSocket(req, read, write)
  if not send then
    send = require('redis-client')()
  end
  p(req)
  for message in read do
    if message.opcode == 1 then
      p(message.payload)
      local list = {}
      for part in message.payload:gmatch("%w+") do
        list[#list + 1] = part
      end
      local res = send(unpack(list))
      p(list, res)
      for i = 1, #res, 2 do
        local key = res[i]
        local name = names[key]
        if not name then
          name = send("GET", key)
          names[key] = name
        end
        res[i] = name
        res[i + 1] = tonumber(res[i + 1])
      end
      write {
        opcode = 1,
        payload = jsonStringify(res)
      }
    end
  end
  send()
end

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
