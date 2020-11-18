import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

// import VueMaterial from 'vue-material'
import { MdApp, MdButton, MdCard, MdToolbar, MdDrawer, MdList, MdContent, MdIcon } from 'vue-material/dist/components'

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/black-green-dark.css'

import router from '@/routes.js'

Vue.use(VueRouter)

// Vue.use(VueMaterial)
Vue.use(MdApp)
Vue.use(MdButton)
Vue.use(MdCard)
Vue.use(MdToolbar)
Vue.use(MdDrawer)
Vue.use(MdList)
Vue.use(MdContent)
Vue.use(MdIcon)

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
