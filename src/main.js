// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import 'babel-polyfill'
import eUI from 'element-ui'
Vue.use(eUI)
import 'element-ui/lib/theme-chalk/index.css'

import comJS from './common/common'
Vue.prototype.$com = comJS
import api from './config/api'
Vue.prototype.$api = api
router.beforeEach((to, from, next) => {
	var c = comJS.getCookie();
	if (!c && to.path !== '/login') {
		next({
			path: '/login'
		})
	} else{
		next()
	}
})
Vue.config.productionTip = true
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
