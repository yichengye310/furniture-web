import request from "@/utils/request";
import CODE from "@/utils/common";

export function getMadeToOrderList(query) {
  return request({
    url: CODE.apiUrl()+'/orderManage/getMadeToOrderList', // 定制管理列表
    method: 'get',
    params:query
  })
}

export function deleteMadeToOrder(query) {
  return request({
    url: CODE.apiUrl()+'/orderManage/deleteMadeToOreder', // 定制管理列表
    method: 'get',
    params:query
  })
}
