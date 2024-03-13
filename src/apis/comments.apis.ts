import { GetCommentsOfPostResponse, GetRepliesOfCommentResponse, UpdateCommentResponse } from '~/types/comments.types'
import { Media } from '~/types/medias.types'
import { SuccessResponse } from '~/types/response.types'
import http from '~/utils/http'

export type UpdateCommentReqData = {
    comment_id: string
    content: string
    media: Media | null
}

export const getCommentsOfPost = (post_id: string) => http.get<GetCommentsOfPostResponse>(`/comments/${post_id}`)

export const getRepliesOfComment = (comment_id: string) =>
    http.get<GetRepliesOfCommentResponse>(`/comments/replies/${comment_id}`)

export const updateComment = ({ comment_id, content, media }: UpdateCommentReqData) =>
    http.patch<UpdateCommentResponse>(`/comments/${comment_id}`, { content, media })

export const deleteComment = (comment_id: string) => http.delete<SuccessResponse>(`/comments/${comment_id}`)
