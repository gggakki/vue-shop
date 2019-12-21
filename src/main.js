// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import './assets/css/global.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 导入字体图标
import './assets/fonts/iconfont.css'

import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
//配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config

})

Vue.prototype.$http = axios

import MessageBox from 'element-ui'
Vue.prototype.$confirm = MessageBox


import Message from 'element-ui'
Vue.prototype.$message = Message


Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.component('tree-table',TreeTable)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
