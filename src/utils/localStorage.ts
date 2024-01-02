import { UserSaveClient } from '~/types/user.type'

export const getUserFromLS = () => {
    const result = localStorage.getItem('user')
    return result ? (JSON.parse(result) as UserSaveClient) : null
}
