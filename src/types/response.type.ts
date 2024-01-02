export interface SuccessResponse<Data> {
    message: string
    result?: Data
}

export interface ErrorResponse {
    message: string
    errors?: Record<
        string,
        {
            type: string
            value: string
            msg: string
            path: string
            location: string
        }
    >
}
