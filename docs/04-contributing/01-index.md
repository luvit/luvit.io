---
sidebar_position: 1
slug: /contributing
---

# Contributing to the Luvit Project 

Thank you for your interest in getting involved with the Luvit project! This article will help you get started contributing quickly.

## Asking for Help

If this documentation didn't answer your questions, don't be afraid of requesting aid! The Luvit community is small but very welcoming.

Here's a few ways of going about it:

* Recommended: Simply hop into the [Luvit Discord](https://discord.gg/luvit) and ask away! You should get a response quickly since it's reasonably active
* You can also open an issue in any of the [organization's GitHub repositories](https://github.com/luvit/). This won't always get you an answer as fast, but it may be better-suited for extended technical discussions or complex problems that can't be taken care of right away

If you're looking to take on specific responsibilities or help improve the Luvit ecosystem, the community will be happy to guide you!

## Reporting Bugs

If you've found something that seems like a problem with one of the Luvit components, please don't hesitate to open an issue on the GitHub project. Ideally, you should attach a reproducible test case, i.e., a minimal code sample without external dependencies, which clearly demonstrates the problem. This will make it easy for community contributors to quickly understand and resolve your issue.

Note: If you aren't sure how this could look, [StackOverflow](https://stackoverflow.com/help/minimal-reproducible-example) has some guidelines that may help you get a better idea.

Additionally, you should include as much relevant information as you can regarding your execution environment:

* The version of all Luvit components used, as is printed by the respective application when called without arguments
* Your operating system and processor architecture (e.g., Windows 10 on an x64 CPU, Ubuntu 20.04 LTS on x86, etc.)
* Whether or not you have made any custom changes to the component, no matter how trivial they seem

The Luvit project is managed across [several GitHub repositories](https://github.com/luvit/), each with their own separate issues tracker.

If possible, please direct any issues you are reporting to the appropriate repository:

* To report issues specific to the embedded LuaJIT engine, low-level APIs, and bundling logic, please use [luvit/luvi](https://github.com/luvit/luvi)
* To report issues specific to the management and creation of packages, please use [luvit/lit](https://github.com/luvit/lit)
* To report issues specific to the high-level APIs and self-contained runtime, please use [luvit/luvit](https://github.com/luvit/luvit)
* To report issues specific to the underlying [libuv](https://docs.libuv.org/) bindings, please use [luvit/luv](https://github.com/luvit/luv)

When in doubt, simply use the main [luvit](https://github.com/luvit/luvit) repository to reach the largest audience, since it has the most people watching, and the community will be happy to redirect you to another repository as needed. Even easier: You can join the [official Luvit Discord](https://discord.gg/luvit) to ask!

## Code Contributions

If you'd like to contribute bugfixes or new features to the Luvit core components, please consult the [Contribution Guidelines](/contributing/guidelines).

In case you're unsure where to start, please see the [First-time Contributor's Guide](/docs/guides/how-to-start-contributing), or (as always) simply ask on the [Luvit Discord](https://discord.gg/luvit).

## Triaging Issues

TODO: https://github.com/nodejs/node/blob/master/doc/guides/contributing/issues.md#triaging-a-bug-report

## Other Ways of Contributing

Even if you're not a developer, you can help with any (or all) of the following:

* Documentation
* Design
* Testing
* Discord Community
* Anything else you can think of

## Becoming a Collaborator

:::info
This section was entirely improvised by the humble author of these pages, and requires input from the Luvit community authors.

*Reason: There's no discernible process for people to become collaborators (write access to the repositories) that I could find.*
:::

TODO: See https://nodejs.org/en/get-involved/contribute/#becoming-a-collaborator

## Pull Requests

TODO: https://github.com/nodejs/node/blob/master/doc/guides/contributing/pull-requests.md