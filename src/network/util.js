import {
  request
} from './request'
export function upload_(data) {
  return request({
    url:'/uploadPic',
    method:'POST',
    data: data,
    baseURL: 'http://43.139.29.193:8080'
  })
}