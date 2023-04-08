import {
  request
} from './request'
export function getPostComment_(params,data) {
  return request({
    url: 'postComment/get',
    method:'POST',
    params: params,
    data:data
  })
}
export function addPostComment_(data) {
  return request({
    url: 'postComment/add',
    method:'POST',
    data:data
  })
}
export function likePostComment_(data) {
  return request({
    url: 'postComment/like',
    method:'POST',
    data:data
  })
}
export function deletePostComment_(data) {
  return request({
    url: 'postComment/delete',
    method:'POST',
    data:data
  })
}