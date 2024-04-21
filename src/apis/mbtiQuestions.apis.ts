import { MBTIDimension } from '~/constants/enums'
import {
    CreateMBTIQuestionResponse,
    GetAllMBTIQuestionsResponse,
    MBTIOption,
    UpdateMBTIQuestionResponse
} from '~/types/mbtiQuestions.types'
import { SuccessResponse } from '~/types/response.types'
import http from '~/utils/http'

export type GetAllMBTIQuestionsReqData = {
    question?: string
    page: number
    limit: number
}

export type CreateMBTIQuestionReqData = {
    question: string
    dimension: MBTIDimension
    options: MBTIOption[]
}

export type UpdateMBTIQuestionReqData = {
    mbti_question_id: string
    question?: string
    dimension?: MBTIDimension
    options?: MBTIOption[]
}

export const getAllMBTIQuestions = ({ question, page, limit }: GetAllMBTIQuestionsReqData) =>
    http.get<GetAllMBTIQuestionsResponse>('/mbti-questions/all', {
        params: { question, page, limit }
    })

export const createMBTIQuestion = (data: CreateMBTIQuestionReqData) =>
    http.post<CreateMBTIQuestionResponse>('/mbti-questions', data)

export const updateMBTIQuestion = ({ mbti_question_id, ...body }: UpdateMBTIQuestionReqData) =>
    http.patch<UpdateMBTIQuestionResponse>(`/mbti-questions/${mbti_question_id}`, body)

export const deleteMBTIQuestion = (mbti_question_id: string) =>
    http.delete<SuccessResponse>(`/mbti-questions/${mbti_question_id}`)
