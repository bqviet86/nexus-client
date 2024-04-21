import { MBTIDimension, MBTIValue } from '~/constants/enums'
import { PaginationResponse, SuccessResponse } from './response.types'

export type MBTIOption = {
    option: string
    dimension_value: MBTIValue
}

export type MBTIQuestion = {
    _id: string
    question: string
    dimension: MBTIDimension
    options: MBTIOption[]
    created_at: string
    updated_at: string
}

export type MBTIQuestionTableType = {
    key: string
    index: number
    question: string
    dimension: MBTIDimension
    created_at: string
    action: MBTIQuestion
}

export type GetAllMBTIQuestionsResponse = SuccessResponse<
    PaginationResponse<{
        mbti_questions: MBTIQuestion[]
    }>
>

export type CreateMBTIQuestionResponse = SuccessResponse<MBTIQuestion>

export type UpdateMBTIQuestionResponse = SuccessResponse<MBTIQuestion>
