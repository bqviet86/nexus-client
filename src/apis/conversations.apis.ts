import { GetAllConversationsResponse, GetConversationResponse } from '~/types/conversations.types'
import http from '~/utils/http'

export type GetConversationReqData = {
    receiver_id: string
    page: number
    limit: number
}

export const getAllConversations = () => http.get<GetAllConversationsResponse>('/conversations')

export const getConversation = ({ receiver_id, page, limit }: GetConversationReqData) =>
    http.get<GetConversationResponse>(`/conversations/receivers/${receiver_id}`, {
        params: { page, limit }
    })
