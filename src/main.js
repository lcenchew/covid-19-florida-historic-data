import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'


Vue.config.productionTip = false

import VueAnalytics from 'vue-analytics'

Vue.use(VueAnalytics, {
    id: 'UA-161455753-1'
})

Vue.use(VueRouter)
const routes = [
    { path: '/:county', component: App }
]
const router = new VueRouter({
    routes // short for `routes: routes`
})

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')