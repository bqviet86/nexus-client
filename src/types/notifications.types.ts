import { NotificationFriendAction, NotificationPostAction, NotificationType } from '~/constants/enums'
import { PaginationResponse, SuccessResponse } from './response.types'
import { Friend, User } from './users.types'
import { Post } from './posts.types'

export type NotificationAction = NotificationPostAction | NotificationFriendAction

export type NotificationPostPayload = {
    post: Post
}

export type NotificationFriendPayload = {
    friend: Friend
}

export type NotificationPayload = Partial<NotificationPostPayload & NotificationFriendPayload>

export type Notification = {
    _id: string
    user_from: User | null
    user_to: User
    type: NotificationType
    action: NotificationAction
    payload: NotificationPayload
    is_read: boolean
    created_at: string
    updated_at: string
}

export type GetUnreadNotificationsResponse = SuccessResponse<{ notifications: Notification[]; total_unread: number }>

export type GetAllNotificationsResponse = SuccessResponse<PaginationResponse<{ notifications: Notification[] }>>
