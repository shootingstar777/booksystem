import {
  request
} from './request'
export function getHotList_(data) {
  return request({
    url: 'book/getHotList',
    params: data
  })
}
export function getList_(data) {
  return request({
    url: 'book/getList',
    params: data
  })
}
export function getInfo_(data) {
  return request({
    url: 'book/getInfo',
    params: data
  })
}
export function selectList_(params,data) {
  return request({
    url: 'book/selectList',
    method:'POST',
    params:params,
    data: data
  })
}