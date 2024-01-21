import axios, { AxiosRequestConfig } from 'axios'

import { Sex } from '~/constants/enums'
import {
    GetMeResponse,
    LoginResponse,
    LogoutResponse,
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

export const loginUser = (data: LoginReqData) => http.post<LoginResponse>('/users/login', data)

export const registerUser = (data: RegisterReqData) => http.post<RegisterResponse>('/users/register', data)

export const logoutUser = (refresh_token: string) => http.post<LogoutResponse>('/users/logout', { refresh_token })

export const refreshToken = (refresh_token: string) =>
    axios.post<RefreshTokenResponse>('/users/refresh-token', { refresh_token }, requestConfig as AxiosRequestConfig)

export const getMe = () => http.get<GetMeResponse>('/users/me')
