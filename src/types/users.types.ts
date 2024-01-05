import { Sex, UserRole } from '~/constants/enums'
import { SuccessResponse } from './response.types'

export type User = {
    _id: string
    name: string
    email: string
    date_of_birth: string
    sex: Sex
    phone_number: string
    role: UserRole
    avatar: string
    created_at: string
    updated_at: string
}

export type TokenResponse = {
    access_token: string
    refresh_token: string
}

export type LoginResponse = SuccessResponse<TokenResponse>

export type RegisterResponse = SuccessResponse<TokenResponse>
