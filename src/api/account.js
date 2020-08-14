import request from '@/utils/request'
import CODE from "@/utils/common"

export function login(data) {
  return request({
    url: CODE.apiUrl() +'/businessUser/login',
    method: 'post',
    params: data
  })
}

export function userListByPage(query) {
  return request({
    url: CODE.apiUrl() + '/businessUser/userListByPage',
    method: 'get',
    params: query
  })
}

export function addUser(data) {
  return request({
    url: CODE.apiUrl() + '/businessUser/addUser',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: CODE.apiUrl() + '/businessUser/updateUser',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: CODE.apiUrl() + '/businessUser/deleteUser',
    method: 'post',
    params: data
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
