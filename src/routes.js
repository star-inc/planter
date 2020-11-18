import VueRouter from 'vue-router'

import Status from '@/views/Status.vue'
import About from '@/views/About.vue'

const routes = [
    {
    name: "Status",
    path: '/',
    component: Status
},
    {
    name: "About",
    path: '/about',
    component: About
}
]

const router = new VueRouter({
    routes
})

export default router;