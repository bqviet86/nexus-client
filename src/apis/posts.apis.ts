import { PostType } from '~/constants/enums'
import { Media } from '~/types/medias.types'
import { CreatePostResponse, GetNewsFeedResponse } from '~/types/posts.types'
import http from '~/utils/http'

export type CreatePostReqData = {
    type: PostType
    content: string
    parent_id: string | null
    hashtags: string[]
    medias: Media[]
}

export type GetNewsFeedReqQuery = {
    page: number
    limit: number
}

export const createPost = (data: CreatePostReqData) => http.post<CreatePostResponse>('/posts', data)

export const getNewsFeed = (query: GetNewsFeedReqQuery) =>
    http.get<GetNewsFeedResponse>('/posts/news-feed', { params: query })
