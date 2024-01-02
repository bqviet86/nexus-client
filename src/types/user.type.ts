import { Sex, UserRole } from '~/constants/enums'

export interface UserSaveClient {
    user_id: string
    role: UserRole
    access_token: string
    refresh_token: string
}

export interface User {
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
