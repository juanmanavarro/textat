export default defineNuxtConfig({
  app: {
    head: {
      title: 'Dashboard | TextPocket',
    }
  },
  css: ['@/assets/scss/custom.scss'],
  runtimeConfig: {
    public: { ...process.env, }
  },
  modules: [
    [
      '@pinia/nuxt',
      {
        autoImports: [
          'defineStore',
          ['defineStore', 'definePiniaStore'],
        ],
      },
    ]
  ],
  imports: {
    dirs: ['./stores']
  },
})
