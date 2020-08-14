import request from '@/utils/request'
import CODE from "@/utils/common"

export function updateProduct(data) {
  return request({
    url: CODE.apiUrl() + '/uploadImg',
    method: 'post',
    data
  })
}

