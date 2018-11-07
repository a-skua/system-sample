import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Cookie from 'js-cookie'

Vue.use(Vuex)

var cookieparser = require('cookieparser')

const store = () => new Vuex.Store({

  state: {
    auth: null
  },

  mutations: {
    update: function (state, auth) {
      state.auth = auth
    }
  },

  actions: {
    nuxtServerInit ({ commit }, { req }) {
      let auth = null
      if (req.headers.cookie) {
        var parsed = cookieparser.parse(req.headers.cookie)
        if (!parsed.auth) {
          return
        }
        auth = JSON.parse(parsed.auth)
      }

      commit('update', auth)
    },
    // TODO create login and logout methods
    async login({ commit }, { username, password }) {
      // const params = new URLSearchParams()
      // params.append('username', username)
      // params.append('password', password)

      try {
        const { data } = await axios.post('/api/login', {
          username: username,
          password: password
        })
        console.log(data)
      } catch(error) {
        console.log(error.message)
      }
      const auth = {
        user: username
      }
      commit('update', auth)
      Cookie.set('auth', auth)
    },
    async logout({ commit }) {
      try {
        const { data } = await axios.post('/api/logout')
        console.log(data)
      } catch(error) {
        console.log(error.message)
      }
      commit('update', null)
      Cookie.set('auth', null)
    }
  }
})

export default store
