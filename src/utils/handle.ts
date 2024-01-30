import { AxiosError } from 'axios'
import { compareAsc, format, formatDistanceToNow, sub } from 'date-fns'
import { vi } from 'date-fns/locale'

import { ErrorObjResponse, ErrorResponse } from '~/types/response.types'

export const numberEnumToArray = (numberEnum: { [key: string]: any }) => {
    return Object.values(numberEnum).filter((value) => typeof value === 'number') as number[]
}

export const stringEnumToArray = (stringEnum: { [key: string]: any }) => {
    return Object.values(stringEnum).filter((value) => typeof value === 'string') as string[]
}

export const handleUnprocessableEntityError = <FormError>(
    error: AxiosError<ErrorResponse<Record<keyof FormError, ErrorObjResponse>>>
) => {
    const errorObj: FormError = {} as FormError
    const errors = error.response?.data.errors

    if (errors) {
        for (const key in errors) {
            if (Object.hasOwnProperty.call(errors, key)) {
                const element = errors[key]
                errorObj[key] = element.msg as any
            }
        }
    }

    return errorObj
}

export const formatTime: (time: string, extend?: boolean) => string = (time, extend = false) => {
    const date = new Date(time)
    const subDate = sub(new Date(), { days: 1 })

    if (compareAsc(date, subDate) === -1) {
        return format(date, (extend ? 'HH:mm ' : '') + 'dd-MM-yyyy')
    }

    return formatDistanceToNow(date, {
        addSuffix: true,
        locale: vi
    })
        .replace('khoảng', '')
        .trim()
}
