local pathJoin = require('luvi').path.join
local templateDir = pathJoin(module.dir, "../templates")
local fs = require('coro-fs').chroot(templateDir)
local uv = require('uv')
local renderMarkdown = require('markdown')

local cache = {}

-- When a file changes, invalidate it's cached value so it will be recompiled
-- the next time it's requested.
uv.new_fs_event():start(templateDir, {}, function (err, filename)
  assert(not err, err)
  local base = filename:match("^(.*).html$")
  if not base then return end
  cache[base] = nil
end)

local function stringify(data)
  if data:match("^[\32-\126\n]*$") then
    return "'" .. data:gsub("\n", "\\n"):gsub("'", "\\'") .. "'"
  end
  local open = "[["
  local close = "]]"
  local a = 0
  while data:find(open, 1, true) or data:find(close, 1, true) do
    a = a + 1
    open = "[" .. string.rep("=", a) .. "["
    close = "]" .. string.rep("=", a) .. "]"
  end
  return open .. "\n" .. data .. close
end


local function compile(data, name)
  local parts = {
    "local _P = {}",
    "local function print(t) _P[#_P+1]=t end",
  }
  local last = #data

  local getText, getPrint, getCode

  function getText(first)
    local a, b, pre, eq, post = data:find("([ \t]*)<%?(=?)( *)", first)
    local mode
    if a then
      if #eq > 0 then
        mode = getPrint
        a = a + #pre
      else
        mode = getCode
        b = b - #post
      end
    else
      a = last + 1
    end
    local part = data:sub(first, a - 1)
    if #part > 0 then
      parts[#parts + 1] = "print" .. stringify(part)
    end
    if mode then return mode(b + 1) end
  end
  function getPrint(first)
    local a, b = data:find("%?>", first)
    local mode
    if a then
      mode = getText
    else
      a = last + 1
    end
    local part = data:sub(first, a - 1)
    if #part > 0 then
      parts[#parts + 1] = "print(var(" .. part .. "," .. stringify(part) .. "))"
    end
    if mode then return mode(b + 1) end
  end
  function getCode(first)
    local a, b = data:find("%?>\n?", first)
    local mode
    if a then
      mode = getText
    else
      a = last + 1
    end
    local part = data:sub(first, a - 1)
    if #part > 0 then
      parts[#parts + 1] = part
    end
    if mode then return mode(b + 1) end
  end

  getText(1)

  parts[#parts + 1] = "return table.concat(_P)"
  local code = table.concat(parts, "\n")
  local fn, err = loadstring(code, "compiled template: " .. name)
  if fn then return fn end
  error(err .. "\n" .. code)
end

local function load(name)
  local template = cache[name]
  if not template then
    local source = assert(fs.readFile(name .. ".html"))
    template = compile(source, name)
    cache[name] = template
  end
  return template
end

local metatable

local function partial(name, data, source)
  name = name or "unknown"
  local template = source and compile(source, name) or load(name)
  data.self = data
  setfenv(template, setmetatable(data, metatable))
  return template()
end

local function var(value, name)
  return value == nil and "{" .. name .. "}" or tostring(value)
end

metatable = {
  __index = {
    os = os,
    markdown = renderMarkdown,
    tostring = tostring,
    var = var,
    partial = partial,
    table = table,
    string = string
  }
}

return function (res, name, data)
  data.body = partial(name, data)
  res.body = partial("layout", data)
  res.code = 200
  res.headers["Content-Type"] = "text/html"
end
