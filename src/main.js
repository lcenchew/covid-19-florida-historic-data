import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import VueAnalytics from 'vue-analytics'

Vue.use(VueAnalytics, {
    id: 'UA-161455753-1'
})

new Vue({
    render: h => h(App),
}).$mount('#app')