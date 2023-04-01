// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  alias: {
    'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
  },

  // Target: https://go.nuxtjs.dev/config-target
  // target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  app: {
    head: {
      title: 'TextPocket | Organiza y gestiona tus mensajes de WhatsApp',
      htmlAttrs: {
        lang: 'en',
        class: 'notranslate',
        translate: 'no',
      },
      script: [
        { src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7082565681012132', crossorigin: 'anonymous' }
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '' },
        { property: 'og:url', content: 'https://textpocket.com' },
        { name: 'facebook-domain-verification', content: 'qzjsfd5fl00oks6hqn1p3p897htgg3' },
        { name: 'robots', content: 'notranslate' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', type: 'image/x-icon', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Righteous:ital,wght@0,400;0,700;1,400;1,700&display=swap' },
      ],
    },
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/style.css',
    '@/assets/css/aqua.css',
    '@/assets/css/urbanist.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
})
