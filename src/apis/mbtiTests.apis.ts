import { MBTIValue } from '~/constants/enums'
import {
    CompleteMBTITestResponse,
    CreateMBTITestResponse,
    DeleteMBTITestResponse,
    GetAllMBTITestsResponse,
    GetMBTITestResponse,
    UpdateAnswerMBTITestResponse
} from '~/types/mbtiTests.types'
import http from '~/utils/http'

export type UpdateAnswerMBTITestRequest = {
    mbti_test_id: string
    question_id: string
    answer: MBTIValue
}

export const createMBTITest = () => http.post<CreateMBTITestResponse>('/mbti-tests')

export const getMBTITest = (mbti_test_id: string) => http.get<GetMBTITestResponse>(`/mbti-tests/${mbti_test_id}`)

export const getAllMBTITests = () => http.get<GetAllMBTITestsResponse>('/mbti-tests')

export const updateAnswerMBTITest = ({ mbti_test_id, question_id, answer }: UpdateAnswerMBTITestRequest) =>
    http.patch<UpdateAnswerMBTITestResponse>(`/mbti-tests/answer/${mbti_test_id}`, { question_id, answer })

export const completeMBTITest = (mbti_test_id: string) =>
    http.patch<CompleteMBTITestResponse>(`/mbti-tests/complete/${mbti_test_id}`)

export const deleteMBTITest = (mbti_test_id: string) =>
    http.delete<DeleteMBTITestResponse>(`/mbti-tests/${mbti_test_id}`)
