
import request from '@/utils/request'
import CODE from "@/utils/common"

/**
 *
 * @param query
 * @returns {AxiosPromise}
 */
export function queryUserByPage(query) {
  return request({
    url: CODE.apiUrl() + '/user/queryUserByPage',
    method: 'get',
    params: query
  })
}

export function updateUserType(query) {
  return request({
    url: CODE.apiUrl() + '/user/updateUserType',
    method: 'get',
    params: query
  })
}

