import { useContext, useRef } from 'react'

import Button from '~/components/Button'
import images from '~/assets/images'
import { envConfig, routes } from '~/config'
import { MBTI_TYPES } from '~/constants/interfaceData'
import { AppContext } from '~/contexts/appContext'
import { DatingCall } from '~/types/datingCalls.types'
import { DatingProfile } from '~/types/datingUsers.types'
import { formatDuration, formatTime } from '~/utils/handle'

type DatingCallHistoryItemProps = {
    datingCall: DatingCall
    callOpened: string
    setCallOpened: React.Dispatch<React.SetStateAction<string>>
}

function DatingCallHistoryItem({ datingCall, callOpened, setCallOpened }: DatingCallHistoryItemProps) {
    const { datingProfile } = useContext(AppContext)

    const callOpenedRef = useRef<HTMLDivElement>(null)

    const myProperty = (datingProfile as DatingProfile)._id === datingCall.first_user._id ? 'first_user' : 'second_user'
    const userProperty = myProperty === 'first_user' ? 'second_user' : 'first_user'
    const mbtiType = datingCall[userProperty].mbti_type

    return (
        <div key={datingCall._id} className='overflow-hidden rounded-lg'>
            <div
                className='flex cursor-pointer gap-2 bg-[#9d969c] px-4 py-2'
                onClick={() => setCallOpened((prev) => (prev === datingCall._id ? '' : datingCall._id))}
            >
                <div className='flex flex-[1] items-center'>
                    <img
                        src={
                            datingCall[userProperty].avatar
                                ? `${envConfig.imageUrlPrefix}/${datingCall[userProperty].avatar}`
                                : images.avatar
                        }
                        alt={datingCall[userProperty].name}
                        className='h-10 w-10 rounded-full object-cover'
                    />
                    <div className='ml-2 line-clamp-2 text-sm'>{datingCall[userProperty].name}</div>
                </div>

                <div className='flex-[1]'>
                    <div className='line-clamp-1 text-end text-sm'>{formatTime(datingCall.created_at, true)}</div>
                    <div className='line-clamp-1 text-end text-sm'>
                        Thời lượng: {formatDuration(datingCall.duration, true)}
                    </div>
                </div>
            </div>

            <div
                ref={callOpenedRef}
                className='bg-[#b2b2b2]/30 px-4 transition-all'
                style={{
                    height: datingCall._id === callOpened ? callOpenedRef.current?.scrollHeight : '0'
                }}
            >
                <div className='flex flex-wrap items-center gap-2 pt-4'>
                    <span className='text-sm'>Kiểu tính cách: </span>
                    {mbtiType && (
                        <div
                            className='h-5 w-max rounded-full px-2 text-xs font-medium leading-5 text-white'
                            style={{
                                backgroundColor: MBTI_TYPES[mbtiType].color
                            }}
                        >
                            {mbtiType} - {MBTI_TYPES[mbtiType].title}
                        </div>
                    )}
                </div>

                <div className='mt-3 flex flex-wrap items-center gap-2'>
                    <span className='text-sm'>
                        Hợp nhau về quan điểm: {datingCall.compatibility ? `${datingCall.compatibility}%` : ''}
                    </span>
                </div>

                <div className='mt-3 flex flex-wrap items-center gap-2'>
                    <span className='text-sm'>Cảm nhận của bạn:</span>
                    {datingCall[myProperty].review_texts.map((text, index) => (
                        <div
                            key={index}
                            className='h-5 w-max rounded-full bg-[#654dab] px-2 text-xs font-medium leading-5 text-white'
                        >
                            {text}
                        </div>
                    ))}
                </div>

                <div className='mt-3 flex flex-wrap items-center gap-2'>
                    <span className='text-sm'>Cảm nhận của đối phương:</span>
                    {datingCall[userProperty].review_texts.map((text, index) => (
                        <div
                            key={index}
                            className='h-5 w-max rounded-full bg-[#44cf67] px-2 text-xs font-medium leading-5 text-white'
                        >
                            {text}
                        </div>
                    ))}
                </div>

                <div className='mt-3 flex flex-wrap items-center gap-2'>
                    <span className='text-sm'>Đánh giá của bạn:</span>
                    {Array.from({ length: datingCall[myProperty].stars_rating }).map((_, index) => (
                        <div key={index} className='text-yellow-400'>
                            <svg
                                className='h-[14px] w-[14px]'
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

                <div className='mt-3 flex flex-wrap items-center gap-2'>
                    <span className='text-sm'>Đánh giá của đối phương:</span>
                    {Array.from({ length: datingCall[userProperty].stars_rating }).map((_, index) => (
                        <div key={index} className='text-yellow-400'>
                            <svg
                                className='h-[14px] w-[14px]'
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

                <div className='mt-3 flex border-t border-solid border-[#b2b2b2] py-1'>
                    <Button
                        to={routes.datingProfile.replace(':profile_id', datingCall[userProperty]._id)}
                        icon={
                            <svg
                                className='h-[24px] w-[24px]'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                                />
                            </svg>
                        }
                        className='!h-9 !flex-[1] !bg-transparent !px-2 hover:!bg-[#4a4a4a] [&>span]:!text-[#e4e6eb]'
                    >
                        Trang cá nhân
                    </Button>
                    <Button
                        to={routes.datingChatDetail.replace(':profile_id', datingCall[userProperty]._id)}
                        icon={
                            <svg
                                className='h-[22px] w-[22px]'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z'
                                />
                            </svg>
                        }
                        className='!h-9 !flex-[1] !bg-transparent !px-2 hover:!bg-[#4a4a4a] [&>span]:!text-[#e4e6eb]'
                    >
                        Nhắn tin
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DatingCallHistoryItem
