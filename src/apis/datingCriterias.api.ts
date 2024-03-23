import {
    CreateDatingCriteriaResponse,
    DatingCriteria,
    GetDatingCriteriaResponse,
    UpdateDatingCriteriaResponse
} from '~/types/datingCriterias.types'
import http from '~/utils/http'

export type CreateDatingCriteriaReqBody = Pick<
    DatingCriteria,
    'sex' | 'age_range' | 'height_range' | 'hometown' | 'language'
>

export type UpdateDatingCriteriaReqBody = Partial<CreateDatingCriteriaReqBody>

export const getDatingCriteria = () => http.get<GetDatingCriteriaResponse>('/dating-criterias')

export const createDatingCriteria = (body: CreateDatingCriteriaReqBody) =>
    http.post<CreateDatingCriteriaResponse>('/dating-criterias', body)

export const updateDatingCriteria = (body: UpdateDatingCriteriaReqBody) =>
    http.patch<UpdateDatingCriteriaResponse>('/dating-criterias', body)
