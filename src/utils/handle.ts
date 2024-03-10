import { AxiosError } from 'axios'
import { compareAsc, format, formatDistanceToNowStrict, sub } from 'date-fns'
import { vi } from 'date-fns/locale'

import { ErrorObjResponse, ErrorResponse } from '~/types/response.types'
import { Comment, CommentDetail } from '~/types/comments.types'
import { Media } from '~/types/medias.types'

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
    const subDate = sub(new Date(), { months: 1 })

    if (compareAsc(date, subDate) !== 1) {
        return format(date, (extend ? 'HH:mm ' : '') + 'dd-MM-yyyy')
    }

    const result = formatDistanceToNowStrict(date, {
        addSuffix: true,
        locale: vi
    })

    return extend ? result : result.replace('trước', '').trim()
}

export function renderCommentUpdated<T>({
    comment,
    parentId = '',
    commentId,
    newContent,
    newMedia
}: {
    comment: T
    parentId?: string
    commentId: string
    newContent: string
    newMedia: Media | null
}): T {
    return (comment as any)._id === (parentId || commentId)
        ? {
              ...comment,
              ...(parentId
                  ? {
                        children: (comment as CommentDetail).children.map((child) =>
                            renderCommentUpdated<Comment>({ comment: child, commentId, newContent, newMedia })
                        )
                    }
                  : { content: newContent, media: newMedia })
          }
        : comment
}
