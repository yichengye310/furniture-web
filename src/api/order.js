import request from '@/utils/request'
import CODE from "@/utils/common"
export function getOrderByState(query) {
  return request({
    url: CODE.apiUrl()+'/orderManage/getOrderByState', // 订单列表
    method: 'get',
    params:query
  })
}



/**
 * orderID
 * @param query
 * @returns {AxiosPromise}
 */
export function getOrderByID(query) {
  return request({
    url: CODE.apiUrl()+'/orderManage/getOrderByID', // 订单详情
    method: 'get',
    params: query
  })
}
/**
 * orderID
 * @param query
 * @returns {AxiosPromise}
 */
export function deleteOrderByID(query) {
  return request({
    url: CODE.apiUrl()+'/orderManage/deleteOrderByID', // 订单删除
    method: 'get',
    params: query
  })
}
/**
 * orderID
 * @param query
 * @returns {AxiosPromise}
 */
export function setOrderFinishedByID(query) {
  return request({
    url: CODE.apiUrl()+'/orderManage/setOrderFinishedByID', // 订单已处理
    method: 'get',
    params: query
  })
}

/**
 *
 *
{
 "orderID" : 132,
 "orderPaidTime" : 1586001600000,
 "productID" : 84,
 "productName" : "6D透气面料天然环保乳胶床垫无框独立弹簧护脊床垫厚",
 "productTitleImage" : "https://ylwhcm.oss-cn-shanghai.aliyuncs.com/ylwhcm/amms/images/main/20200327142119803bojue.png",
 "productStandardID" : 12,
 "productStandard" : "1.2*2.4米",
 "productColourID" : 32,
 "productColour" : "红色",
 "productNumber" : 3,
 "userRemark" : "XX用，要保证质量",
 "receiverName" : "王大小",
 "phoneNum" : "13356569874",
 "province" : "甘肃省",
 "city" : "天水市",
 "county" : "麦积区",
 "receiveAddress" : "XX路201号",
 "deliverName" : "路人甲",
 "deliverPhoneNum" : "19900069874",
 "deliverAdd" : "江苏省苏州市XX区XX路123号",
 "expressCompany" : "中通快递",
 "expressNum" : "3207215934622000123"
}
 * @param data
 * @returns {AxiosPromise}
 */
export function delivery(data) {
  return request({
    url: CODE.apiUrl()+'/orderManage/delivery',// 订单发货
    method: 'post',
    data
  })
}


