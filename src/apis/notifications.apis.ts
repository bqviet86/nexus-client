import { NotificationTag } from '~/constants/enums'
import {
    DeleteNotificationResponse,
    GetAllNotificationsResponse,
    GetUnreadNotificationsResponse,
    UpdateAllNotificationsResponse,
    UpdateNotificationResponse
} from '~/types/notifications.types'
import http from '~/utils/http'

export type GetAllNotificationsReqQuery = {
    page: number
    limit: number
    tag?: NotificationTag
}

export type UpdateNotificationReqData = {
    notification_id: string
    is_read: boolean
}

export const getUnreadNotifications = () => http.get<GetUnreadNotificationsResponse>('/notifications/unread')

export const getAllNotifications = (query: GetAllNotificationsReqQuery) =>
    http.get<GetAllNotificationsResponse>('/notifications', { params: query })

export const updateNotification = ({ notification_id, is_read }: UpdateNotificationReqData) =>
    http.patch<UpdateNotificationResponse>(`/notifications/${notification_id}`, { is_read })

export const updateAllNotifications = (body: { is_read: boolean }) =>
    http.patch<UpdateAllNotificationsResponse>('/notifications', body)

export const deleteNotification = (notification_id: string) =>
    http.delete<DeleteNotificationResponse>(`/notifications/${notification_id}`)
