import { AxiosError } from 'axios'

import { ErrorObjResponse, ErrorResponse } from '~/types/response.types'

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
