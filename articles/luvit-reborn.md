{ title = "Luvit Reborn",
  author = {
    name = "Tim Caswell",
    email = "tim@creationix.com",
    twitter = "creationix",
    github = "creationix"
  },
  tags = { "news", "tutorial" },
  published = 1426173913
}

The original luvit (started 2011 by Tim Caswell) was a node.js-like programming
environment, but using Luajit instead of V8. Luvit 1.0 found it's niche in
places like cloud monitoring and scripting on slower devices like Raspberry PIs.
It had nearly identical APIs to node and thus was easy to learn for developers
looking for something like node, but less memory hungry.

Luvit 2.0 is a reboot of this idea but far more flexible and configurable. The
new system consists of many parts that can be used with or without the new luvit
framework.

```sh
curl -L https://github.com/luvit/lit/raw/master/get-lit.sh | sh
```

```bat
PowerShell -NoProfile -ExecutionPolicy unrestricted -Command "iex ((new-object net.webclient).DownloadString('https://github.com/luvit/lit/raw/master/get-lit.ps1'))"
```

```powershell
iex ((new-object net.webclient).DownloadString('https://github.com/luvit/lit/raw/master/get-lit.ps1'))
```

```lua
local http = require("http")

http.createServer(function (req, res)
  local body = "Hello world\n"

  res:on("error", function(err)
    print("Error while sending a response: " .. err)
  end)

  res:writeHead(200, {
    ["Content-Type"] = "text/plain",
    ["Content-Length"] = #body
  })
  res:finish(body)
end):listen(8080)

print("Server listening at http://localhost:8080/")
```
