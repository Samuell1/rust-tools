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
      { rel: 'icon', type: 'image/ico', href: 'https://rust.vue.sk/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,500&display=swap' }
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
    clientConfigs: {
      default: {
        httpEndpoint: 'https://api.graph.cool/simple/v1/cj8g20g6q030q0156airzo84g'
      }
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
      if (ctx.isDev && process.client) {
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
