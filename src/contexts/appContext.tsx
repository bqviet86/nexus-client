import { createContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

import { TokenResponse, User } from '~/types/users.types'
import { DatingProfile } from '~/types/datingUsers.types'
import { listenEvent } from '~/utils/event'
import { getDarkModeFromLS, getDatingProfileFromLS, getTokenFromLS, getUserFromLS } from '~/utils/localStorage'

type EmitEvent = {
    event: string
    args: any[]
}

type AppContextType = {
    user: User | null
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    token: TokenResponse | null
    setToken: React.Dispatch<React.SetStateAction<TokenResponse | null>>
    darkMode: boolean
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
    socket: Socket | null
    setSocket: React.Dispatch<React.SetStateAction<Socket | null>>
    emitEvents: EmitEvent[]
    setEmitEvents: React.Dispatch<React.SetStateAction<EmitEvent[]>>
    datingProfile: DatingProfile | null | undefined
    setDatingProfile: React.Dispatch<React.SetStateAction<DatingProfile | null | undefined>>
}

const initialAppContext: AppContextType = {
    user: getUserFromLS(),
    setUser: () => {},
    token: getTokenFromLS(),
    setToken: () => {},
    darkMode: Boolean(getDarkModeFromLS()),
    setDarkMode: () => {},
    socket: null,
    setSocket: () => {},
    emitEvents: [],
    setEmitEvents: () => {},
    datingProfile: getDatingProfileFromLS() ?? undefined,
    setDatingProfile: () => {}
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
    const [token, setToken] = useState<TokenResponse | null>(defaultValue.token)
    const [darkMode, setDarkMode] = useState<boolean>(defaultValue.darkMode)
    const [socket, setSocket] = useState<Socket | null>(defaultValue.socket)
    const [emitEvents, setEmitEvents] = useState<EmitEvent[]>(defaultValue.emitEvents)
    const [datingProfile, setDatingProfile] = useState<DatingProfile | null | undefined>(defaultValue.datingProfile)

    useEffect(() => {
        const remove = listenEvent<TokenResponse>('refresh-token-success', ({ detail }) =>
            setToken(detail as TokenResponse)
        )
        return remove
    }, [])

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode)
    }, [])

    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                token,
                setToken,
                darkMode,
                setDarkMode,
                socket,
                setSocket,
                emitEvents,
                setEmitEvents,
                datingProfile,
                setDatingProfile
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider
