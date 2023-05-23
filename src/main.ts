import Vue from 'vue'
import PerfectScrollbar from 'vue2-perfect-scrollbar'

import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import App from './App.vue'
import { apiServicePlugin } from './api/apiService'
import './registerServiceWorker'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.use(apiServicePlugin)
Vue.use(PerfectScrollbar)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
