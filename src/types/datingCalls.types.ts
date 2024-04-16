import { DatingProfile } from './datingUsers.types'
import { SuccessResponse } from './response.types'

export type DatingCallUser = DatingProfile & {
    review_texts: string[]
    stars_rating: number
}

export type DatingCall = {
    _id: string
    first_user: DatingCallUser
    second_user: DatingCallUser
    duration: number
    compatibility: number | null
    created_at: string
    updated_at: string
}

export type CreateDatingCallResponse = SuccessResponse<DatingCall>

export type GetAllDatingCallsResponse = SuccessResponse<DatingCall[]>
