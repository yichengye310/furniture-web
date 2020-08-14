import request from '@/utils/request'
import CODE from "@/utils/common"

export function getRoutes() {
  return request({
    url: CODE.apiUrl()+'/businessUser/roleList',
    method: 'get'
  })
}

export function getRoute(query) {
  return request({
    url: CODE.apiUrl()+'/businessUser/roleDetail',
    method: 'get',
    params: query
  })
}

export function addRole(data) {
  return request({
    url: CODE.apiUrl()+'/businessUser/addRole',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url:  CODE.apiUrl()+`/businessUser/updateRole`,
    method: 'post',
    data
  })
}

export function deleteRole(data) {
  return request({
    url:  CODE.apiUrl()+`/businessUser/deleteRole`,
    method: 'post',
    params: data
  })
}
