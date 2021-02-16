import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginRouter from './Login'
import HomeRouter from './Home'





Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
    LoginRouter,
    HomeRouter,
   
  ]
})

router.beforeEach((to,from,next)=>{
  if(to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('api_token')
  if(!tokenStr) return next('/login')
  next()
})

export default router
