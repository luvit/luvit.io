-- Hand ported from https://github.com/creationix/mine

local jsonParse = require('json').parse

-- Mine a JavaScript string for require calls and export the module names
-- Extract all require calls using a proper state-machine parser.
return function (js)
  js = tostring(js)
  local names = {}
  local ident
  local quote
  local name
  local start
  local i

  local isIdent = "[a-zA-Z0-9_.$]"
  local isWhitespace = "[ \r\n\t]"

  local Start, Ident, Call, Name, NameEscape, Close, String, Escape, Slash, LineComment, MultilineComment, MultilineEnding

  function Start(char)
    if char == "/" then
      return Slash;
    end
    if char == "'" or char == '"' then
      quote = char
      return String
    end
    if char:match(isIdent) then
      ident = char
      return Ident
    end
    return Start
  end

  function Ident(char)
    if char:match(isIdent) then
      ident = ident .. char
      return Ident
    end
    if char == "(" and ident == "require" then
      ident = nil
      return Call;
    else
      if char:match(isWhitespace) then
        if ident ~= 'yield' and ident ~= 'return' then
          return Ident
        end
      end
    end
    return Start(char)
  end

  function Call(char)
    if char:match(isWhitespace) then return Call end
    if char == "'" or char == '"' then
      quote = char
      name = ""
      start = i + 1
      return Name;
    end
    return Start(char)
  end

  function Name(char)
    if char == quote then
      return Close;
    end
    if char == "\\" then
      return NameEscape
    end
    name = name .. char
    return Name
  end

  function NameEscape(char)
    if char == "\\" then
      name = name .. char
    else
      name  = name .. jsonParse('"\\' .. char .. '"');
    end
    return Name
  end

  function Close(char)
    if char:match(isWhitespace) then return Close end
    if char == ")" or char == ',' then
      names[#names + 1] = {
        name = name,
        offset = start
      }
    end
    name = nil
    return Start(char)
  end

  function String(char)
    if char == "\\" then
      return Escape
    end
    if char == quote then
      return Start
    end
    return String
  end

  function Escape()
    return String
  end

  function Slash(char)
    if char == "/" then return LineComment end
    if char == "*" then return MultilineComment end
    return Start(char)
  end

  function LineComment(char)
    if char == "\r" or char == "\n" then return Start end
    return LineComment
  end

  function MultilineComment(char)
    if char == "*" then return MultilineEnding end
    return MultilineComment
  end

  function MultilineEnding(char)
    if char == "/" then return Start end
    if char == "*" then return MultilineEnding end
    return MultilineComment
  end

  local state = Start;
  for j = 1, #js do
    i= j
    state = state(js:sub(i, i))
  end
  return names
end
