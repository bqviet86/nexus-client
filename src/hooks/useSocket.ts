import { useContext, useEffect } from 'react'
import { Socket, io } from 'socket.io-client'
import { useMutation } from '@tanstack/react-query'

import { refreshToken } from '~/apis/users.apis'
import { AppContext } from '~/contexts/appContext'
import { TokenResponse } from '~/types/users.types'
import { ErrorResponse } from '~/types/response.types'
import { isAccessTokenExpired, isAxiosUnauthorizedError } from '~/utils/check'
import { setTokenToLS } from '~/utils/localStorage'
import { sendEvent } from '~/utils/event'

type UseSocketProps = {
    initSocket: boolean
}

function useSocket({ initSocket }: UseSocketProps = { initSocket: false }) {
    const { token, setToken, socket, setSocket, emitEvents, setEmitEvents } = useContext(AppContext)

    const access_token = token?.access_token || null
    const refresh_token = token?.refresh_token || null

    const connectSocket = (accessToken: string) => {
        const newSocket = io(import.meta.env.VITE_API_URL, {
            auth: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        setSocket(newSocket)

        return newSocket
    }

    const disconnectSocket = (socket: Socket) => {
        socket.disconnect()
        setSocket(null)
    }

    useEffect(() => {
        if (initSocket && access_token && !isAccessTokenExpired(access_token)) {
            const newSocket = connectSocket(access_token)

            if (emitEvents.length) {
                emitEvents.forEach(({ event, args }) => {
                    newSocket.emit(event, ...args)
                })

                setEmitEvents([])
            }

            return () => disconnectSocket(newSocket)
        }
    }, [access_token])

    const { mutate: mutateRefreshToken } = useMutation({
        mutationFn: (refresh_token: string) => refreshToken(refresh_token)
    })

    const emit = (event: string, ...args: any[]) => {
        if (socket && access_token && !isAccessTokenExpired(access_token)) {
            socket.emit(event, ...args)
            return
        }

        mutateRefreshToken(refresh_token as string, {
            onSuccess: (response) => {
                const tokenResponse = response.data.result as TokenResponse

                setToken(tokenResponse)
                setTokenToLS(tokenResponse)
                setEmitEvents((prev) => [...prev, { event, args }])
            },
            onError: (error) => {
                if (isAxiosUnauthorizedError<ErrorResponse>(error)) {
                    sendEvent('force-logout')
                }
            }
        })
    }

    return {
        instance: socket,
        emit
    }
}

export default useSocket
