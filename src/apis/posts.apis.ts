import { PostType } from '~/constants/enums'
import { Media } from '~/types/medias.types'
import { CreatePostResponse, GetPostListResponse, UpdatePostResponse } from '~/types/posts.types'
import { SuccessResponse } from '~/types/response.types'
import http from '~/utils/http'

export type CreatePostReqData = {
    type: PostType
    content: string
    parent_id: string | null
    hashtags: string[]
    medias: Media[]
}

export type GetPostListReqQuery = {
    page: number
    limit: number
}

export type UpdatePostReqData = {
    content: string
    hashtags: string[]
    medias: Media[]
}

export const createPost = (data: CreatePostReqData) => http.post<CreatePostResponse>('/posts', data)

export const getNewsFeed = (query: GetPostListReqQuery) =>
    http.get<GetPostListResponse>('/posts/news-feed', { params: query })

export const getProfilePosts = (profile_id: string, query: GetPostListReqQuery) =>
    http.get<GetPostListResponse>(`/posts/profile/${profile_id}`, { params: query })

export const updatePost = (post_id: string, data: UpdatePostReqData) =>
    http.patch<UpdatePostResponse>(`/posts/${post_id}`, data)

export const deletePost = (post_id: string) => http.delete<SuccessResponse>(`/posts/${post_id}`)
