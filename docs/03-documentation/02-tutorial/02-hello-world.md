---
sidebar_position: 2
slug: /docs/tutorial/hello-world
---

# Your First Luvit App

In this tutorial, we will be creating a simple Hello World app that runs in the Luvit environment. By the end of it, this application will have become a (very simple) webserver that responds to your requests with the same "Hello world" text, can be run like any ordinary executable completely on its own, and is turned into a self-contained package ready to be uploaded and shared with the world.

## Creating Your Application

Luvit apps adhere to a specific structure when they are turned into packages, but for now you can simply create a regular lua script:

```lua title="HelloWorld.lua"
print("Hello world")
```

This script could also be run in a standard ``lua`` interpreter, as it doesn't make use of the Luvit standard library.

## Running the Application

So far, this seems pretty boring. Running the script by typing ``luvit HelloWorld.lua`` will yield the following output:

> Hello world

... and after this, your program exits. That is exactly what you'd expect. Let's make things interesting and access the global environment.

## The Luvi Environment

In order to explore something you *can't* usually do in standard Lua, we now modify the script to import ``uv`` from the Luvit ecosystem:

```lua title="HelloWorld.lua"
local uv = require("uv")

print("Hello world")

local SLEEP_TIME_IN_MILLISECONDS = 3000
uv.sleep(SLEEP_TIME_IN_MILLISECONDS)

print("Good morning!")
```

Running the script again should now print

> Hello world

before waiting three seconds, printing

> Good morning!

and finally exiting.

The ``uv`` library allows us to call any function provided by the [``libuv``](http://docs.libuv.org/en/v1.x/api.html) C-library from Lua. This makes it possible to do a variety of things Lua can't easily do, such as accessing the file system, creating threads, setting timers, or sending network messages. All this is automatically included in the ``luvit`` executable (and, in fact, even inside the ``luvi`` runtime itself) so we can always ``require`` it.

Before we focus on the ``uv`` library and what else it can do, there's something very important that we can learn from the above:

**The Luvit environment is not the same as a standard Lua environment!** It has all the regular Lua 5.1 functions, like ``print`` and ``dofile``, but as we have seen above it also allows importing certain libraries that aren't usually present. These are intended to enhance the Lua environment, and will be injected into your application by the ``luvi`` runtime.

Next we will see that there are also certain "magic" globals exposed by the runtime. Let's modify the script as follows:

```lua title="HelloWorld.lua"
local uv = require("uv")

print("Hello world")

local SLEEP_TIME_IN_MILLISECONDS = 3000
uv.sleep(SLEEP_TIME_IN_MILLISECONDS)

print("Good morning!")

print(uv)
p(uv)
```

The output will be similar to the last time we ran the script, except now we can see the output of calling the embedded ``p`` global (a shorthand for ``pretty-print``). Evidently, Lua's ``print`` cannot print complex data structures because it simply calls the ``__tostring`` metamethod, resulting in an output like ``table: 0x0232126a23f8``. Luvit's pretty-print library can however print these recursively and in a human-readable fashion, which makes it a handy tool for debugging or to refresh your memory without having to look up APIs.

Printing ``uv`` via ``pretty-print`` will give you an overview of the entire API surface, i.e., all the functions exported from the ``libuv`` C-library. Don't worry too much about how to use them all for now, we'll get back to that shortly. It should look approximately like this:

![02-luv-api-dump.png](02-luv-api-dump.png)
Pictured: The expected console output [(click here to enlarge)](02-luv-api-dump.png)

Needless to say, you can do the same thing with any of the other embedded libraries or bindings, such as ``jit``, ``openssl``, ``miniz`` or even the default Lua libraries like ``string`` and ``os``. Generally, any Lua object can be printed, including your own tables and variables.

If you aren't sure what other functionality is made available globally, simply consult the [references](/docs/references/global-environment) section of this documentation.

## Relative Imports

There is one more important difference between Luvi's environment and what you might know from a standard Lua implementation:

Lua offers the ``require`` function as a way to load modules; if you haven't used it before you might want to look up the [documentation](https://www.lua.org/pil/8.1.html) for it. In a ``luvi``-based environment, this module loader is modified to behave more like the one included in the JavaScript ecosystem from which it was inspired. This means you can import modules using relative paths, which we'll be exploring next.

In order to test how this works, we will create a simple module in another file:

```lua title="HelloWorldModule.lua"
local uv = require("uv")

local HelloWorldModule = {}

function HelloWorldModule:HelloWorld()
    print("Hello world")

    local SLEEP_TIME_IN_MILLISECONDS = 3000
    uv.sleep(SLEEP_TIME_IN_MILLISECONDS)

    print("Good morning!")
end

return HelloWorldModule
```

We can simply import this into our main script (the file that we execute by running ``luvit HelloWorld.lua``) as follows:

```lua title="HelloWorld.lua"
local HelloWorldModule = require("./HelloWorldModule")

HelloWorldModule:HelloWorld()
```

As you yould expect, the output will be the exact same as in the previous version, even if loaded from the ``HelloWorldModule.lua`` file.

Luvit's custom require handler will resolve the path and determine it should load the file in the same directory (``.`` is the current folder). This doesn't work in a standard Lua environment, at least not without modifying the loading process - a problem we can avoid entirely. You can use any path and organize your application in whichever way you prefer, then use relative paths where needed via ``require``.

It's important to always remember that paths are resolved differently in Luvit, because this can otherwise have some surprising effects.

## Default Module Paths

Specifically, there is a global "default module path" that is being used when you haven't given a path, but only a module name.

By default, Luvi will look into a ``libs`` and then a ``deps`` folder (in this order) to determine whether there are any modules that match the name of the requested import, and load them from there if possible.

The implication is that writing ``local HelloWorldModule = require("HelloWorldModule")`` will "just work" if you put ``HelloWorldModule.lua`` into either a ``libs`` or a ``deps`` folder, as long as the file exports a module (``return`` yields a ``table``).

Let's just try this out quickly before we continue. Move the ``HelloWorldModule.lua`` file into a new folder called ``libs``:

```lua title="libs/HelloWorldModule.lua"
local uv = require("uv")

local HelloWorldModule = {}

function HelloWorldModule:HelloWorld()
    print("Hello world")

    local SLEEP_TIME_IN_MILLISECONDS = 3000
    uv.sleep(SLEEP_TIME_IN_MILLISECONDS)

    print("Good morning!")
end

return HelloWorldModule
```

Make sure it's placed in a ``libs`` folder and then try to import it, like so:

```lua title="HelloWorld.lua"
local HelloWorldModule = require("HelloWorldModule")

HelloWorldModule:HelloWorld()
```

In fact, if you don't move ``HelloWorldModule`` to ``libs/HelloWorldModule`` it will still work, because ``require`` also checks the current folder (``.``). But beware: It does so *after* checking the ``libs`` and ``deps`` directories, so if you have two versions it might not load the one you meant to use. It's just a small thing to be aware of, and you shouldn't really have multiple versions anyway, but if you do it's best to make sure the load order is as expected or you might be hunting elusive bugs for quite some time.

## Introducing the Event Loop

Possibly the most important part of the Luvit environment is the event loop, which is closely linked to ``libuv`` and the ``uv`` library. So far we haven't done much with ``uv``, other than using the ``timer`` API and dumping all of its exported functions to test ``pretty-print``.

In the next section, we'll be using some of the exposed lower-level facilities and dive into what else the underlying ``libuv`` can do for us.
