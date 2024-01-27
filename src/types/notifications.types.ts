import { NotificationType } from '~/constants/enums'
import { PaginationResponse, SuccessResponse } from './response.types'
import { User } from './users.types'
import { Post } from './posts.types'

export type Notification = {
    _id: string
    user_from: User | null
    user_to: User
    post: Post
    type: NotificationType
    is_read: boolean
    created_at: string
}

export type GetUnreadNotificationsResponse = SuccessResponse<{ notifications: Notification[]; total_unread: number }>

export type GetAllNotificationsResponse = SuccessResponse<PaginationResponse<{ notifications: Notification[] }>>

export type ReadAllNotificationsResponse = SuccessResponse
