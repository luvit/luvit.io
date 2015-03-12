local _P = {}
local function print(t) _P[#_P+1]=t end
print[[<article>
  <h1>]]
print(var(title,'title'))
print[[</h1>
]]
print(var(content,'content'))
print[[</article>
]]
return table.concat(_P)
