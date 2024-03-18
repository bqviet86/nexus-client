import { Fragment, useContext, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Avatar, Tooltip } from 'antd'

import Button from '~/components/Button'
import ProfileImageList from '~/components/ProfileImageList'
import CreatePost from '~/components/CreatePost'
import PostList from '~/components/PostList'
import ProfileFriendList from '~/components/ProfileFriendList'
import {
    ResponseFriendRequestReqData,
    cancelFriendRequest,
    getProfile,
    responseFriendRequest,
    sendFriendRequest
} from '~/apis/users.apis'
import images from '~/assets/images'
import { routes } from '~/config'
import { FriendStatus } from '~/constants/enums'
import { AppContext } from '~/contexts/appContext'
import { Profile as ProfileType } from '~/types/users.types'

function Profile() {
    const activeBtnClasses =
        "!relative after:absolute after:bottom-0 after:h-0.5 after:w-3/4 after:rounded-full after:bg-[#2e89ff] after:content-[''] [&>span]:!text-[#2e89ff]"

    const { profile_id } = useParams()

    const { user } = useContext(AppContext)
    const [profile, setProfile] = useState<ProfileType | null>(null)
    const [tab, setTab] = useState<'posts' | 'friends'>('posts')

    useQuery({
        queryKey: ['user', profile_id],
        queryFn: async () => {
            const response = await getProfile(profile_id as string)
            const result = response.data.result as ProfileType

            setProfile(result)

            return result
        },
        enabled: !!profile_id
    })

    const { mutate: mutateSendFriendRequest } = useMutation({
        mutationFn: (user_id: string) => sendFriendRequest(user_id)
    })

    const handleSendFriendRequest = () => {
        mutateSendFriendRequest(profile_id as string, {
            onSuccess: () =>
                setProfile(
                    (prevProfile) =>
                        prevProfile && {
                            ...prevProfile,
                            is_sending: true
                        }
                )
        })
    }

    const { mutate: mutateResponseFriendRequest } = useMutation({
        mutationFn: (data: ResponseFriendRequestReqData) => responseFriendRequest(data)
    })

    const handleResponseFriendRequest = (status: FriendStatus) => {
        mutateResponseFriendRequest(
            { user_id: profile_id as string, status },
            {
                onSuccess: () =>
                    setProfile(
                        (prevProfile) =>
                            prevProfile && {
                                ...prevProfile,
                                is_friend: status === FriendStatus.Accepted,
                                is_receiving: false
                            }
                    )
            }
        )
    }

    const { mutate: mutateCancelFriendRequest } = useMutation({
        mutationFn: (user_id: string) => cancelFriendRequest(user_id)
    })

    const handleCancelFriendRequest = () => {
        mutateCancelFriendRequest(profile_id as string, {
            onSuccess: () =>
                setProfile(
                    (prevProfile) =>
                        prevProfile && {
                            ...prevProfile,
                            is_sending: false
                        }
                )
        })
    }

    return user && profile ? (
        <>
            <div className='-mx-2 bg-white transition-all dark:bg-[#242526]'>
                <div className='mx-auto w-[1080px] max-w-full'>
                    <div className='aspect-[8/3] min-h-[200px] w-full overflow-hidden rounded-b-lg'>
                        <img src={images.cover} alt='cover-image' className='h-full w-full object-cover' />
                    </div>

                    <div className='mx-2 flex flex-col items-center md:mx-5 md:flex-row md:items-start lg:mx-10'>
                        <div className='h-[86px] md:h-[unset]'>
                            <img
                                src={
                                    profile.avatar
                                        ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${profile.avatar}`
                                        : images.avatar
                                }
                                alt='avatar'
                                className='h-[172px] w-[172px] -translate-y-1/2 rounded-full border-[4px] border-solid border-white object-cover transition-all md:-translate-y-8 dark:border-[#242526]'
                            />
                        </div>

                        <div className='mt-4 flex flex-[1] flex-col md:flex-row md:gap-1 lg:ml-4'>
                            <div className='flex-[1]'>
                                <div className='flex flex-col items-center lg:flex-row lg:gap-4'>
                                    <h2 className='line-clamp-1 text-[32px] font-semibold text-[#050505] transition-all dark:text-[#e4e6eb]'>
                                        {profile.name}
                                    </h2>
                                    <p className='line-clamp-1 text-xl transition-all lg:text-2xl dark:text-[#e4e6eb]'>
                                        ({profile.email})
                                    </p>
                                </div>

                                <div className='mt-2 flex flex-col items-center md:flex-row md:justify-center md:gap-4 lg:justify-start'>
                                    <p className='text-[15px] font-medium text-[#65676b] transition-all dark:text-[#b0b3b8]'>
                                        {profile.friend_count} bạn bè
                                    </p>
                                    <Avatar.Group className='mt-2 md:mt-0'>
                                        {profile.friends.map((friend) => (
                                            <Tooltip key={friend._id} title={friend.name} placement='bottom'>
                                                <Link to={routes.profile.replace(':profile_id', friend._id)}>
                                                    <Avatar
                                                        src={
                                                            friend.avatar
                                                                ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${
                                                                      friend.avatar
                                                                  }`
                                                                : images.avatar
                                                        }
                                                    />
                                                </Link>
                                            </Tooltip>
                                        ))}
                                    </Avatar.Group>
                                </div>
                            </div>

                            <div className='flex items-center justify-center py-5 md:items-end md:py-0'>
                                {profile.is_friend ? (
                                    <Button
                                        icon={
                                            <svg
                                                className='h-5 w-5 text-[#fff]'
                                                viewBox='0 0 24 24'
                                                fill='none'
                                                xmlns='http://www.w3.org/2000/svg'
                                            >
                                                <g>
                                                    <path
                                                        stroke='currentColor'
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        strokeWidth='2'
                                                        d='M14 19.2857L15.8 21L20 17M16.5 14.4018C16.2052 14.2315 15.8784 14.1098 15.5303 14.0472C15.4548 14.0337 15.3748 14.024 15.2842 14.0171C15.059 14 14.9464 13.9915 14.7961 14.0027C14.6399 14.0143 14.5527 14.0297 14.4019 14.0723C14.2569 14.1132 13.9957 14.2315 13.4732 14.4682C12.7191 14.8098 11.8817 15 11 15C10.1183 15 9.28093 14.8098 8.52682 14.4682C8.00429 14.2315 7.74302 14.1131 7.59797 14.0722C7.4472 14.0297 7.35983 14.0143 7.20361 14.0026C7.05331 13.9914 6.94079 14 6.71575 14.0172C6.6237 14.0242 6.5425 14.0341 6.46558 14.048C5.23442 14.2709 4.27087 15.2344 4.04798 16.4656C4 16.7306 4 17.0485 4 17.6841V19.4C4 19.9601 4 20.2401 4.10899 20.454C4.20487 20.6422 4.35785 20.7951 4.54601 20.891C4.75992 21 5.03995 21 5.6 21H10.5M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z'
                                                    />
                                                </g>
                                            </svg>
                                        }
                                        className='!h-9 !w-auto !bg-[#0866ff] !px-3 hover:!bg-[#0e7eff] [&>span]:!text-[#fff]'
                                    >
                                        Bạn bè
                                    </Button>
                                ) : profile.is_sending ? (
                                    <Button
                                        icon={
                                            <svg
                                                className='h-5 w-5 text-[#333] transition-all dark:text-[#e4e6eb]'
                                                viewBox='0 0 24 24'
                                                fill='none'
                                                xmlns='http://www.w3.org/2000/svg'
                                            >
                                                <g>
                                                    <path
                                                        stroke='currentColor'
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        strokeWidth='2'
                                                        d='M15 16L17.5 18.5M17.5 18.5L20 21M17.5 18.5L20 16M17.5 18.5L15 21M11 15C10.1183 15 9.28093 14.8098 8.52682 14.4682C8.00429 14.2315 7.74302 14.1131 7.59797 14.0722C7.4472 14.0297 7.35983 14.0143 7.20361 14.0026C7.05331 13.9914 6.94079 14 6.71575 14.0172C6.6237 14.0242 6.5425 14.0341 6.46558 14.048C5.23442 14.2709 4.27087 15.2344 4.04798 16.4656C4 16.7306 4 17.0485 4 17.6841V19.4C4 19.9601 4 20.2401 4.10899 20.454C4.20487 20.6422 4.35785 20.7951 4.54601 20.891C4.75992 21 5.03995 21 5.6 21H11M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z'
                                                    />
                                                </g>
                                            </svg>
                                        }
                                        className='!h-9 !w-auto !bg-[#e4e6eb] !px-3 hover:!bg-[#d8dadf] dark:!bg-[#4e4f50]/50 dark:hover:!bg-[#4e4f50] [&>span]:!text-[#333] dark:[&>span]:!text-[#e4e6eb]'
                                        onClick={handleCancelFriendRequest}
                                    >
                                        Huỷ lời mời
                                    </Button>
                                ) : profile.is_receiving ? (
                                    <>
                                        <Button
                                            className='!h-9 !w-auto !bg-[#0866ff] !px-3 hover:!bg-[#0e7eff] [&>span]:!text-[#fff]'
                                            onClick={() => handleResponseFriendRequest(FriendStatus.Accepted)}
                                        >
                                            Chấp nhận lời mời
                                        </Button>

                                        <Button
                                            className='!h-9 !w-auto !bg-[#e4e6eb] !px-3 hover:!bg-[#d8dadf] dark:!bg-[#4e4f50]/50 dark:hover:!bg-[#4e4f50] [&>span]:!text-[#333] dark:[&>span]:!text-[#e4e6eb]'
                                            onClick={() => handleResponseFriendRequest(FriendStatus.Declined)}
                                        >
                                            Xoá lời mời
                                        </Button>
                                    </>
                                ) : profile.is_declined ? (
                                    <Fragment />
                                ) : profile._id === user._id ? (
                                    <Button
                                        to={routes.updateProfile}
                                        icon={
                                            <svg
                                                className='h-6 w-6 text-[#fff]'
                                                aria-hidden='true'
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                            >
                                                <path
                                                    stroke='currentColor'
                                                    strokeLinecap='square'
                                                    strokeLinejoin='round'
                                                    strokeWidth='2'
                                                    d='M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z'
                                                />
                                            </svg>
                                        }
                                        className='!h-9 !w-auto !bg-[#0866ff] !px-3 hover:!bg-[#0e7eff] [&>span]:!text-[#fff]'
                                    >
                                        Chỉnh sửa trang cá nhân
                                    </Button>
                                ) : (
                                    <Button
                                        icon={
                                            <svg
                                                className='h-6 w-6 text-[#fff]'
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
                                                    d='M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                                                />
                                            </svg>
                                        }
                                        className='!h-9 !w-auto !bg-[#0866ff] !px-3 hover:!bg-[#0e7eff] [&>span]:!text-[#fff]'
                                        onClick={handleSendFriendRequest}
                                    >
                                        Thêm bạn bè
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='mx-10 mt-2 flex justify-center border-t border-solid border-[#cbcdd1] py-1 transition-all md:mt-0 dark:border-[#3d3f41]'>
                        <Button
                            className={`!w-auto max-w-60 !flex-[1] ${
                                tab === 'posts'
                                    ? activeBtnClasses
                                    : '[&>span]:!text-[#333] dark:[&>span]:!text-[#b0b3b8]'
                            }`}
                            onClick={() => setTab('posts')}
                        >
                            Bài viết
                        </Button>

                        <Button
                            className={`!w-auto max-w-60 !flex-[1] ${
                                tab === 'friends'
                                    ? activeBtnClasses
                                    : '[&>span]:!text-[#333] dark:[&>span]:!text-[#b0b3b8]'
                            }`}
                            onClick={() => setTab('friends')}
                        >
                            Bạn bè
                        </Button>
                    </div>
                </div>
            </div>

            <div className='mx-auto my-5 w-[600px] max-w-full lg:w-[800px] lg-xl:w-[1000px]'>
                {tab === 'posts' ? (
                    <div className='flex flex-col flex-nowrap lg:-mx-2.5 lg:flex-row'>
                        <div className='lg:mx-2.5 lg:w-[calc(40%-20px)]'>
                            <ProfileImageList images={profile.images} />
                        </div>

                        <div className='mt-5 flex flex-col justify-center gap-5 lg:mx-2.5 lg:mt-0 lg:w-[calc(60%-20px)]'>
                            {profile_id === user._id && <CreatePost />}
                            <PostList profile_id={profile_id} />
                        </div>
                    </div>
                ) : (
                    <ProfileFriendList profile_id={profile_id || ''} />
                )}
            </div>
        </>
    ) : (
        <Fragment />
    )
}

export default Profile
