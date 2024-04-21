import {
    CreateConstructiveQuestionResponse,
    GetAllConstructiveQuestionsResponse,
    UpdateConstructiveQuestionResponse
} from '~/types/constructiveQuestions.types'
import { SuccessResponse } from '~/types/response.types'
import http from '~/utils/http'

export type GetAllConstructiveQuestionsReqData = {
    question?: string
    page: number
    limit: number
}

export type CreateConstructiveQuestionReqData = {
    question: string
    options: string[]
}

export type UpdateConstructiveQuestionReqData = {
    constructive_question_id: string
    question?: string
    options?: string[]
}

export const getAllConstructiveQuestions = ({ question, page, limit }: GetAllConstructiveQuestionsReqData) =>
    http.get<GetAllConstructiveQuestionsResponse>('/constructive-questions/all', {
        params: { question, page, limit }
    })

export const createConstructiveQuestion = (data: CreateConstructiveQuestionReqData) =>
    http.post<CreateConstructiveQuestionResponse>('/constructive-questions', data)

export const updateConstructiveQuestion = ({ constructive_question_id, ...body }: UpdateConstructiveQuestionReqData) =>
    http.patch<UpdateConstructiveQuestionResponse>(`/constructive-questions/${constructive_question_id}`, body)

export const deleteConstructiveQuestion = (constructive_question_id: string) =>
    http.delete<SuccessResponse>(`/constructive-questions/${constructive_question_id}`)
