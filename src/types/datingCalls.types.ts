import { DatingProfile } from './datingUsers.types'
import { SuccessResponse } from './response.types'

export type DatingCall = {
    _id: string
    first_user: DatingProfile
    second_user: DatingProfile
    duration: number
    compatibility: number | null
    created_at: string
    updated_at: string
}

export type CreateDatingCallResponse = SuccessResponse<DatingCall>

export type GetAllDatingCallsResponse = SuccessResponse<DatingCall[]>
