import { createContext, useEffect, useState } from 'react'

import { User } from '~/types/users.types'
import { getDarkModeFromLS, getUserFromLS } from '~/utils/localStorage'

type AppContextType = {
    user: User | null
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    darkMode: boolean
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
}

const initialAppContext: AppContextType = {
    user: getUserFromLS(),
    setUser: () => {},
    darkMode: Boolean(getDarkModeFromLS()),
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
    const [user, setUser] = useState<User | null>(defaultValue.user)
    const [darkMode, setDarkMode] = useState<boolean>(defaultValue.darkMode)

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode)
    }, [])

    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                darkMode,
                setDarkMode
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider
