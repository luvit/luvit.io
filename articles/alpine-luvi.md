{ title = "Luvi Apps in Alpine Linux",
  subtitle = "",
  author = {
    name = "Tim Caswell",
    email = "tim@creationix.com",
    twitter = "creationix",
    github = "creationix"
  },
  tags = { "luvi", "luvi", "busybox" },
  --published = 1447718837
}

Recently I've discovered a new Linux distribution called [Alpine Linux][].
It's basically just [Linux Kernel][] + [musl libc][] libc + [busybox][].  Or
in other words, it's super minimal and tiny.

## Compile Luvi From Source

The [pre-built luvi][] binaries won't run here because they use glibc (the
default libc for most linux systems.).  But the good news is compiling a custom
luvi is as simple as compiling from source.

Alpine has a simple package manager called [apk][].  We'll use it to install a
few prerequisites needed to clone and build from source.

```sh
apk update
# Install git and perl (needed for git submodules).
apk add git perl
# Install build tools.
apk add build-base cmake linux-headers
```

Now we will build luvi from source in the normal way.

```sh
# Clone luvi source recursively to get all submodules.
git clone --recursive https://github.com/luvit/luvi.git
# Build luvi (use tiny instead of reqular-asm if you don't need openssl)
cd luvi
make regular-asm test
```

If all goes well this will configure, build, and then test successfully.

Let's install luvi to a new `%HOME/bin` folder...

```sh
mkdir ~/bin
install build/luvi ~/bin
```

...and add it to our path.

```sh
echo 'export PATH=$HOME/bin:$PATH' >> ~/.profile
. ~/.profile
```

## Building the Luvi Invention Toolkit

Normally luvi based apps like [lit][], [luvit][], and [wscat][] are built by
downloading the appropriate luvi binary and concatenating it with a zip file
containing the application itself.  This works because executables ignore extra
data on the end and zip files ignore extra data at the front.  By combining them
we get a file that is *both* a zip file and an executable.

Lit does a little more by reading package.lua and synthesizing the dependencies
directly into the generated zip file.  Also it attempts to compile all lua files
into bytecode to save space and skip files not meant to be included.  But in the
end, it's still generating a custom zip file and then appending it to the
desired luvi binary.

Luvi can work on either a folder, a zip file, or detect a zip file appended to
itself.  Thus we can use lit to build itself once we have the luvi binary and the
lit zip.

```sh
cd
wget https://lit.luvit.io/packages/luvit/lit/latest.zip
```

We can now run lit from the zip file by doing `luvi latest.zip -- args...`.  
Everything before the `--` in luvi is the source trees/zips, everything after is
arguments to pass to the app itself.

Using the `make source_app target_binary custom_luvi` command we can built lit
using our custom luvi.

```sh
luvi latest.zip -- make latest.zip ~/bin/lit ~/bin/luvi
```

## Sharing Luvi Across Apps

But keeping with the spirit of Alpine and BusyBox, BusyBox is a single binary
where commands like `ls`, `cp`, `cat`, etc are just symlinks pointing to the
same file, we want to share the same luvi binary across all our luvi-based apps.

If you look at the built `lit` file in `~/bin`, you'll see it's just slight
bigger than the `luvi` binary itself.

```sh
> du -h ~/bin/*
4.7M    /root/bin/lit
4.5M    /root/bin/luvi
```

It turns out this is quite possible.  I added a feature to luvi a while back
where if there are no arguments before the `--` separator, it will consume one
source path after it.  This means you can replace the 4.5 megabyte header with
a single line `#!/root/bin/luvi --`!

Let's save that line to a file so that it can take the place of our *custom
luvi path*.

```sh
echo '#!/root/bin/luvi --' > prefix # Make sure to use the path to *your* luvi.
```

Now let's rebuild lit using this *custom luvi*.  Also now that we have lit
bootstrapped, we can build the normal way from the repository.

```sh
lit make lit://luvit/lit ~/bin/lit prefix
```

Now we have a much smaller lit.

```sh
244.0K  /root/bin/lit
4.5M    /root/bin/luvi
```

We can install any other luvi-based apps in the same way now.

```sh
lit make lit://luvit/luvit ~/bin/luvit prefix
lit make lit://creationix/wscat ~/bin/wscat prefix
lit make lit://creationix/simple-http-server ~/bin/simple-http-server prefix
lit make lit://virgo-agent-toolkit/fife ~/bin/fife prefix
...
```

[Alpine Linux]: http://www.alpinelinux.org/
[Linux Kernel]: https://www.kernel.org/
[musl libc]: http://www.musl-libc.org/
[Busybox]: https://www.busybox.net/
[pre-built luvi]: https://github.com/luvit/luvi/releases
[apk]: http://wiki.alpinelinux.org/wiki/Alpine_Linux_package_management
[lit]: https://github.com/luvit/lit
[luvit]: https://github.com/luvit/luvit
[wscat]: https://github.com/creationix/wscat
