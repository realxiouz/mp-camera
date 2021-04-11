import { http } from '@/utils/request'

export default {
  namespaced: true,
  state: {
    token: '',
    session_key: '',
    openId: '',
  },
  mutations: {
    setSessionKey(state, key) {
      state.session_key = key
    },
    setOpenId(state, id) {
      state.openId = id
    },
    setToken(state, token) {
      state.token = token
    }
  },
  actions:{
    getSessionKey({commit, state}) {
      return new Promise( async (resolve, reject) => {
        if (state.session_key) {
          try {
            await wx.checkSession()
            resolve(state.session_key)
          } catch(e) {
            
            console.log('session_key过期')
            let { code } = await wx.login()
            let r = await http('api/v1/user/getWxMiniProgramSessionKey', { code }, 'post')
            let  { session_key, openid } = r.data
            commit('setSessionKey', session_key)
            commit('setOpenId', openid)
            resolve(session_key)
          }
        } else {
          let { code } = await wx.login()
          let r = await http('api/v1/user/getWxMiniProgramSessionKey', { code }, 'post')
          let  { session_key, openid } = r.data
          console.log(session_key)
          commit('setSessionKey', session_key)
          commit('setOpenId', openid)
          resolve(session_key)
        }
      })
      
    }
  }
}