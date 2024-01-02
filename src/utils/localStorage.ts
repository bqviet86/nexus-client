import { UserSaveClient } from '~/types/user.type'

export const getUserFromLS = () => {
    const result = localStorage.getItem('user')
    return result ? (JSON.parse(result) as UserSaveClient) : null
}

export const setUserToLS = (user: UserSaveClient) => {
    localStorage.setItem('user', JSON.stringify(user))
}

export const getDarkModeFromLS = () => {
    const result = localStorage.getItem('darkMode')
    return result ? (JSON.parse(result) as boolean) : false
}

export const setDarkModeToLS = (darkMode: boolean) => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
}
