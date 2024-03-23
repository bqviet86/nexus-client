import { GetProvincesResponse } from '~/types/provinces.types'
import http from '~/utils/http'

export const getProvinces = () => http.get<GetProvincesResponse>('/provinces')
