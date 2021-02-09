import Service from '../Service'
import router from '../router'
export default {
  state: {
    loggedIn: false,
    token: localStorage.getItem('token') || '',
    user: localStorage.getItem('user') || '',
    bakendUrl: 'https://sleepy-headland-01669.herokuapp.com/',
  },
  mutations: {
    SET_user (state, payload) {
      state.user = payload
      localStorage.setItem(
        'user',
        state.user,
      )
    },
    SET_token (state, payload) {
      state.token = payload
      localStorage.setItem(
        'token',
        state.token,
      )
    },
    SET_loggedIn (state, payload) {
      state.loggedIn = payload
    },
  },
  actions: {
    async login ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        Service
        .post('auth/login', {
          email: payload.email,
          password: payload.password,
        })
        .then(res => {
          if (res.data.user.user_type === 0) {
            commit('SET_token', res.data.access_token)
            commit('SET_user', res.data.user)
            commit('SET_loggedIn', true)
            router.push({ path: '/' })
          }
          resolve(res)
        })
        .catch(err => {
          reject(err)
          console.log(err)
        })
      })
    },
    logout ({ commit }) {
      return new Promise((resolve, reject) => {
        Service
        .post('auth/logout')
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        }).then(() => {
          commit('SET_loggedIn', '')
          commit('SET_user', '')
          commit('SET_token', '')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          location.reload()
        })
      })
    },
    me ({ commit, state, dispatch }) {
      if (state.token) {
        return new Promise((resolve) => {
            Service
            .post('auth/me')
            .then(res => {
            commit('SET_user', res.data)
            commit('SET_loggedIn', true)
            resolve(res)
            })
            .catch(() => {
              dispatch('logout')
            })
        })
      }
    },
  },
  getters: {
    get_loggedIn (state) {
        return state.loggedIn
    },
    get_user (state) {
        return state.user
    },
    get_token (state) {
        return state.token
    },
    get_url (state) {
        return state.bakendUrl
    },
  },
}
