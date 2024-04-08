import {
    CreateConstructiveResultResponse,
    GetConstructiveResultResponse,
    UpdateAnswerConstructiveResultResponse
} from '~/types/constructiveResults.types'
import http from '~/utils/http'

export type CreateConstructiveResultReqData = {
    first_user_id: string
    second_user_id: string
}

export type UpdateAnswerConstructiveResultReqData = {
    constructive_result_id: string
    question_id: string
    answer: string
}

export const createConstructiveResult = (data: CreateConstructiveResultReqData) =>
    http.post<CreateConstructiveResultResponse>('/constructive-results', data)

export const getConstructiveResult = (dating_call_id: string) =>
    http.get<GetConstructiveResultResponse>(`/constructive-results/${dating_call_id}`)

export const updateAnswerConstructiveResult = ({
    constructive_result_id,
    question_id,
    answer
}: UpdateAnswerConstructiveResultReqData) =>
    http.patch<UpdateAnswerConstructiveResultResponse>(`/constructive-results/${constructive_result_id}`, {
        question_id,
        answer
    })
