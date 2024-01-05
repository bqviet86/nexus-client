import axios from 'axios'

import { Sex } from '~/constants/enums'
import { LoginResponse, RegisterResponse } from '~/types/users.types'

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

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

export const loginUser = (data: LoginReqData) => http.post<LoginResponse>('/users/login', data)

export const registerUser = (data: RegisterReqData) => http.post<RegisterResponse>('/users/register', data)
