import { Language, Sex } from '~/constants/enums'
import { SuccessResponse } from './response.types'

export type DatingCriteria = {
    _id: string
    sex: Sex
    age_range: number[]
    height_range: number[]
    hometown: string
    language: Language
    created_at: string
    updated_at: string
}

export type GetDatingCriteriaResponse = SuccessResponse<DatingCriteria>

export type CreateDatingCriteriaResponse = SuccessResponse<DatingCriteria>

export type UpdateDatingCriteriaResponse = SuccessResponse<DatingCriteria>
