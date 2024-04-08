import images from '~/assets/images'
import { Sex } from '~/constants/enums'
import { MBTI_TYPES } from '~/constants/interfaceData'
import { DatingProfile } from '~/types/datingUsers.types'

type DatingProfileCardProps = {
    datingProfile: DatingProfile
    mode?: 'light' | 'dark'
}

function DatingProfileCard({ datingProfile, mode = 'light' }: DatingProfileCardProps) {
    return (
        <div
            className={`flex h-[180px] w-full overflow-hidden rounded-2xl ${
                mode === 'light' ? 'bg-[#e5e2e5] text-[#333]' : 'bg-[#d6d6d6]/15'
            }`}
        >
            <div className='aspect-[3/4] h-full max-w-[calc(100%/3)] flex-shrink-0'>
                <img
                    src={
                        datingProfile.avatar
                            ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${datingProfile.avatar}`
                            : images.avatar
                    }
                    alt='avatar'
                    className='h-full w-full object-cover'
                />
            </div>

            <div className='mx-2 h-full flex-[1] py-2'>
                <div className='flex items-center gap-2'>
                    <h2 className='line-clamp-2 text-lg font-semibold leading-6'>{datingProfile.name}</h2>
                    {datingProfile.sex === Sex.Male ? (
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
                {datingProfile.mbti_type && (
                    <div
                        className='mt-1 h-5 w-max rounded-full px-2 text-xs font-medium leading-5 text-white'
                        style={{ backgroundColor: MBTI_TYPES[datingProfile.mbti_type].color }}
                    >
                        {datingProfile.mbti_type} - {MBTI_TYPES[datingProfile.mbti_type].title}
                    </div>
                )}
                <p className='mt-1 text-sm'>
                    <span className='font-medium'>Tuổi: </span>
                    {datingProfile.age}
                </p>
                <p className='mt-1 text-sm'>
                    <span className='font-medium'>Chiều cao: </span>
                    {datingProfile.height} cm
                </p>
                <p className='mt-1 text-sm'>
                    <span className='font-medium'>Quê quán: </span>
                    {datingProfile.hometown}
                </p>
                <p className='mt-1 text-sm'>
                    <span className='font-medium'>Ngôn ngữ: </span>
                    {datingProfile.language}
                </p>
            </div>
        </div>
    )
}

export default DatingProfileCard
