import { useContext, useEffect, useRef, useState } from 'react'
import { Location, Routes, useLocation } from 'react-router-dom'
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar'

import { routes } from './config'
import { AppContext } from './contexts/appContext'
import { useScrollToTop, useSocket } from './hooks'
import { User } from './types/users.types'
import { setDarkModeToLS } from './utils/localStorage'

function Wrapper({ children }: { children: React.ReactNode }) {
    const location = useLocation()
    const { instance: socket, emit } = useSocket()

    const { user, setDarkMode, setDatingOnlineAmount } = useContext(AppContext)
    const [prevLocation, setPrevLocation] = useState<Location | null>(null)

    const LoadingBarRef = useRef<LoadingBarRef | null>(null)
    const isInDatingRoom = useRef<boolean>(false)
    const isInDatingCall = useRef<boolean>(false)

    useScrollToTop()

    useEffect(() => {
        setPrevLocation(location)
        LoadingBarRef.current?.continuousStart()
    }, [location])

    useEffect(() => {
        LoadingBarRef.current?.complete()
    }, [prevLocation])

    useEffect(() => {
        if (socket && socket.connected) {
            if (location.pathname.startsWith('/dating')) {
                setDarkModeToLS(true)
                setDarkMode(true)
                document.documentElement.classList.add('dark')

                if (!isInDatingRoom.current) {
                    isInDatingRoom.current = true
                    emit('join_dating_room')
                }
            } else if (isInDatingRoom.current) {
                isInDatingRoom.current = false
                emit('leave_dating_room')
            }

            if (!isInDatingCall.current && location.pathname === routes.datingCall) {
                isInDatingCall.current = true
                emit('find_call_user', { user_id: (user as User)._id })
            }

            if (isInDatingCall.current && location.pathname !== routes.datingCall) {
                isInDatingCall.current = false
                emit('leave_call', { user_id: (user as User)._id })
            }
        }
    }, [socket, location])

    useEffect(() => {
        if (socket && socket.connected) {
            const handleDatingRoomUpdated = (onlAmount: number) => {
                setDatingOnlineAmount(onlAmount)
            }

            socket.on('dating_room_updated', handleDatingRoomUpdated)

            return () => {
                socket.off('dating_room_updated', handleDatingRoomUpdated)
            }
        }
    }, [socket])

    return (
        <>
            <LoadingBar ref={LoadingBarRef} color='#8800ff' />
            <Routes>{children}</Routes>
        </>
    )
}

export default Wrapper
