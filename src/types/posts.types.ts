import { PostType } from '~/constants/enums'
import { Media } from './medias.types'
import { SuccessResponse } from './response.types'

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

export type CreatePostResponse = SuccessResponse<Post>
