// Log which Nitro preset is being used
const isProduction = process.env.NODE_ENV === 'production';
const nitroPreset = process.env.NITRO_PRESET ?? (
  isProduction ? 'cloudflare-module' : 'bun'
);
console.info(`Using Nitro preset: ${nitroPreset}`);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {enabled: true},
  future: {compatibilityVersion: 4},
  ssr: true,

  app: {
    pageTransition: {name: 'page', mode: 'out-in'},
    head: {
      title: 'Star Inc.',
      meta: [
        {
          name: 'description',
          content: 'Star Inc. is a technology company from Taiwan. ' +
            'We are working on Internet, Software, and AI Engine.',
        },
      ],
      link: [{rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}],
    },
  },

  ui: {
    colorMode: false,
  },
  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
  ],

  nitro: {
    preset: nitroPreset,
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      '*/5 * * * *': ['ping'],
    },
  },

  runtimeConfig: {
    public: {
      turnstileSiteKey: '0x4AAAAAAAr6BiB1qiCUf6hp',
    },
  },

  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en-US.json',
        name: 'English',
      },
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    langDir: 'locales',
  },
});
