//  import Vue from 'vue';
import axios from 'axios'
import store from './store'
axios.interceptors.request.use(config => {
    config.baseURL = store.getters.get_url + 'api/'
    config.headers.Authorization = `Bearer ${localStorage.getItem('token') || ''}`
    return config
})

axios.interceptors.response.use(
  response => response,
  error => {
    const { status } = error.response
    if (status === 401) {
      if (localStorage.getItem('token')) { store.dispatch('logout') }
    }
    return Promise.reject(error)
  },
)
export default axios
