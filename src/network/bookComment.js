import {request} from './request'
export function like_(data) {
  return request({
    url: 'bookComment/like',
    method:'POST',
    data:data
  })
}

export function getComment_(params,data){
  return request({
    url: 'bookComment/get',
    method:'POST',
    params: params,
    data:data,
  })
}
export function addComment_(data) {
  return request({
    url: 'bookComment/add',
    method: 'POST',
    data: data
  })
}
export function audit_(data) {
  return request({
    url: 'bookComment/audit',
    method: 'POST',
    data: data
  })
}
export function delete_(data) {
  return request({
    url: 'bookComment/delete',
    method: 'POST',
    data: data
  })
}
export function unAuditPage(data) {
  return request({
    url: 'bookComment/unAuditPage',
    params: data,
  })
}