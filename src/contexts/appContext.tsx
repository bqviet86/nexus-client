import { createContext, useEffect, useState } from 'react'

import { UserSaveClient } from '~/types/user.type'
import { getDarkModeFromLS, getUserFromLS, setDarkModeToLS } from '~/utils/localStorage'

interface AppContextInterface {
    user: UserSaveClient | null
    setUser: React.Dispatch<React.SetStateAction<UserSaveClient | null>>
    darkMode: boolean
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
}

const initialAppContext: AppContextInterface = {
    user: getUserFromLS(),
    setUser: () => null,
    darkMode: getDarkModeFromLS(),
    setDarkMode: () => null
}

const AppContext = createContext<AppContextInterface>(initialAppContext)

function AppProvider({
    children,
    defaultValue = initialAppContext
}: {
    children: React.ReactNode
    defaultValue?: AppContextInterface
}) {
    const [user, setUser] = useState<UserSaveClient | null>(defaultValue.user)
    const [darkMode, setDarkMode] = useState<boolean>(defaultValue.darkMode)

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode)
        setDarkModeToLS(darkMode)
    }, [darkMode])

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

export { AppContext }

export default AppProvider
