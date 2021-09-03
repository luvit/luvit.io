---
sidebar_position: 5
slug: /security
---

# Security

## Reporting Vulnerabilities in Luvit Components

There currently aren't any official disclosure policies in place. If you encounter a security-critical issue the following is recommended:

* Ask on the [Luvit Discord](https://discord.gg/luvit) about how to proceed, mentioning security but *without giving details publicly*
* Alternatively, if you don't use Discord, you can open a GitHub issue in one of the relevant [luvit repositories](https://github.com/luvit/) instead

You'll (hopefully) quickly receive a reply and can then work with the community authors to get the issue fixed as soon as possible.

:::caution
It is best practice to **never** disclose security vulnerabilities publicly, at least before having given the authors the opportunity to publish a fix. This will help reduce the possibility of zero-day exploits, where an attacker who learned of the vulnerability can effectively use it against exposed applications before they have a chance to patch the security hole.

This is why the recommended approach is to give details **only in private**, and hold potential fixes locally (or in a private fork) instead of simply opening a (public) Pull Request on GitHub.
:::

For more details, please see the [Wikipedia article on Responsible Disclosure](https://en.wikipedia.org/wiki/Responsible_disclosure).

## Reporting Issues with Community Packages

Anything published under the [luvit](https://github.com/luvit) organization on GitHub can be considered an "official" package, and the above applies. This notably includes *all* ``luvit/X`` packages, as well as the core components of the runtime itself (``luv``, ``luvi``, ``luvit``), and the ``lit`` packaging tool.

All packages published under the ``creationix/X`` user are semi-official in the sense that they've been created by the Luvit author, [creationix](https://github.com/creationix), but aren't shipped with the ``luvit`` runtime by default. While some of them may not be actively maintained, it's generally recommended to follow the same approach outlined above, as they can be considered part of the immediate Luvit ecosystem.

## Reporting Issues with Third-Party Packages

For other packages, you can try and ask on the Discord server since their authors might be active there. However, when in doubt check out the package's GitHub repository to find out if any security policies or contact information has been published there.