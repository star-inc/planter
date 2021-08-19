import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Incidents from '../views/Incidents.vue'
import Metrics from '../views/Metrics.vue'
import Subscribe from '../views/Subscribe.vue'
import About from '../views/About.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index
    },
    {
        path: '/incidents',
        name: 'Incidents',
        component: Incidents
    },
    {
        path: '/metrics',
        name: 'Metrics',
        component: Metrics
    },
    {
        path: '/subscribe',
        name: 'Subscribe',
        component: Subscribe
    },
    {
        path: '/about',
        name: 'About',
        component: About
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router
