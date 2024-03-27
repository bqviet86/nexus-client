import { MBTITestStatus, MBTIType, MBTIValue } from '~/constants/enums'
import { MBTIQuestion } from './mbtiQuestions.types'
import { SuccessResponse } from './response.types'

export type MBTIAnswer = {
    question: MBTIQuestion
    answer: MBTIValue | ''
}

export type MBTITest = {
    _id: string
    answers: MBTIAnswer[]
    mbti_type: MBTIType | ''
    status: MBTITestStatus
    current_question: number | null
    created_at: string
    updated_at: string
}

export type CreateMBTITestResponse = SuccessResponse<MBTITest>

export type GetMBTITestResponse = SuccessResponse<MBTITest>

export type GetAllMBTITestsResponse = SuccessResponse<MBTITest[]>

export type UpdateAnswerMBTITestResponse = SuccessResponse

export type CompleteMBTITestResponse = SuccessResponse

export type DeleteMBTITestResponse = SuccessResponse
