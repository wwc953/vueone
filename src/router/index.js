import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home.vue'
import login from '@/components/views/login.vue'
import bootconfig from '@/components/config/config.vue'
import menuconfig from "@/components/config/menuConfig.vue";

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: home,
    }, {
      path: '/login',
      name: 'login',
      component: login,
    }, {
      path: '/config',
      name: 'bootconfig',
      component: bootconfig,
    }, , {
      path: '/menuconfig',
      name: 'menuconfig',
      component: menuconfig,
    },
  ]
})
//
router.beforeEach((to, from, next) => {
  const tokensign = sessionStorage.getItem('token')
  //to.path 目标路由
  //next 必须有否则程序不会继续执行
  if (to.path !== '/login' && !tokensign) { return next('/login') }
  next()
})
export default router
