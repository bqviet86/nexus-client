import { createContext, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { Socket } from 'socket.io-client'

import { TokenResponse, User } from '~/types/users.types'
import { Post } from '~/types/posts.types'
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
    posts: Post[]
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>
    onViewVideos: HTMLVideoElement[]
    setOnViewVideos: React.Dispatch<React.SetStateAction<HTMLVideoElement[]>>
    playingVideo: HTMLVideoElement | null
    setPlayingVideo: React.Dispatch<React.SetStateAction<HTMLVideoElement | null>>
    isUserPaused: boolean
    setIsUserPaused: React.Dispatch<React.SetStateAction<boolean>>
    socket: Socket | null
    setSocket: React.Dispatch<React.SetStateAction<Socket | null>>
    emitEvents: EmitEvent[]
    setEmitEvents: React.Dispatch<React.SetStateAction<EmitEvent[]>>
    datingProfile: DatingProfile | null | undefined
    setDatingProfile: React.Dispatch<React.SetStateAction<DatingProfile | null | undefined>>
    datingOnlineAmount: number
    setDatingOnlineAmount: React.Dispatch<React.SetStateAction<number>>
    stream: MediaStream | null
    setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>
}

const defaultFunction = () => {}
const initialAppContext: AppContextType = {
    user: getUserFromLS(),
    setUser: defaultFunction,
    token: getTokenFromLS(),
    setToken: defaultFunction,
    darkMode: Boolean(getDarkModeFromLS()),
    setDarkMode: defaultFunction,
    posts: [],
    setPosts: defaultFunction,
    onViewVideos: [],
    setOnViewVideos: defaultFunction,
    playingVideo: null,
    setPlayingVideo: defaultFunction,
    isUserPaused: true,
    setIsUserPaused: defaultFunction,
    socket: null,
    setSocket: defaultFunction,
    emitEvents: [],
    setEmitEvents: defaultFunction,
    datingProfile: getDatingProfileFromLS() ?? undefined,
    setDatingProfile: defaultFunction,
    datingOnlineAmount: 0,
    setDatingOnlineAmount: defaultFunction,
    stream: null,
    setStream: defaultFunction
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
    const [posts, setPosts] = useState<Post[]>(defaultValue.posts)
    const [onViewVideos, setOnViewVideos] = useState<HTMLVideoElement[]>(defaultValue.onViewVideos)
    const [playingVideo, setPlayingVideo] = useState<HTMLVideoElement | null>(defaultValue.playingVideo)
    const [isUserPaused, setIsUserPaused] = useState<boolean>(defaultValue.isUserPaused)
    const [socket, setSocket] = useState<Socket | null>(defaultValue.socket)
    const [emitEvents, setEmitEvents] = useState<EmitEvent[]>(defaultValue.emitEvents)
    const [datingProfile, setDatingProfile] = useState<DatingProfile | null | undefined>(defaultValue.datingProfile)
    const [datingOnlineAmount, setDatingOnlineAmount] = useState<number>(defaultValue.datingOnlineAmount)
    const [stream, setStream] = useState<MediaStream | null>(defaultValue.stream)

    useEffect(() => {
        const remove = listenEvent<TokenResponse>('refresh-token-success', ({ detail }) =>
            setToken(detail as TokenResponse)
        )
        return remove
    }, [])

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode)

        if (isMobile) {
            document.documentElement.classList.add('overflow-x-hidden')
        }
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
                posts,
                setPosts,
                onViewVideos,
                setOnViewVideos,
                playingVideo,
                setPlayingVideo,
                isUserPaused,
                setIsUserPaused,
                socket,
                setSocket,
                emitEvents,
                setEmitEvents,
                datingProfile,
                setDatingProfile,
                datingOnlineAmount,
                setDatingOnlineAmount,
                stream,
                setStream
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider
