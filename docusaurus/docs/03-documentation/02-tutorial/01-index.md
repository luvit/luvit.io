---
sidebar_position: 1
slug: /docs/tutorial/getting-started
---

# Getting Started

Welcome to the Luvit documentation! If this is the first time developing a Luvit app, read through these tutorial pages in order to get familiar with the basics. Otherwise, feel free to look around and explore the API or community guides at your leisure!

## What is Luvit?

At the heart of the Luvit ecosystem is a toolkit that allows you to write and publish Lua-based applications, as well as create binary executables from them. You can use a set of embedded standard libraries to do things like send network messages, access the file system, or use multiple threads concurrently. You can also create self-contained packages, and import third-party libraries directly.

All these things are normally difficult in Lua, since it doesn't have an "official" standard library, but Luvit makes them quite simple!

This toolchain consists of multiple parts, which can be a bit confusing at first if you're only just starting out. However, after you've completed this tutorial, it will become clear why it's organized in this way and how you can use the different tools in your workflow.

## Prerequisites

This tutorial only assumes you've learned the basics of Lua, e.g. by reading the free [Programming in Lua eBook](https://www.lua.org/pil/contents.html) and know how to use a [command-line interface](https://en.wikipedia.org/wiki/Command-line_interface). Essentially, if you can write a simple app and execute it with the regular ``lua`` interpreter, you're good to go!

If you're familiar with a standard Lua environment, there aren't that many new things to learn before you can start building complex applications using the Luvit APIs. Knowledge of LuaJIT and C is not required, though you may want to learn more about them later.

## Before You Start

You should download the three core components (provided as a single file for your convenience) compatible with your platform from the [landing page](/). Make sure you can execute them locally, either by extracting them to the folder you're working in while following this tutorial, or adding them to your ``PATH``. Instructions for doing this can be found online for [Windows 10](https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/) and [Linux or Mac OS systems](https://askubuntu.com/questions/440691/add-a-binary-to-my-path).

Ensure it works by typing ``luvit``, ``luvi``, and ``lit`` in your console. You may have to re-start the terminal after modifying the ``PATH``.

We will be using all three of these applications over the course of this tutorial, but here's a brief summary of what they can do:

* ``luvit`` is a drop-in replacement for the standard ``lua`` interpreter and comes with embedded libraries (the Luvit standard library)
* ``luvi`` is the actual runtime contained in ``luvit``. It executes Lua scripts in its own enriched global environment as a "bundle"
* ``lit`` is the Luvit package manager and allows you to install packages, publish your own, or turn them into executables

There's also the ``luv`` bindings API, which allows calling into the C-library underneath it all from Lua, but this isn't relevant here.

## If You Need Help

Our community members are always happy to answer your questions, so feel free to head into the official [Luvit Discord](https://discord.gg/luvit) and ask away!

Just please make sure you've read through the documentation first, as the humble author of these pages has taken great pains to make it as easy to understand and accessible as possible. In fact, if you can't find an answer to your question here, please let us know via Discord (or GitHub) and it will be improved. The quality of the documentation is extremely important, so we'd love to hear from you!

## If You Want to Help

If, during the course of your work with Luvit, you have some time to spare and you'd like to help *us*, that's great! The Luvit community is still fairly small, so we need all the help we can get to ensure the project stays alive and well. You don't need to be an expert to do this.

Please head to the [Contribution Hub](/contributing) to learn what you can do to get involved, or simply ask on [Discord](https://discord.gg/luvit) for some guidance.