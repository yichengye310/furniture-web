import request from '@/utils/request'
import CODE from "@/utils/common"
export function getProductListByPage(query) {
  return request({
    url: CODE.apiUrl()+'/product/productListByPage', // 产品列表
    method: 'get',
    params: query
  })
}
export function productDetail(query) {
  return request({
    url: CODE.apiUrl()+'/product/productDetail', // 产品详情
    method: 'get',
    params: query
  })
}

export function updateProduct(data) {
  return request({
    url: CODE.apiUrl()+'/product/update',
    method: 'post',
    data
  })
}


export function updateProductImg(data) {
  return request({
    url: CODE.apiUrl()+'/product/updateImg',
    method: 'post',
    data
  })
}


export function updateProductStandards(data) {
  return request({
    url: CODE.apiUrl()+'/product/updateStandards',
    method: 'post',
    data
  })
}

export function addProduct(data) {
  return request({
    url: CODE.apiUrl()+'/product/add',
    method: 'post',
    data
  })
}



export function commonImageListByPage(query) {
  return request({
    url: CODE.apiUrl()+'/product/commonImageListByPage', // 热门活动列表
    method: 'get',
    params: query
  })
}
export function deleteCommonImg(data) {
  return request({
    url: CODE.apiUrl()+'/product/deleteCommonImg', // 删除热门活动
    method: 'post',
    params: data
  })
}
export function updateCommonImg(data) {
  return request({
    url: CODE.apiUrl()+'/product/updateCommonImg', // 编辑热门活动
    method: 'post',
    data
  })
}
export function addCommonImg(data) {
  return request({
    url: CODE.apiUrl()+'/product/addCommonImg', // 添加热门活动
    method: 'post',
    data
  })
}
