{ title = "Luvit Reborn",
  subtitle = "A New Era is Upon Us",
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

![](/luvit-reborn/a-new-era.jpg)

Luvit 2.0 is a reboot of this idea but far more flexible and configurable. The
new system consists of many parts that can be used with or without the new luvit
framework.

## Getting Lit

To build lit, simply enter the following commands depending on your terminal type.

For unix shell users, this should work:

```sh
curl -L https://github.com/luvit/lit/raw/master/get-lit.sh | sh
```

If you're on windows and using `cmd.exe`, the following is advised:

```bat
PowerShell -NoProfile -ExecutionPolicy unrestricted -Command "iex ((new-object net.webclient).DownloadString('https://github.com/luvit/lit/raw/master/get-lit.ps1'))"
```

If you're a powershell user, you can type the powershell script directly:

```powershell
iex ((new-object net.webclient).DownloadString('https://github.com/luvit/lit/raw/master/get-lit.ps1'))
```

All of these will give you a `lit` command in your current directory.  Make sure to put it somewhere in your path (like `/usr/local/bin`) so it can be used anywhere.

## Making Luvit

Once you have `lit`, making luvit is trivial.  Simply run:

```sh
# For latest stable version of lit
lit make lit://luvit/luvit

# Or if you prefer master in git
lit make github://luvit/luvit
```

Now you'll have a `luvit` executible in your current folder.  Put in the same place as your lit executible.

## Luvit in Action

Luvit can be used for a great many things, the original HTTP server ported from the old node.js days and luvit 1.0 still works, try it!

First create a file containing the following:

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


Then run this file (assuming you named it `http-server.lua`) with the command:

```sh
luvit http-server.lua
```

And point your browser to http://localhost:8080/ to see your creation.
