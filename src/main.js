import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/global.css'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';
import animated from 'animate.css'
Vue.config.productionTip = false
Vue.use(Antd)
Vue.use(animated)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
