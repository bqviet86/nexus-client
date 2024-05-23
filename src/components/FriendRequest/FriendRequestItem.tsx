import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import Button from '~/components/Button'
import { ResponseFriendRequestReqData, responseFriendRequest } from '~/apis/users.apis'
import images from '~/assets/images'
import { routes } from '~/config'
import { FriendStatus } from '~/constants/enums'
import { Friend } from '~/types/users.types'
import { formatTime } from '~/utils/handle'

type FriendRequestItemProps = {
    friend: Friend
}

function FriendRequestItem({ friend }: FriendRequestItemProps) {
    const [friendStatus, setFriendStatus] = useState<FriendStatus>(friend.status)

    const itemRef = useRef<HTMLAnchorElement>(null)
    const timeRef = useRef<string>(formatTime(friend.created_at))

    const handleMouseEnterButton = () => {
        itemRef.current?.classList.add('!bg-transparent')
    }

    const handleMouseLeaveButton = () => {
        itemRef.current?.classList.remove('!bg-transparent')
    }

    const { mutate: mutateResponseFriendRequest } = useMutation({
        mutationFn: (data: ResponseFriendRequestReqData) => responseFriendRequest(data)
    })

    const handleResponseFriendRequest = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, status: FriendStatus) => {
        e.preventDefault()
        e.stopPropagation()

        mutateResponseFriendRequest(
            { user_id: friend.user_from._id, status },
            { onSuccess: () => setFriendStatus(status) }
        )
    }

    return (
        <Link
            ref={itemRef}
            to={routes.profile.replace(':profile_id', friend.user_from._id)}
            className='flex items-center rounded-lg p-2 transition-all hover:bg-[#f2f2f2] dark:hover:bg-[#3a3b3c]'
        >
            <div className='flex items-center'>
                <img
                    src={
                        friend.user_from.avatar
                            ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${friend.user_from.avatar}`
                            : images.avatar
                    }
                    alt='avatar'
                    className='h-10 w-10 rounded-full object-cover'
                />
            </div>

            <div className='ml-3 flex-1'>
                <div className='flex h-5 items-center justify-between'>
                    <span className='line-clamp-1 text-sm font-medium transition-all dark:text-[#e4e6eb]'>
                        {friend.user_from.name}
                    </span>
                    <span className='ml-3 flex-shrink-0 text-xs text-[#65676b] transition-all dark:text-[#b0b3b8]'>
                        {timeRef.current}
                    </span>
                </div>

                <div className='mt-2 flex'>
                    {friendStatus === FriendStatus.Pending ? (
                        <>
                            <Button
                                className='!h-9 !w-auto !flex-1 !bg-[#0866ff] !px-0 hover:!bg-[#0e7eff] [&>span]:!text-white'
                                onMouseEnter={handleMouseEnterButton}
                                onMouseLeave={handleMouseLeaveButton}
                                onClick={(e) => handleResponseFriendRequest(e, FriendStatus.Accepted)}
                            >
                                Xác nhận
                            </Button>
                            <Button
                                className='!h-9 !w-auto !flex-1 !bg-[#e4e6eb] !px-0 hover:!bg-[#dfe0e4] dark:!bg-[#4e4f50]/70 dark:hover:!bg-[#4e4f50] [&>span]:!text-[#333] dark:[&>span]:!text-[#e4e6eb]'
                                onMouseEnter={handleMouseEnterButton}
                                onMouseLeave={handleMouseLeaveButton}
                                onClick={(e) => handleResponseFriendRequest(e, FriendStatus.Declined)}
                            >
                                Xoá
                            </Button>
                        </>
                    ) : (
                        <span className='text-[13px] text-[#65676b]'>
                            {friendStatus === FriendStatus.Accepted
                                ? 'Đã chấp nhận lời mời kết bạn'
                                : 'Đã từ chối lời mời kết bạn'}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default FriendRequestItem
