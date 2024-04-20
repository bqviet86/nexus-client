import { PaginationResponse, SuccessResponse } from './response.types'

export type ConstructiveQuestion = {
    _id: string
    question: string
    options: string[]
    ask_count: number
    created_at: string
    updated_at: string
}

export type ConstructiveQuestionTableType = {
    key: string
    index: number
    question: string
    option_amount: number
    ask_count: number
    created_at: string
    action: ConstructiveQuestion
}

export type GetAllConstructiveQuestionsResponse = SuccessResponse<
    PaginationResponse<{ constructive_questions: ConstructiveQuestion[] }>
>

export type CreateConstructiveQuestionResponse = SuccessResponse<ConstructiveQuestion>

export type UpdateConstructiveQuestionResponse = SuccessResponse<ConstructiveQuestion>
