import { DatingProfileDetail } from './datingUsers.types'
import { PaginationResponse, SuccessResponse } from './response.types'

export type DatingConversation = {
    _id: string
    sender: DatingProfileDetail
    receiver: DatingProfileDetail
    content: string
    created_at: string
    updated_at: string
}

export type GetAllDatingConversationsResponse = SuccessResponse<DatingConversation[]>

export type GetDatingConversationResponse = SuccessResponse<PaginationResponse<{ conversations: DatingConversation[] }>>
