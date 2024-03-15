import axios, { AxiosRequestConfig } from 'axios'

import { FriendStatus, Sex } from '~/constants/enums'
import { SuccessResponse } from '~/types/response.types'
import {
    GetAllFriendRequestsResponse,
    GetAllFriendSuggestionsResponse,
    GetMeResponse,
    LoginResponse,
    RefreshTokenResponse,
    RegisterResponse
} from '~/types/users.types'
import http, { requestConfig } from '~/utils/http'

export type LoginReqData = {
    email: string
    password: string
}

export type RegisterReqData = {
    name: string
    email: string
    password: string
    confirm_password: string
    date_of_birth: string
    sex: Sex
    phone_number: string
}

export type ResponseFriendRequestReqData = {
    user_id: string
    status: FriendStatus
}

export const loginUser = (data: LoginReqData) => http.post<LoginResponse>('/users/login', data)

export const registerUser = (data: RegisterReqData) => http.post<RegisterResponse>('/users/register', data)

export const logoutUser = (refresh_token: string) => http.post<SuccessResponse>('/users/logout', { refresh_token })

export const refreshToken = (refresh_token: string) =>
    axios.post<RefreshTokenResponse>('/users/refresh-token', { refresh_token }, requestConfig as AxiosRequestConfig)

export const getMe = () => http.get<GetMeResponse>('/users/me')

export const sendFriendRequest = (user_id: string) => http.post<SuccessResponse>(`/users/friend/request/${user_id}`)

export const responseFriendRequest = ({ user_id, status }: ResponseFriendRequestReqData) =>
    http.patch<SuccessResponse>(`/users/friend/response/${user_id}`, { status })

export const getAllFriendRequests = () => http.get<GetAllFriendRequestsResponse>('/users/friend/request')

export const getAllFriendSuggestions = () => http.get<GetAllFriendSuggestionsResponse>('/users/friend/suggestion')
