import { createContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

import { UserRole } from '~/constants/enums'
import { TokenResponse } from '~/types/users.types'
import { TokenPayload } from '~/types/jwt.types'
import { getDarkModeFromLS, getUserFromLS, setDarkModeToLS, setUserToLS } from '~/utils/localStorage'

export type UserSaveClient = {
    user_id: string
    role: UserRole
    access_token: string
    refresh_token: string
}

type AppContextType = {
    user: UserSaveClient | null
    setUser: (tokenResponse: TokenResponse) => void
    darkMode: boolean
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
}

const initialAppContext: AppContextType = {
    user: getUserFromLS(),
    setUser: () => {},
    darkMode: getDarkModeFromLS(),
    setDarkMode: () => {}
}

export const AppContext = createContext<AppContextType>(initialAppContext)

function AppProvider({
    children,
    defaultValue = initialAppContext
}: {
    children: React.ReactNode
    defaultValue?: AppContextType
}) {
    const [user, setUser] = useState<UserSaveClient | null>(defaultValue.user)
    const [darkMode, setDarkMode] = useState<boolean>(defaultValue.darkMode)

    const setUserByToken = ({ access_token, refresh_token }: TokenResponse) => {
        const { user_id, role } = jwtDecode<TokenPayload>(access_token)

        setUser({
            user_id,
            role,
            access_token,
            refresh_token
        })
    }

    useEffect(() => {
        if (user) {
            setUserToLS(user)
        }
    }, [user])

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode)
        setDarkModeToLS(darkMode)
    }, [darkMode])

    return (
        <AppContext.Provider
            value={{
                user,
                setUser: setUserByToken,
                darkMode,
                setDarkMode
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider
