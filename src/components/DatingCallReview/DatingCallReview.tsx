import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import Button from '~/components/Button'
import { CreateDatingCallReviewReqData, createDatingCallReview } from '~/apis/datingCallReviews.apis'
import { routes } from '~/config'
import { DATING_CALL_REVIEWS } from '~/constants/interfaceData'
import { formatDuration } from '~/utils/handle'

type DatingCallReviewProps = {
    callingDuration: number
    myId: string
    userRatedId: string
    datingCallId: string
}

function DatingCallReview({ callingDuration, myId, userRatedId, datingCallId }: DatingCallReviewProps) {
    const [starsRating, setStarsRating] = useState<number>(1)
    const [reviewTexts, setReviewTexts] = useState<string[]>([])

    const prevStarRef = useRef<number>(1)

    const { mutate: mutateCreateDatingCallReview } = useMutation({
        mutationFn: (data: CreateDatingCallReviewReqData) => createDatingCallReview(data)
    })

    const handleCreateDatingCallReview = () => {
        mutateCreateDatingCallReview(
            {
                user_id: myId,
                rated_user_id: userRatedId,
                dating_call_id: datingCallId,
                review_texts: reviewTexts,
                stars_rating: starsRating
            },
            {
                onSuccess: () => (window.location.href = routes.dating)
            }
        )
    }

    return (
        <div className='flex h-full flex-col justify-center gap-2'>
            <h3 className='text-center text-xl font-medium'>Cuộc gọi đã kết thúc</h3>

            <div className='text-center text-2xl font-semibold'>{formatDuration(callingDuration)}</div>

            <div className='flex flex-col items-center gap-2'>
                <p className='text-sm'>Đánh giá cuộc trò chuyện của bạn</p>

                <div className='flex'>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className={`cursor-pointer transition-all px-2${
                                index + 1 <= starsRating ? ' text-yellow-400' : ''
                            }`}
                            onClick={() => {
                                prevStarRef.current = index + 1
                                setStarsRating(index + 1)
                            }}
                            onMouseEnter={() => setStarsRating(index + 1)}
                            onMouseLeave={() => setStarsRating(prevStarRef.current)}
                        >
                            <svg
                                className='h-6 w-6'
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 64 64'
                                fill='currentColor'
                            >
                                <g>
                                    <path
                                        fill='currentColor'
                                        d='M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z'
                                    />
                                </g>
                            </svg>
                        </div>
                    ))}
                </div>
            </div>

            <div className='flex flex-col items-center gap-2'>
                <p className='text-center text-sm'>
                    Hãy cho chúng tôi biết cảm nhận của bạn về tính cách của người kia
                </p>

                <div className='flex flex-wrap justify-center gap-1.5'>
                    {DATING_CALL_REVIEWS.map((review, index) => (
                        <div
                            key={index}
                            className={`h-6 cursor-pointer rounded-full px-2 text-sm leading-6 transition-all ${
                                reviewTexts.includes(review) ? 'bg-teal-500 text-white' : 'bg-[#e4e6eb] text-[#333]'
                            }`}
                            onClick={() =>
                                reviewTexts.includes(review)
                                    ? setReviewTexts(reviewTexts.filter((text) => text !== review))
                                    : reviewTexts.length < 3 && setReviewTexts([...reviewTexts, review])
                            }
                        >
                            {review}
                        </div>
                    ))}
                </div>
            </div>

            <Button
                className='!mx-auto !mt-4 !bg-teal-500 hover:!bg-teal-500/80 [&>span]:!text-white'
                onClick={handleCreateDatingCallReview}
            >
                Hoàn tất
            </Button>
        </div>
    )
}

export default DatingCallReview
