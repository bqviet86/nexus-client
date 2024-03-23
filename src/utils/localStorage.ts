import { DatingProfile } from '~/types/datingUsers.types'
import { TokenResponse, User } from '~/types/users.types'

export const getTokenFromLS = () => {
    const result = localStorage.getItem('token')
    return result ? (JSON.parse(result) as TokenResponse) : null
}

export const setTokenToLS = (token: TokenResponse) => {
    localStorage.setItem('token', JSON.stringify(token))
}

export const removeTokenFromLS = () => {
    localStorage.removeItem('token')
}

export const getUserFromLS = () => {
    const result = localStorage.getItem('user')
    return result ? (JSON.parse(result) as User) : null
}

export const setUserToLS = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user))
}

export const removeUserFromLS = () => {
    localStorage.removeItem('user')
}

export const getDarkModeFromLS = () => {
    const result = localStorage.getItem('darkMode')
    return result ? (JSON.parse(result) as boolean) : null
}

export const setDarkModeToLS = (darkMode: boolean) => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
}

export const getDatingProfileFromLS = () => {
    const result = localStorage.getItem('datingProfile')
    return result ? (JSON.parse(result) as DatingProfile) : null
}

export const setDatingProfileToLS = (datingProfile: DatingProfile) => {
    localStorage.setItem('datingProfile', JSON.stringify(datingProfile))
}

export const removeDatingProfileFromLS = () => {
    localStorage.removeItem('datingProfile')
}
