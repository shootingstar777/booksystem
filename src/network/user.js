
import {
  request
} from './request'
export function login_(data) {
  return request({
    url: '/user/login',
    method: 'POST',
    data: data
  })
}

export function register_(data) {
  return request({
    url: 'user/register',
    method: 'POST',
    data: data
  })
}
export function checkUserName_(data){
  return request({
    url: 'user/checkUserName',
    params:data
  })
}
export function edit_(data) {
  return request({
    url: 'user/edit',
    method: 'POST',
    data: data
  })
}
export function getUserInfo_(data) {
  return request({
    url: 'user/getUserInfo',
    params: data
  })
}