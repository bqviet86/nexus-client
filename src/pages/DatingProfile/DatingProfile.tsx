import { Fragment, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Image } from 'antd'

import Button from '~/components/Button'
import { getDatingProfile } from '~/apis/datingUsers.apis'
import images from '~/assets/images'
import { Sex } from '~/constants/enums'
import { DatingProfile as DatingProfileType } from '~/types/datingUsers.types'

function DatingProfile() {
    const activeBtnClasses =
        "!relative after:absolute after:bottom-0 after:h-0.5 after:w-3/4 after:rounded-full after:bg-white after:content-[''] [&>span]:!text-white"

    const { profile_id } = useParams()

    const [profile, setProfile] = useState<DatingProfileType | null>(null)
    const [tab, setTab] = useState<'images' | 'callHistory'>('images')

    useQuery({
        queryKey: ['datingProfile', profile_id],
        queryFn: async () => {
            const response = await getDatingProfile(profile_id as string, 'dating_user_id')
            const result = response.data.result as DatingProfileType

            setProfile(result)

            return result
        },
        enabled: !!profile_id
    })

    return profile ? (
        <div className='flex min-h-full flex-col py-2'>
            <div className='flex items-center py-2'>
                <div className='aspect-[1] w-1/3 overflow-hidden rounded-lg'>
                    <Image
                        src={
                            profile.avatar
                                ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${profile.avatar}`
                                : images.avatar
                        }
                        alt='avatar'
                        wrapperClassName='h-full w-full'
                        className='!h-full !w-full !object-cover'
                        preview
                    />
                </div>

                <div className='ml-2 flex-[1]'>
                    <div className='flex items-center gap-2'>
                        <h2 className='line-clamp-2 text-lg font-semibold leading-6'>{profile.name}</h2>
                        {profile.sex === Sex.Male ? (
                            <svg
                                className='h-6 w-6 flex-shrink-0 text-blue-500'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <g>
                                    <path
                                        d='M16.4091 13.5C16.4091 15.0732 15.7761 16.4966 14.7487 17.5327C14.3645 17.9201 13.9256 18.2528 13.4448 18.5182C12.6265 18.9699 11.6856 19.2273 10.6818 19.2273C7.51874 19.2273 4.95455 16.6631 4.95455 13.5C4.95455 10.3369 7.51874 7.77272 10.6818 7.77272C13.8449 7.77272 16.4091 10.3369 16.4091 13.5Z'
                                        stroke='currentColor'
                                        strokeWidth='1.9091'
                                    />
                                    <path
                                        d='M15.4205 9.20453L19.9207 4.70434'
                                        stroke='currentColor'
                                        strokeWidth='1.9091'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                    <path
                                        d='M19.9208 8.01135L19.9208 4.70435'
                                        stroke='currentColor'
                                        strokeWidth='1.9091'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                    <path
                                        d='M16.5798 4.67046L19.9207 4.67047'
                                        stroke='currentColor'
                                        strokeWidth='1.9091'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </g>
                            </svg>
                        ) : (
                            <svg
                                className='h-6 w-6 flex-shrink-0 text-pink-500'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <g>
                                    <path
                                        d='M17.4091 9.68183C17.4091 11.255 16.7761 12.6784 15.7487 13.7145C15.3645 14.102 14.9256 14.4346 14.4448 14.7C13.6265 15.1517 12.6856 15.4091 11.6818 15.4091C8.51874 15.4091 5.95455 12.8449 5.95455 9.68183C5.95455 6.51874 8.51874 3.95455 11.6818 3.95455C14.8449 3.95455 17.4091 6.51874 17.4091 9.68183Z'
                                        stroke='currentColor'
                                        strokeWidth='1.9091'
                                    />
                                    <path
                                        d='M11.5 15.5L11.5 21'
                                        stroke='currentColor'
                                        strokeWidth='1.9091'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                    <path
                                        d='M14 19L9 19'
                                        stroke='currentColor'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </g>
                            </svg>
                        )}
                    </div>
                    <p className='mt-1 text-sm'>
                        <span className='font-medium'>Tuổi: </span>
                        {profile.age}
                    </p>
                    <p className='mt-1 text-sm'>
                        <span className='font-medium'>Chiều cao: </span>
                        {profile.height} cm
                    </p>
                    <p className='mt-1 text-sm'>
                        <span className='font-medium'>Quê quán: </span>
                        {profile.hometown}
                    </p>
                    <p className='mt-1 text-sm'>
                        <span className='font-medium'>Ngôn ngữ: </span>
                        {profile.language}
                    </p>
                </div>
            </div>

            <div className='mt-8 flex items-center justify-center'>
                <Button
                    className={`!w-28 !bg-transparent [&>span]:hover:!text-white hover:!bg-[#454647]${
                        tab === 'images' ? ` ${activeBtnClasses}` : ''
                    }`}
                    onClick={() => setTab('images')}
                >
                    <svg className='h-6 w-6' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <g>
                            <path
                                d='M14 5.6C14 5.03995 14 4.75992 14.109 4.54601C14.2049 4.35785 14.3578 4.20487 14.546 4.10899C14.7599 4 15.0399 4 15.6 4H18.4C18.9601 4 19.2401 4 19.454 4.10899C19.6422 4.20487 19.7951 4.35785 19.891 4.54601C20 4.75992 20 5.03995 20 5.6V8.4C20 8.96005 20 9.24008 19.891 9.45399C19.7951 9.64215 19.6422 9.79513 19.454 9.89101C19.2401 10 18.9601 10 18.4 10H15.6C15.0399 10 14.7599 10 14.546 9.89101C14.3578 9.79513 14.2049 9.64215 14.109 9.45399C14 9.24008 14 8.96005 14 8.4V5.6Z'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                            <path
                                d='M4 5.6C4 5.03995 4 4.75992 4.10899 4.54601C4.20487 4.35785 4.35785 4.20487 4.54601 4.10899C4.75992 4 5.03995 4 5.6 4H8.4C8.96005 4 9.24008 4 9.45399 4.10899C9.64215 4.20487 9.79513 4.35785 9.89101 4.54601C10 4.75992 10 5.03995 10 5.6V8.4C10 8.96005 10 9.24008 9.89101 9.45399C9.79513 9.64215 9.64215 9.79513 9.45399 9.89101C9.24008 10 8.96005 10 8.4 10H5.6C5.03995 10 4.75992 10 4.54601 9.89101C4.35785 9.79513 4.20487 9.64215 4.10899 9.45399C4 9.24008 4 8.96005 4 8.4V5.6Z'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                            <path
                                d='M4 15.6C4 15.0399 4 14.7599 4.10899 14.546C4.20487 14.3578 4.35785 14.2049 4.54601 14.109C4.75992 14 5.03995 14 5.6 14H8.4C8.96005 14 9.24008 14 9.45399 14.109C9.64215 14.2049 9.79513 14.3578 9.89101 14.546C10 14.7599 10 15.0399 10 15.6V18.4C10 18.9601 10 19.2401 9.89101 19.454C9.79513 19.6422 9.64215 19.7951 9.45399 19.891C9.24008 20 8.96005 20 8.4 20H5.6C5.03995 20 4.75992 20 4.54601 19.891C4.35785 19.7951 4.20487 19.6422 4.10899 19.454C4 19.2401 4 18.9601 4 18.4V15.6Z'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                            <path
                                d='M14 15.6C14 15.0399 14 14.7599 14.109 14.546C14.2049 14.3578 14.3578 14.2049 14.546 14.109C14.7599 14 15.0399 14 15.6 14H18.4C18.9601 14 19.2401 14 19.454 14.109C19.6422 14.2049 19.7951 14.3578 19.891 14.546C20 14.7599 20 15.0399 20 15.6V18.4C20 18.9601 20 19.2401 19.891 19.454C19.7951 19.6422 19.6422 19.7951 19.454 19.891C19.2401 20 18.9601 20 18.4 20H15.6C15.0399 20 14.7599 20 14.546 19.891C14.3578 19.7951 14.2049 19.6422 14.109 19.454C14 19.2401 14 18.9601 14 18.4V15.6Z'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                        </g>
                    </svg>
                </Button>

                <Button
                    className={`!w-28 !bg-transparent [&>span]:hover:!text-white hover:!bg-[#454647]${
                        tab === 'callHistory' ? ` ${activeBtnClasses}` : ''
                    }`}
                    onClick={() => setTab('callHistory')}
                >
                    <svg
                        className='h-6 w-6'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                    >
                        <path
                            stroke='currentColor'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z'
                        />
                    </svg>
                </Button>
            </div>

            <div className='mt-4 grid grid-cols-3 gap-1 overflow-hidden rounded-lg'>
                {profile.images.length ? (
                    profile.images.map((image, index) => (
                        <div key={index} className='aspect-[1]'>
                            <Image
                                src={`${import.meta.env.VITE_IMAGE_URL_PREFIX}/${image.url}`}
                                alt={`image-${index}`}
                                wrapperClassName='h-full w-full'
                                className='!h-full !w-full !object-cover'
                                preview
                            />
                        </div>
                    ))
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    ) : (
        <Fragment />
    )
}

export default DatingProfile
