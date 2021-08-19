import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import moment from 'vue-moment';
import store from './store'
import router from './router'
import i18n from './i18n'

Vue.config.productionTip = false

Vue.use(moment)

new Vue({
    vuetify,
    store,
    router,
    i18n,
    render: h => h(App)
}).$mount('#app')
