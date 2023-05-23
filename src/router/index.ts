import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import store from '@/store/index'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/email',
    name: 'Email',
    props: true,
    component: () => import(/* webpackChunkName: "email" */ '@/views/Email.vue'),
  },
  {
    path: '/login/',
    name: 'Login',

    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
  },
]

const router = new VueRouter({
  mode: 'history', // /#/login => /login
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, _, next) => {
  if (to.name !== 'Login' && !store.state.isAuthenticated) {
    next({ name: 'Login' })

    return
  }

  if (to.name === 'Login' && store.state.isAuthenticated) {
    next({ name: 'Email' })

    return
  }

  next()
})

router.beforeEach((_, __, next) => {
  store.commit('setLoading', true)
  next()
})

router.afterEach(() => {
  store.commit('setLoading', false)
})

export default router
