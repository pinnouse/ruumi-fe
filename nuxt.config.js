
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    htmlAttrs: {
      lang: 'en',
    },
    title: 'ruumi',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { href: "https://fonts.googleapis.com/css?family=Montserrat&display=swap", rel: "stylesheet" },
      { rel: 'apple-touch-icon', sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: 'icon', type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: 'icon', type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: 'manifest', href: "/site.webmanifest" },
    ]
  },
  host: process.env.HOST || 'localhost',
  env: {
    hostUrl: process.env.HOST_URL || 'localhost:3000',
    hostProtocol: process.env.HOST_PROTOCOL || 'http'
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/css/main.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    },
    extractCSS: true,
  }
}
