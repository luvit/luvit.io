local hd = require('hoedown')
local ffi = require('ffi')

local renderer = hd.hoedown_html_renderer_new(hd.HOEDOWN_HTML_ESCAPE, 0)
local extensions = bit.bor(hd.HOEDOWN_EXT_BLOCK, hd.HOEDOWN_EXT_SPAN)
local document = hd.hoedown_document_new(renderer, extensions, 16);

return function (input)
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
