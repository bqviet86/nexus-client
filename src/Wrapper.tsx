import { useContext, useEffect, useRef, useState } from 'react'
import { Location, Routes, useLocation } from 'react-router-dom'
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar'

import { AppContext } from './contexts/appContext'
import { useScrollToTop, useSocket } from './hooks'

function Wrapper({ children }: { children: React.ReactNode }) {
    const location = useLocation()
    const { instance: socket, emit } = useSocket()

    const { datingProfile, setDatingOnlineAmount } = useContext(AppContext)
    const [prevLocation, setPrevLocation] = useState<Location | null>(null)

    const LoadingBarRef = useRef<LoadingBarRef | null>(null)
    const isInDatingRoom = useRef<boolean>(false)

    useScrollToTop()

    useEffect(() => {
        setPrevLocation(location)
        LoadingBarRef.current?.continuousStart()
    }, [location])

    useEffect(() => {
        LoadingBarRef.current?.complete()
    }, [prevLocation])

    useEffect(() => {
        if (socket && socket.connected && datingProfile) {
            if (!isInDatingRoom.current && location.pathname.startsWith('/dating')) {
                isInDatingRoom.current = true
                emit('join_dating_room')
            }

            if (isInDatingRoom.current && !location.pathname.startsWith('/dating')) {
                isInDatingRoom.current = false
                emit('leave_dating_room')
            }
        }
    }, [socket, location, datingProfile])

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
