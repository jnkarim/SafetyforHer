import api from './axios'

export const getPosts = async (params = {}) => {
  const res = await api.get('/posts', { params })
  return res.data
}

export const getPost = async (id) => {
  const res = await api.get(`/posts/${id}`)
  return res.data
}

export const createPost = async (data) => {
  const res = await api.post('/posts', data)
  return res.data
}

export const upvotePost = async (id) => {
  const res = await api.patch(`/posts/${id}/upvote`)
  return res.data
}

export const addComment = async (postId, content) => {
  const res = await api.post(`/posts/${postId}/comments`, { content })
  return res.data
}

export const upvoteComment = async (postId, commentId) => {
  const res = await api.patch(`/posts/${postId}/comments/${commentId}/upvote`)
  return res.data
}

export const deletePost = async (id) => {
  const res = await api.delete(`/posts/${id}`)
  return res.data
}

export const flagPost = async (id) => {
  const res = await api.patch(`/posts/${id}/flag`)
  return res.data
}