export type UserInfo = Record<string, unknown>

export interface UserState {
  token: string | null
  userInfo: UserInfo | null
  providerInfo: string | null
}

const initialState = (): UserState => ({
  token: null,
  userInfo: null,
  providerInfo: null,
})

const getters = {
  getCurrentToken(state) {
    return state.token
  },
  getProvider(state) {
    return state.providerInfo
  },
  getUser(state) {
    return state.userInfo
  },
}

const actions = {
  logout(context) {
    context.commit('setAuthStatus', false)
    context.commit('resetToken')
  },
}

const mutations = {
  resetToken(state: UserState) {
    state.token = null
    state.userInfo = null
  },
  setToken(state: UserState, token: string) {
    state.token = token
  },
  setUser(state: UserState, user: UserInfo) {
    state.userInfo = user
  },
  providerInfo(state, providerInfo) {
    state.providerInfo = providerInfo
  },
}

export default {
  state: initialState,
  getters,
  actions,
  mutations,
}
