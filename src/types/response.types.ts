export type SuccessResponse<Data = unknown> = {
    message: string
    result?: Data
}

export type ErrorResponse<Error = unknown> = {
    message: string
    errors?: Error
}

export type ErrorObjResponse = {
    location: string
    msg: string
    path: string
    type: string
    value: string
}
