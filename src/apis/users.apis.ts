import { FriendStatus } from '~/constants/enums'
import { SuccessResponse } from '~/types/response.types'
import {
    GetAllFriendRequestsResponse,
    GetAllFriendSuggestionsResponse,
    GetAllFriendsResponse,
    GetAllStatsResponse,
    GetAllUsersResponse,
    GetMeResponse,
    GetProfileResponse,
    LoginResponse,
    RefreshTokenResponse,
    RegisterResponse,
    UpdateMyAvatarResponse,
    UpdateMyProfileResponse,
    User
} from '~/types/users.types'
import http from '~/utils/http'

export type LoginReqData = {
    email: string
    password: string
}

export type RegisterReqData = Pick<User, 'name' | 'email' | 'date_of_birth' | 'sex' | 'phone_number'> & {
    password: string
    confirm_password: string
}

export type UpdateMyProfileReqData = Partial<Pick<User, 'name' | 'email' | 'date_of_birth' | 'sex' | 'phone_number'>>

export type ResponseFriendRequestReqData = {
    user_id: string
    status: FriendStatus
}

export type GetAllUsersReqData = {
    name?: string
    is_active?: boolean
    page: number
    limit: number
}

export type UpdateActiveStatusReqData = {
    user_id: string
    is_active: boolean
}

export const loginUser = (data: LoginReqData) => http.post<LoginResponse>('/users/login', data)

export const registerUser = (data: RegisterReqData) => http.post<RegisterResponse>('/users/register', data)

export const logoutUser = (refresh_token: string) => http.post<SuccessResponse>('/users/logout', { refresh_token })

export const refreshToken = (refresh_token: string) =>
    http.post<RefreshTokenResponse>('/users/refresh-token', { refresh_token })

export const getMe = () => http.get<GetMeResponse>('/users/me')

export const updateMyAvatar = (data: FormData) => http.patch<UpdateMyAvatarResponse>('/users/update-avatar', data)

export const updateMyProfile = (data: UpdateMyProfileReqData) => http.patch<UpdateMyProfileResponse>('/users/me', data)

export const sendFriendRequest = (user_id: string) => http.post<SuccessResponse>(`/users/friend/request/${user_id}`)

export const responseFriendRequest = ({ user_id, status }: ResponseFriendRequestReqData) =>
    http.patch<SuccessResponse>(`/users/friend/response/${user_id}`, { status })

export const cancelFriendRequest = (user_id: string) => http.delete<SuccessResponse>(`/users/friend/request/${user_id}`)

export const getAllFriendRequests = () => http.get<GetAllFriendRequestsResponse>('/users/friend/request')

export const getAllFriendSuggestions = () => http.get<GetAllFriendSuggestionsResponse>('/users/friend/suggestion')

export const getProfile = (profile_id: string) => http.get<GetProfileResponse>(`/users/${profile_id}`)

export const getAllFriends = (user_id: string) => http.get<GetAllFriendsResponse>(`/users/friend/all/${user_id}`)

export const getAllStats = () => http.get<GetAllStatsResponse>('/users/admin/stats')

export const getAllUsers = ({ name, is_active, page, limit }: GetAllUsersReqData) =>
    http.get<GetAllUsersResponse>('/users/admin/all-users', { params: { name, is_active, page, limit } })

export const updateActiveStatus = ({ user_id, is_active }: UpdateActiveStatusReqData) =>
    http.patch<SuccessResponse>(`/users/admin/update-active-status/${user_id}`, { is_active })
