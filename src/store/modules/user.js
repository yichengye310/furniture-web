import { login } from '@/api/account'
import { getToken, removeToken, setToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import Cookies from 'js-cookie'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    // return new Promise(resolve => {
    //   commit('SET_TOKEN', 'admin-token')
    //   setToken('admin-token')
    //   resolve()
    // })

    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ loginAccount: username.trim(), loginPassword: password }).then(response => {
        const { data } = response
        console.log( '登录', response)
        commit('SET_TOKEN', data.token)
        commit('SET_ROLES', data.businessRole.permissionContent != null ? JSON.parse(data.businessRole.permissionContent) : '')
        commit('SET_NAME', data.userName)
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        commit('SET_INTRODUCTION', data.businessRole.roleName)
        setToken(data.token)
        var permission = []
        if (data.businessRole.permissionContent != undefined) {

          var permissionContent = JSON.parse(data.businessRole.permissionContent)
          permission = permissionContent.permission
        }
        data.businessRole.permissionContent = undefined
        Cookies.set('userInfo', JSON.stringify(data))
        // Cookies.set('permission', JSON.stringify(permission))
        sessionStorage.setItem('permission', JSON.stringify(permission))
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise(resolve => {
      console.log('userInfo')
      const userInfo = JSON.parse(Cookies.get('userInfo'))
      console.log(userInfo)
      // const permission = JSON.parse(Cookies.get('permission'))
      const permission = JSON.parse(sessionStorage.getItem('permission'))
      console.log(permission)
      var adminToken = {
        roles: permission,
        introduction: userInfo.businessRole.roleName,
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: userInfo.userName
      }
      commit('SET_ROLES', permission)
      commit('SET_NAME', userInfo.userName)
      commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
      commit('SET_INTRODUCTION', userInfo.businessRole.roleName)
      resolve(adminToken)
    })

    // return new Promise((resolve, reject) => {
    //   getInfo(state.token).then(response => {
    //     const { data } = response
    //
    //     if (!data) {
    //       reject('Verification failed, please Login again.')
    //     }
    //
    //     const { roles, name, avatar, introduction } = data
    //
    //     // roles must be a non-empty array
    //     if (!roles || roles.length <= 0) {
    //       reject('getInfo: roles must be a non-null array!')
    //     }
    //
    //     commit('SET_ROLES', roles)
    //     commit('SET_NAME', name)
    //     commit('SET_AVATAR', avatar)
    //     commit('SET_INTRODUCTION', introduction)
    //     resolve(data)
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
    removeToken()
    resetRouter()
    dispatch('tagsView/delAllViews', null, { root: true })
    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     commit('SET_TOKEN', '')
    //     commit('SET_ROLES', [])
    //     removeToken()
    //     resetRouter()
    //
    //     // reset visited views and cached views
    //     // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
    //     dispatch('tagsView/delAllViews', null, { root: true })
    //
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
