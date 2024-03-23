import { SuccessResponse } from './response.types'

export type Province = {
    _id: string
    province_id: string
    province_name: string
    province_type: string
}

export type GetProvincesResponse = SuccessResponse<Province[]>
