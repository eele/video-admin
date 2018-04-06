import Vue from 'vue'
import App from './App.vue'
import { router } from './router.js'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'material-design-icons/iconfont/material-icons.css'

Vue.use(Element)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
