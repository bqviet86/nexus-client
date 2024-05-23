import { PostType } from '~/constants/enums'
import { Media } from './medias.types'
import { PaginationResponse, SuccessResponse } from './response.types'
import { User } from './users.types'

export type Hashtag = {
    _id: string
    name: string
    created_at: string
}

export type Post = {
    _id: string
    user: User
    type: PostType
    content: string
    parent_post: ParentPost | null
    hashtags: Hashtag[]
    medias: Media[]
    like_count: number
    comment_count: number
    share_count: number
    is_liked: boolean
    created_at: string
    updated_at: string
}

export type ParentPost = Omit<Post, 'parent_post' | 'like_count' | 'comment_count' | 'share_count' | 'is_liked'>

export type CreatePostResponse = SuccessResponse<Post>

export type GetPostListResponse = SuccessResponse<PaginationResponse<{ posts: Post[] }>>

export type UpdatePostResponse = SuccessResponse<Post>
