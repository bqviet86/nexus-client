import { PostType } from '~/constants/enums'
import { Media } from './medias.types'
import { PaginationResponse, SuccessResponse } from './response.types'
import { User } from './users.types'

export type Post = {
    _id: string
    user_id: string
    type: PostType
    content: string
    parent_id: string | null
    hashtags: string[]
    medias: Media[]
    created_at: string
    updated_at: string
}

export type Hashtag = {
    _id: string
    name: string
    created_at: string
}

export type PostDetail = {
    _id: string
    user: User
    type: PostType
    content: string
    parent_id: (Post & { parent_id: null }) | null
    hashtags: Hashtag[]
    medias: Media[]
    created_at: string
    updated_at: string
}

export type CreatePostResponse = SuccessResponse<Post>

export type GetNewsFeedResponse = SuccessResponse<PaginationResponse<{ posts: PostDetail[] }>>
