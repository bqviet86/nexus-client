import { useContext, useEffect } from 'react'
import { io } from 'socket.io-client'
import { useMutation } from '@tanstack/react-query'

import { refreshToken } from '~/apis/users.apis'
import { AppContext } from '~/contexts/appContext'
import { TokenResponse } from '~/types/users.types'
import { ErrorResponse } from '~/types/response.types'
import { isAccessTokenExpired, isAxiosUnauthorizedError } from '~/utils/check'
import { getTokenFromLS, setTokenToLS } from '~/utils/localStorage'
import { sendEvent } from '~/utils/event'

type UseSocketProps = {
    initSocket: boolean
}

function useSocket({ initSocket }: UseSocketProps = { initSocket: false }) {
    const { token, setToken, socket, setSocket, emitEvents, setEmitEvents } = useContext(AppContext)

    const access_token = token?.access_token || null
    const refresh_token = token?.refresh_token || null

    useEffect(() => {
        if (initSocket && access_token && !isAccessTokenExpired(access_token)) {
            const newSocket = io(import.meta.env.VITE_API_URL, {
                auth: {
                    Authorization: `Bearer ${access_token}`
                }
            })

            newSocket.on('connect', () => setSocket(newSocket))
            newSocket.on('disconnect', () => setSocket(null))

            return () => {
                newSocket.disconnect()
            }
        }
    }, [access_token])

    useEffect(() => {
        if (initSocket && socket && socket.connected && emitEvents.length) {
            emitEvents.forEach(({ event, args }) => {
                socket.emit(event, ...args)
            })
            setEmitEvents([])
        }
    }, [socket, emitEvents])

    const { mutate: mutateRefreshToken } = useMutation({
        mutationFn: (refresh_token: string) => refreshToken(refresh_token),
        onSuccess: (response) => {
            const tokenResponse = response.data.result as TokenResponse

            setToken(tokenResponse)
            setTokenToLS(tokenResponse)
        },
        onError: (error) => {
            if (isAxiosUnauthorizedError<ErrorResponse>(error)) {
                sendEvent('force-logout')
            }
        }
    })

    useEffect(() => {
        if (initSocket && access_token && isAccessTokenExpired(access_token) && refresh_token) {
            mutateRefreshToken(refresh_token)
        }
    }, [])

    const emit = (event: string, ...args: any[]) => {
        const token = getTokenFromLS()
        const access_token = token?.access_token || null
        const refresh_token = token?.refresh_token || null

        if (access_token) {
            if (socket && !isAccessTokenExpired(access_token)) {
                socket.connected ? socket.emit(event, ...args) : setEmitEvents((prev) => [...prev, { event, args }])
                return
            }

            if (refresh_token && isAccessTokenExpired(access_token)) {
                mutateRefreshToken(refresh_token, {
                    onSuccess: () => setEmitEvents((prev) => [...prev, { event, args }])
                })
            }
        }
    }

    return {
        instance: socket,
        emit
    }
}

export default useSocket
