import { PaginationResponse, SuccessResponse } from './response.types'
import { User } from './users.types'

export type Conversation = {
    _id: string
    sender: User
    receiver: User
    content: string
    created_at: string
    updated_at: string
}

export type GetAllConversationsResponse = SuccessResponse<Conversation[]>

export type GetConversationResponse = SuccessResponse<PaginationResponse<{ conversations: Conversation[] }>>
