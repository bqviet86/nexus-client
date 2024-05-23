import { FriendStatus, MBTIType, Sex, UserRole } from '~/constants/enums'
import { PaginationResponse, SuccessResponse } from './response.types'
import { Media } from './medias.types'
import { ConstructiveQuestion } from './constructiveQuestions.types'

export type User = {
    _id: string
    name: string
    email: string
    date_of_birth: string
    sex: Sex
    phone_number: string
    role: UserRole
    avatar: string
    is_active: boolean
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

export type Friend = {
    _id: string
    user_from: User
    user_to: User
    status: FriendStatus
    created_at: string
    updated_at: string
}

export type Profile = User & {
    friends: User[]
    friend_count: number
    is_friend: boolean
    is_sending: boolean
    is_receiving: boolean
    is_declined: boolean
    images: Media[]
}

export type Stats = {
    onl_amount: number
    posts_amount: number
    calling_amount: number
    avg_start_rating: number
    top_mbti_types: { mbti_type: MBTIType; amount: number }[]
    top_constructive_questions: (ConstructiveQuestion & { amount: number })[]
    top_review_texts: { review_text: string; amount: number }[]
}

export type UserTableType = Pick<User, 'name' | 'email' | 'date_of_birth'> & {
    key: string
    sex: string
    avatar: Pick<User, '_id' | 'name' | 'avatar'>
    action: Pick<User, '_id' | 'name' | 'is_active'>
}

export type LoginResponse = SuccessResponse<AuthResponse>

export type RegisterResponse = SuccessResponse<AuthResponse>

export type RefreshTokenResponse = SuccessResponse<TokenResponse>

export type GetMeResponse = SuccessResponse<User>

export type UpdateMyAvatarResponse = SuccessResponse<Media>

export type UpdateMyProfileResponse = SuccessResponse<User>

export type GetAllFriendRequestsResponse = SuccessResponse<Friend[]>

export type GetAllFriendSuggestionsResponse = SuccessResponse<User[]>

export type GetProfileResponse = SuccessResponse<Profile>

export type GetAllFriendsResponse = SuccessResponse<User[]>

export type GetAllStatsResponse = SuccessResponse<Stats>

export type GetAllUsersResponse = SuccessResponse<PaginationResponse<{ users: User[] }>>
