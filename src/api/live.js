import request from '@/utils/request'
import CODE from '@/utils/common'

export function updateLivePermission(data) {
  return request({
    url: CODE.apiUrl() + '/user/updateLivePermission',
    method: 'get',
    params: data
  })
}

export function getLiveList(data) {
  return request({
    url: CODE.apiUrl() + '/live/liveList',
    method: 'get',
    params: data
  })
}

export function getLiveProducts(data) {
  return request({
    url: CODE.apiUrl() + '/live/liveProducts',
    method: 'get',
    params: data
  })
}
