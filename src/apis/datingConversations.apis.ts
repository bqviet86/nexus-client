import { GetAllDatingConversationsResponse, GetDatingConversationResponse } from '~/types/datingConversations.types'
import http from '~/utils/http'

export type GetDatingConversationReqData = {
    receiver_id: string
    page: number
    limit: number
}

export const getAllDatingConversations = () => http.get<GetAllDatingConversationsResponse>('/dating-conversations')

export const getDatingConversation = ({ receiver_id, page, limit }: GetDatingConversationReqData) =>
    http.get<GetDatingConversationResponse>(`/dating-conversations/receivers/${receiver_id}`, {
        params: { page, limit }
    })
