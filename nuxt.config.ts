// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $development: undefined, $env: undefined, $meta: undefined, $production: undefined, $test: undefined,
  app: {
    head: {
      title: 'Rust Tools',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        {
          name: 'description',
          content: 'Useful tools for Rust game. List of loot tables for various crates, boxes, barrels, piles.'
        },
        {
          name: 'keywords',
          content: 'rust, playrust, crates, boxes, barrels, loot, items, tables, tools'
        },

        {property: 'og:image', content: '/box.png'}
      ],
      link: [
        {rel: 'icon', type: 'image/ico', href: '/favicon.ico'},
        {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,500&display=swap'},
      ]
    }
  },

  devtools: {enabled: true},

  css: ['~/assets/app.scss'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/_variables.scss" as *;'
        }
      }
    }
  }
})
