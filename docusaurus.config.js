const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Luvit.io',
  tagline: 'Asynchronous I/O for Lua',
  url: 'https://unofficialluvitexperiments.github.io/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',
  trailingSlash: true, // Required for GitHub pages
  organizationName: 'UnofficialLuvitExperiments', // Usually your GitHub org/user name.
  projectName: 'unofficialluvitexperiments.github.io', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Luvit',
      logo: {
        alt: 'Luvit Logo',
        src: 'img/luvit-logo-tiny-white.svg',
      },
      items: [
        {to: '/', label: 'Home', position: 'left'},
        {to: '/about', label: 'About', position: 'left'},
        {to: '/downloads', label: 'Downloads', position: 'left'},
        {to: '/docs', label: 'Docs', position: 'left'},
        {to: '/contributing', label: 'Contributing', position: 'left'},
        {to: '/security', label: 'Security', position: 'left'},
        {to: '/blog', label: 'News', position: 'left'},
        {
          label: 'Discord',
          href: 'https://discord.gg/luvit',
          position: 'right',
        },
        {
          href: 'https://github.com/luvit/',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
      ],
      copyright: `Copyright ©2015-${new Date().getFullYear()} The Luvit Authors`,
    },
    colorMode: {
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ['lua'],
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/luvit/luvit.io/edit/master/website/',
          routeBasePath: "/",
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/luvit/luvit.io/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
