import request from '@/utils/request'
import CODE from "@/utils/common"

export function productLimitedTimeListByPage(query) {
  return request({
    url: CODE.apiUrl() + '/productLimitedTime/productLimitedTimeListByPage',//分页查询
    method: 'get',
    params: query
  })
}

export function productLimitedTimeAdd(data) {
  return request({
    url: CODE.apiUrl() + '/productLimitedTime/add',//添加限时抢购
    method: 'post',
    data
  })
}
export function productLimitedTimeDelete(data) {
  return request({
    url: CODE.apiUrl() + '/productLimitedTime/delete',//添加限时抢购
    method: 'post',
    data
  })
}


export function getCouponList(query) {
  return request({
    url: CODE.apiUrl() + '/coupon/getCouponList',//添加限时抢购
    method: 'get',
    params: query
  })
}

export function addCoupon(data) {
  return request({
    url: CODE.apiUrl() + '/coupon/createCouponModel',//添加限时抢购
    method: 'post',
    data
  })
}

export function updateCoupon(data) {
  return request({
    url: CODE.apiUrl() + '/coupon/updateCoupon',//添加限时抢购
    method: 'post',
    data
  })
}

export function terminateCoupon(query) {
  return request({
    url: CODE.apiUrl() + '/coupon/terminateCoupon',//添加限时抢购
    method: 'get',
    params: query
  })
}

export function getCouponDetail(query) {
  return request({
    url: CODE.apiUrl() + '/coupon/getCouponInfo',//添加限时抢购
    method: 'get',
    params: query
  })
}


