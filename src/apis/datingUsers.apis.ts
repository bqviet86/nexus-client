import {
    CreateDatingProfileResponse,
    DatingProfile,
    GetDatingProfileResponse,
    UpdateDatingProfileResponse
} from '~/types/datingUsers.types'
import http from '~/utils/http'

export type CreateDatingProfileReqBody = Pick<
    DatingProfile,
    'name' | 'sex' | 'age' | 'height' | 'hometown' | 'language'
>

export type UpdateDatingProfileReqBody = Partial<CreateDatingProfileReqBody>

export const getDatingProfile = (profile_id: string, checkId: 'user_id' | 'dating_user_id') =>
    http.get<GetDatingProfileResponse>(`/dating-users/${profile_id}`, { params: { checkId } })

export const createDatingProfile = (body: CreateDatingProfileReqBody) =>
    http.post<CreateDatingProfileResponse>('/dating-users', body)

export const updateDatingProfile = (body: UpdateDatingProfileReqBody) =>
    http.patch<UpdateDatingProfileResponse>('/dating-users', body)
