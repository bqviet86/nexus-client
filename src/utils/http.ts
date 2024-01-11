import axios, { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from 'axios'

import { ErrorResponse } from '~/types/response.types'
import { RefreshTokenResponse, TokenResponse } from '~/types/users.types'
import { isAccessTokenExpired, isAxiosUnauthorizedError } from './check'
import { sendEvent } from './event'
import { getAccessTokenFromLS, getRefreshTokenFromLS, setTokenToLS } from './localStorage'

const requestConfig: CreateAxiosDefaults | AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_API_URL as string, // http://localhost:4000
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
}

class Http {
    public instance: AxiosInstance
    private subscribers: ((token: string | null) => void)[]
    private isRefreshing: boolean

    constructor() {
        this.instance = axios.create(requestConfig)
        this.subscribers = []
        this.isRefreshing = false

        this.instance.interceptors.request.use(
            async (config) => {
                const access_token = getAccessTokenFromLS()
                const refresh_token = getRefreshTokenFromLS()

                const setAuthorization = (access_token: string) => {
                    config.headers.Authorization = `Bearer ${access_token}`
                }

                if (access_token) {
                    if (isAccessTokenExpired(access_token)) {
                        if (!this.isRefreshing) {
                            this.isRefreshing = true

                            const tokenRes = await this.callRefreshToken(refresh_token as string)
                            const new_access_token = tokenRes?.access_token || null

                            if (tokenRes) {
                                if (config.url === '/users/logout') {
                                    config.data = { refresh_token: tokenRes.refresh_token }
                                }

                                setAuthorization(tokenRes.access_token)
                            }

                            this.onRefreshed(new_access_token)
                            this.isRefreshing = false

                            return config
                        }

                        return new Promise((resolve) => {
                            this.addSubscriber((new_access_token: string | null) => {
                                if (new_access_token) {
                                    setAuthorization(new_access_token)
                                }

                                resolve(config)
                            })
                        })
                    }

                    setAuthorization(access_token)
                }

                return config
            },
            (error) => Promise.reject(error)
        )
    }

    private reset() {
        this.subscribers = []
        this.isRefreshing = false
    }

    private addSubscriber(callback: (token: string | null) => void) {
        this.subscribers.push(callback)
    }

    private async callRefreshToken(refresh_token: string) {
        try {
            const response = await axios.post<RefreshTokenResponse>(
                '/users/refresh-token',
                { refresh_token },
                requestConfig as AxiosRequestConfig
            )

            setTokenToLS(response.data.result as TokenResponse)

            return response.data.result as TokenResponse
        } catch (error) {
            if (isAxiosUnauthorizedError<ErrorResponse>(error)) {
                sendEvent('force-logout')
                this.reset()
            }

            return null
        }
    }

    private onRefreshed(new_access_token: string | null) {
        this.subscribers.forEach((callback) => callback(new_access_token))
        this.subscribers = []
    }
}

const http = new Http().instance

export default http