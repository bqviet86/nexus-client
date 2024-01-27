import { NotificationTag } from '~/constants/enums'
import {
    GetAllNotificationsResponse,
    GetUnreadNotificationsResponse,
    ReadAllNotificationsResponse
} from '~/types/notifications.types'
import http from '~/utils/http'

export type GetAllNotificationsReqQuery = {
    page: number
    limit: number
    tag?: NotificationTag
}

export const getUnreadNotifications = () => http.get<GetUnreadNotificationsResponse>('/notifications/unread')

export const getAllNotifications = (query: GetAllNotificationsReqQuery) =>
    http.get<GetAllNotificationsResponse>('/notifications', { params: query })

export const readAllNotifications = () => http.put<ReadAllNotificationsResponse>('/notifications/read-all')
