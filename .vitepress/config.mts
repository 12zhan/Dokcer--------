import { defineConfig } from 'vitepress'

//是否是中文状态
const IsZH = true

//导航栏
const zhNav = [
  { text: '主页', link: '/' },
  { text: '安装DOcker', link: '/docs/zh/docker_install' }
]

//数据
const zhSidebar = [
  {
    text: 'Examples',
    items: [
      { text: '安装Docker', link: '/docs/zh/docker_install' },
      { text: '以太坊搭建', link: '/docs/zh/ethereum' },
      { text: '连接MateMask钱包', link: 'docs/zh/linkMoney' }
    ]
  }
]


export default defineConfig({
  title: "Docker 区块链私有链",
  description: "A VitePress Site",
  themeConfig: {
    nav: IsZH ? zhNav : [],

    sidebar: IsZH ? zhSidebar : [],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/12zhan/' }
    ]
  },
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh',
      link: '/docs/zh/index'
    },
    fr: {
      label: 'English',
      lang: 'fr',
      link: '/docs/en/index'
    }
  }
})
