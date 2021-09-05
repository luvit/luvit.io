---
sidebar_position: 1
slug: /docs
---

# Table of Contents

There are several types of documentation available on this website:

* An [introductory tutorial](/docs/tutorial/getting-started) to help new users get started developing Luvit applications (*when in doubt, start here*)
* [Guides](/docs/guides) written by the community can show you how to solve problems that are commonly encountered
* Explanations of [important concepts](/docs/concepts), intended for those who want to dive deeper and understand how things work in detail
* [References](/docs/references) for all of the Luvit core components and the functionality that they make available via APIs or other means
* A list of libraries that are incorporated in the Luvit core can be found [below](docs#dependencies), in case you want to learn more about their use

If what you're looking for isn't included here, please open an issue or let us know in the [Discord server](https://discord.gg/luvit)!

## Tutorial

TBD: The custom require handler should be mentioned. But where?

* [Getting Started](/docs/tutorial/getting-started): Introduction to the Luvit Ecosystem
* Quickstart: Your First Luvi App (Might Confuse You)
* Event Loop Fundamentals: Making the Most of LibUV
* Phenomenal Cosmic Powers: Luvit APIs and How to Wield Them
* Lit Packaging 101: Bundling Your App
* Lit Packaging 102: Using Community Packages
* Things WILL Break: Troubleshooting and Finding Help

## Guides

### Luvit APIs

* HTTP/S Server
* Compression and Decompression
* Password Hashing
* Buffers and Strings (FFI vs. Lua)
* Streams and Pipes (IPC?)
* Reading from STDIN
* File System
* Networking via TCP and UDP
* REPL and CLI Interfaces
* Timers
* Threads and Processes
* DNS

### Luvi Bundles

* Creating Self-Contained Executables

### Packaging with Lit

* Creating Lit Packages
* Publishing Lit Packages
* Importing Lit Packages
* Creating Standalone Binaries
* Working with the Local Cache
* Using the Official Lit Package Registry
* Using a Self-hosted Lit Package Registry

### Developing Luvit's Core

* Building Luvi from Source
* Performing Automated Testing
* Updating the Documentation
* Deployment and Releases

### LibUV and LUV Bindings

* Using LUV in Other Lua Environments

### Advanced Topics

* WebSockets Server (TBD)
* REST API (TBD)
* Logging (TBD)
* Testing and Debugging (TBD)
* Events and Event Emitters (TBD)
* Security Considerations and Hardening Your App
* Optimizing Performance via Benchmarking
* Creating (and Maintaining) Generated Documentation

## Concepts

* Blocking vs. Non-Blocking I/O
* LibUV Threads and Handles
* Luvi Bundles
* Nonstandard Module Loader (?)

## References

* Documentation for Luvit's High-Level APIs
* Description of Luvi's Global Environment
* List of Available Lit Commands
* Lit Package Metadata Format
* LibUV Bindings API (luv)

## Dependencies

* [LuaJIT](https://luajit.org/luajit.html) is the state-of-the-Art Lua engine that forms the basis of the Luvi runtime
* [libuv](https://docs.libuv.org) controls the event loop, and provides Luvi-based applications with asynchronous I/O facilities
* [OpenSSL](https://www.openssl.org/docs) implements the underlying functionality for cryptography and hashing
* [miniz](https://github.com/richgel999/miniz) is included for the exported compression and decompression algorithms
