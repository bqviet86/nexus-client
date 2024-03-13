import { SuccessResponse } from '~/types/response.types'
import http from '~/utils/http'

export const likePost = (post_id: string) => http.post<SuccessResponse>('/likes', { post_id })

export const unlikePost = (post_id: string) => http.delete<SuccessResponse>(`/likes/${post_id}`)
