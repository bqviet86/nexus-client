import { CreateDatingCallResponse, GetAllDatingCallsResponse } from '~/types/datingCalls.types'
import http from '~/utils/http'

export type CreateDatingCallReqData = {
    first_user_id: string
    second_user_id: string
    constructive_result_id?: string
    duration: number
}

export const createDatingCall = (data: CreateDatingCallReqData) =>
    http.post<CreateDatingCallResponse>('/dating-calls', data)

export const getAllDatingCalls = () => http.get<GetAllDatingCallsResponse>('/dating-calls')
