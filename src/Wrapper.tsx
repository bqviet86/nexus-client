import { useContext, useEffect, useRef, useState } from 'react'
import { Location, Routes, useLocation } from 'react-router-dom'
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar'

import { AppContext } from './contexts/appContext'
import { useScrollToTop, useSocket } from './hooks'

function Wrapper({ children }: { children: React.ReactNode }) {
    const location = useLocation()
    const { emit } = useSocket()

    const { datingProfile } = useContext(AppContext)
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
        if (datingProfile) {
            if (!isInDatingRoom.current && location.pathname.startsWith('/dating')) {
                isInDatingRoom.current = true
                emit('join_dating_room')
            }

            if (isInDatingRoom.current && !location.pathname.startsWith('/dating')) {
                isInDatingRoom.current = false
                emit('leave_dating_room')
            }
        }
    }, [location, datingProfile])

    return (
        <>
            <LoadingBar ref={LoadingBarRef} color='#8800ff' />
            <Routes>{children}</Routes>
        </>
    )
}

export default Wrapper
