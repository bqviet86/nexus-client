import { createContext, useState } from 'react'

import { UserSaveClient } from '~/types/user.type'
import { getUserFromLS } from '~/utils/localStorage'

interface AppContextInterface {
    user: UserSaveClient | null
    setUser: React.Dispatch<React.SetStateAction<UserSaveClient | null>>
}

const initialAppContext: AppContextInterface = {
    user: getUserFromLS(),
    setUser: () => null
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

    return (
        <AppContext.Provider
            value={{
                user,
                setUser
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export { AppContext }

export default AppProvider
