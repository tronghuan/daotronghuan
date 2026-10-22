// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Đào Trọng Huấn',
  tagline: 'Góc chia sẻ về công việc, cuộc sống và những suy nghĩ ngẫu hứng',
  favicon: 'img/favicon.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://daotronghuan.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'tronghuan', // Usually your GitHub org/user name.
  projectName: 'daotronghuan', // Usually your repo name.
  trailingSlash: true,

  onBrokenLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'vi',
    locales: ['vi'],
  },

  // 1. Kích hoạt render Mermaid trong các file Markdown
  markdown: {
    mermaid: true,
  },

  // 2. Khai báo Theme Mermaid
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          blogTitle: 'Tán Gẫu',
          blogDescription: 'Suy ngẫm, tản mạn và bất kỳ điều gì muốn chia sẻ.',
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Đào Trọng Huấn', // Tên hiển thị góc trái
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg', // Bạn có thể thay file logo.svg của riêng mình vào thư mục static/img sau
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Công Việc ⚙️',
          },
          {
            to: '/cuoc-song',
            label: 'Cuộc Sống 🏡',
            position: 'left',
          },
          {
            to: '/blog',
            label: 'Tán Gẫu ☕',
            position: 'left',
          },
          {
            href: 'https://github.com/tronghuan',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Nội dung',
            items: [
              { label: 'Công Việc', to: '/docs/intro' },
              { label: 'Cuộc Sống', to: '/cuoc-song' },
              { label: 'Tán Gẫu', to: '/blog' },
            ],
          },
          {
            title: 'Về tôi',
            items: [
              { label: 'Portfolio', to: '/about' },
              { label: 'GitHub', href: 'https://github.com/tronghuan' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Đào Trọng Huấn`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['apex'],
      },
    }),
};

export default config;
