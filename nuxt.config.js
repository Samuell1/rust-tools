module.exports = {
  mode: 'universal',
  head: {
    title: 'Rust Loot Tables',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'List of loot tables for various crates, boxes, barrels, piles.' },
      { hid: 'keywords', name: 'keywords', content: 'rust, playrust, crates, boxes, barrels, loot, items, tables' },

      { property: 'og:image', content: 'https://rust.vue.sk/box.png' }
    ],
    link: [
      { rel: 'icon', type: 'image/ico', href: 'https://rust.vue.sk/favicon.ico' }
    ]
  },
  loading: true,
  loadingIndicator: {
    name: 'folding-cube',
    color: '#8aa953',
    background: '#161512'
  },
  css: [
    {
      src: '~assets/app.scss',
      lang: 'scss'
    }
  ],
  apollo: {
    networkInterfaces: {
      default: '~/apollo/network-interfaces/default.js'
    }
  },
  modules: [
    '@nuxtjs/apollo',
    ['@nuxtjs/google-analytics', {
      ua: 'UA-108014756-1'
    }]
  ],
  build: {
    extractCSS: true,
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
