import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import TreeTable from  'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1'
axios.interceptors.request.use(config =>{
  // console.log(config)
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('api_token')
  return config
})
axios.interceptors.response.use(config=>{
  NProgress.done()  
  return config
})
Vue.prototype.$http = axios



Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)
Vue.use(VueQuillEditor)
Vue.filter('dateFormat',function(originVal){
  const dt=new Date(originVal*1000)
  const y=dt.getFullYear()
  const m=(dt.getMonth()+1+'').padStart(2,'0')
  const d=(dt.getDate()+'').padStart(2,'0')
  const hh=(dt.getHours()+'').padStart(2,'0')
  const MM=(dt.getMinutes()+'').padStart(2,'0')
  const ss=(dt.getSeconds()+'').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${MM}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
