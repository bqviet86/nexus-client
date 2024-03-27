import { Language, MBTIType, Sex } from '~/constants/enums'
import { Media } from './medias.types'
import { SuccessResponse } from './response.types'

export type DatingProfile = {
    _id: string
    name: string
    sex: Sex
    age: number
    height: number
    hometown: string
    language: Language
    avatar: string
    images: Media[]
    mbti_type: MBTIType | ''
    created_at: string
    updated_at: string
}

export type GetDatingProfileResponse = SuccessResponse<DatingProfile | null>

export type CreateDatingProfileResponse = SuccessResponse<DatingProfile>

export type UpdateDatingProfileResponse = SuccessResponse<DatingProfile>
