import { Media } from './medias.types'
import { SuccessResponse } from './response.types'
import { User } from './users.types'

export type Comment = {
    _id: string
    user: User
    post_id: string
    parent_id: string | null
    content: string
    media: Media | null
    created_at: string
    updated_at: string
}

export type CommentWithChildrenCount = Comment & {
    children_count: number
}

export type CommentDetail = Comment & {
    children: Comment[]
    children_count: number
}

export type GetCommentsOfPostResponse = SuccessResponse<CommentWithChildrenCount[]>

export type GetRepliesOfCommentResponse = SuccessResponse<Comment[]>

export type UpdateCommentResponse = SuccessResponse<Comment>

export type DeleteCommentResponse = SuccessResponse
