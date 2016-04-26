local jsonStringify = require('json').stringify
local snapshot = require('snapshot')
local i = 0
local S1 = snapshot()
local potential = {}

return function (_, res)
  collectgarbage()
  collectgarbage()
  local memoryUsed = 1024 * collectgarbage("count")
  local S2 = snapshot()
  -- Find new heap objects since last snapshot
  local c = 0
  local details = {}
  for k, v in pairs(potential) do
    if S2[k] then
      c = c + 1
      details[c] = {tostring(k), v}
    end
  end
  potential = {}
  for k,v in pairs(S2) do
    if S1[k] == nil then
      potential[k] = v
    end
  end
  S1 = S2
  i = i + 1
  res.code = 200
  res.headers["Content-Type"] = "application/json"
  res.body = jsonStringify{
    id = i,
    potential_count = c,
    potential = details,
    lua_heap = memoryUsed,
  }

end
