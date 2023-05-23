import Vue from 'vue'
import Vuex from 'vuex'
import persistedState from 'vuex-persistedstate'

import Email from '@/store/email'
import User from '@/store/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentTheme: 'theme-light',
    isAuthenticated: false,
    loading: false,
    collapsedMenu: false,
    collapsedMetrics: false,
    sleepMode: false,
    packageVersion: process.env.PACKAGE_VERSION || '0',
  },
  mutations: {
    changeTheme(state, newTheme) {
      state.currentTheme = newTheme
    },
    setLoading(state, isLoading) {
      state.loading = isLoading
    },
    setAuthStatus(state, auth) {
      state.isAuthenticated = auth
    },
    setCollapsedMenu(state, collapsed) {
      state.collapsedMenu = collapsed
    },
    setCollapsedMetrics(state, collapsed) {
      state.collapsedMetrics = collapsed
    },
    setSleepMode(state, isSleep) {
      state.sleepMode = isSleep
    },
  },
  getters: {
    appVersion: (state) => state.packageVersion,
    getCurrentTheme(state) {
      return state.currentTheme
    },
    getIsMenuCollapsed(state) {
      return state.collapsedMenu
    },
    getIsMetricsCollapsed(state) {
      return state.collapsedMetrics
    },
    getIsInSleepMode(state) {
      return state.sleepMode
    },
  },
  actions: {},
  modules: {
    User,
    Email,
  },
  plugins: [persistedState()],
})
