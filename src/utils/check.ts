import axios, { AxiosError } from 'axios'
import { jwtDecode } from 'jwt-decode'

import HTTP_STATUS from '~/constants/httpStatus'
import { TokenPayload } from '~/types/commons.types'
import { ErrorObjResponse, ErrorResponse } from '~/types/response.types'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
    return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(
    error: unknown
): error is AxiosError<ErrorResponse<Record<keyof FormError, ErrorObjResponse>>> {
    return isAxiosError(error) && error.response?.status === HTTP_STATUS.UNPROCESSABLE_ENTITY
}

export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
    return isAxiosError(error) && error.response?.status === HTTP_STATUS.UNAUTHORIZED
}

export function isAxiosExpiredTokenError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
    return isAxiosUnauthorizedError<ErrorResponse>(error) && error.response?.data?.message === 'Jwt expired'
}

export function isAccessTokenExpired(access_token: string): boolean {
    const { exp } = jwtDecode<TokenPayload>(access_token)
    return Date.now() >= exp * 1000
}

export function isHashtag(input: string): boolean {
    if (input.startsWith('#')) {
        const stringWithoutHash = input.slice(1)
        const regex = /^[a-zA-Z0-9]+$/

        return regex.test(stringWithoutHash)
    }

    return false
}
