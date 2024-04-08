import { ConstructiveQuestion } from './constructiveQuestions.types'
import { SuccessResponse } from './response.types'

export type ConstructiveAnswer = {
    question: ConstructiveQuestion
    answer: string
}

export type ConstructiveUserAnswer = {
    id: string
    answers: ConstructiveAnswer[]
}

export type ConstructiveResult = {
    _id: string
    first_user: ConstructiveUserAnswer
    second_user: ConstructiveUserAnswer
    compatibility: number | null
    created_at: string
    updated_at: string
}

export type CreateConstructiveResultResponse = SuccessResponse<ConstructiveResult>

export type GetConstructiveResultResponse = SuccessResponse<ConstructiveResult>

export type UpdateAnswerConstructiveResultResponse = SuccessResponse<ConstructiveResult>
