import {
  request
} from './request'
export function addPost_(data) {
  return request({
    url: 'post/add',
    method:'POST',
    data: data
  })
}
export function auditPost_(data) {
  return request({
    url: 'post/audit',
    method:'POST',
    data: data
  })
}
export function deletePost_(data) {
  return request({
    url: 'post/delete',
    method:'POST',
    data: data
  })
}
export function likePost_(data) {
  return request({
    url: 'post/like',
    method:'POST',
    data: data
  })
}
export function selectPost_(params,data) {
  return request({
    url: 'post/select',
    method:'POST',
    params:params,
    data: data
  })
}
export function unAuditPagePost_(params) {
  return request({
    url: 'post/unAuditPage',
    params:params,
  })
}