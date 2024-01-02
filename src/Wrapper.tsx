import { useEffect, useRef, useState } from 'react'
import { Routes, useLocation } from 'react-router-dom'
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar'

import useScrollToTop from './hooks/useScrollToTop'

function Wrapper({ children }: { children: React.ReactNode }) {
    const [prevLocation, setPrevLocation] = useState({})
    const LoadingBarRef = useRef<LoadingBarRef | null>(null)
    const location = useLocation()

    useScrollToTop()

    useEffect(() => {
        setPrevLocation(location)

        LoadingBarRef.current?.continuousStart()
    }, [location])

    useEffect(() => {
        LoadingBarRef.current?.complete()
    }, [prevLocation])

    return (
        <>
            <LoadingBar ref={LoadingBarRef} color='#8800ff' />
            <Routes>{children}</Routes>
        </>
    )
}

export default Wrapper
