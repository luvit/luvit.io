local pathJoin = require('luvi').path.join
local templateDir = pathJoin(module.dir, "../templates")
local hd = require('hoedown')
local fs = require('coro-fs').chroot(templateDir)
local uv = require('uv')
local ffi = require('ffi')

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


local function compile(name)
  local data = assert(fs.readFile(name .. ".html"))
  local parts = {
    "local _P = {}",
    "local function print(t) _P[#_P+1]=t end",
  }
  local last = #data

  local getText, getPrint, getCode

  function getText(first)
    local a, b = data:find("<%?= *", first)
    local mode
    if a then
      mode = getPrint
    else
      a, b = data:find(" *<%?", first)
      if a then
        mode = getCode
      else
        a = last + 1
      end
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
  print(code)
  return assert(loadstring(code, "compiled template: " .. name))
end

local function load(name)
  local template = cache[name]
  if not template then
    template = compile(name)
    cache[name] = template
  end
  return template
end

local metatable

local function partial(name, data)
  local template = load(name)
  setfenv(template, setmetatable(data, metatable))
  return template()
end

local function var(value, name)
  return value == nil and "{" .. name .. "}" or tostring(value)
end

local renderer = hd.hoedown_html_renderer_new(hd.HOEDOWN_HTML_ESCAPE, 0)
local extensions = bit.bor(hd.HOEDOWN_EXT_BLOCK, hd.HOEDOWN_EXT_SPAN)
local document = hd.hoedown_document_new(renderer, extensions, 16);

local function markdown(input)
  if not input then return end
  local html = hd.hoedown_buffer_new(16)
  hd.hoedown_document_render(document, html, input, #input);
  local output = hd.hoedown_buffer_new(16)
  hd.hoedown_html_smartypants(output, html.data, html.size)
  local string = ffi.string(output.data, output.size)
  hd.hoedown_buffer_free(output)
  hd.hoedown_buffer_free(html)
  return string
end

metatable = {
  __index = {
    markdown = markdown,
    tostring = tostring,
    var = var,
    partial = partial,
    table = table,
    string = string
  }
}

return function (name, data)
  local layout = load("layout")
  data.body = partial(name, data)
  p(data)
  setfenv(layout, setmetatable(data, metatable))
  return layout()
end
