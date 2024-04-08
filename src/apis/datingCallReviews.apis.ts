import { CreateDatingCallReviewResponse } from '~/types/datingReviews.types'
import http from '~/utils/http'

export type CreateDatingCallReviewReqData = {
    user_id: string
    rated_user_id: string
    dating_call_id: string
    review_texts: string[]
    stars_rating: number
}

export const createDatingCallReview = (data: CreateDatingCallReviewReqData) =>
    http.post<CreateDatingCallReviewResponse>('/dating-reviews', data)
