import { SuccessResponse } from './response.types'

export type DatingCallReview = {
    _id?: string
    user_id: string
    rated_user_id: string
    dating_call_id: string
    review_texts: string[]
    stars_rating: number
    created_at: string
}

export type CreateDatingCallReviewResponse = SuccessResponse<DatingCallReview>
