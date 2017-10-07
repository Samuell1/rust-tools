module.exports = {
  mode: 'spa',
  head: {
    title: 'Rust Loot Tables',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'List of loot tables for various crates, boxes, barrels, piles.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/box.png' }
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
  modules: ['@nuxtjs/apollo'],
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
