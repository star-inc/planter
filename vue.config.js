module.exports = {
    pages: {
        index: {
            title: process.env.VUE_APP_TITLE.replace(/<[^>]*>?/gm, ''),
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
        }
    },

    transpileDependencies: [
        'vuetify'
    ],

    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: false
        }
    }
}
