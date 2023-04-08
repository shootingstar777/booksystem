import {request} from './request'
export function  getTags_(data){
  return request({
    url: 'tag/getTags',
    params:data
  })
}