import { TokenResponse, User } from '~/types/users.types'

export const getAccessTokenFromLS = () => {
    const result = localStorage.getItem('token')
    return result ? (JSON.parse(result) as TokenResponse).access_token : null
}

export const getRefreshTokenFromLS = () => {
    const result = localStorage.getItem('token')
    return result ? (JSON.parse(result) as TokenResponse).refresh_token : null
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
