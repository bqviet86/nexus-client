import { FriendStatus, Sex, UserRole } from '~/constants/enums'
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

export type Friend = {
    _id: string
    user_from: User
    user_to: User
    status: FriendStatus
    created_at: string
    updated_at: string
}

export type TokenResponse = {
    access_token: string
    refresh_token: string
}

export type AuthResponse = {
    user: User
    token: TokenResponse
}

export type LoginResponse = SuccessResponse<AuthResponse>

export type RegisterResponse = SuccessResponse<AuthResponse>

export type LogoutResponse = SuccessResponse

export type RefreshTokenResponse = SuccessResponse<TokenResponse>

export type GetMeResponse = SuccessResponse<User>

export type SendFriendRequestResponse = SuccessResponse

export type ResponseFriendRequestResponse = SuccessResponse
