import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import Button from '~/components/Button'
import { sendFriendRequest } from '~/apis/users.apis'
import images from '~/assets/images'
import { routes } from '~/config'
import { User } from '~/types/users.types'
import { ErrorResponse } from '~/types/response.types'
import { isAxiosError } from '~/utils/check'

type FriendSuggestItemProps = {
    user: User
}

function FriendSuggestItem({ user }: FriendSuggestItemProps) {
    const [isSendedFriendRequest, setIsSendedFriendRequest] = useState<boolean>(false)

    const itemRef = useRef<HTMLAnchorElement>(null)

    const handleMouseEnterButton = () => {
        itemRef.current?.classList.add('!bg-transparent')
    }

    const handleMouseLeaveButton = () => {
        itemRef.current?.classList.remove('!bg-transparent')
    }

    const { mutate: mutateSendFriendRequest } = useMutation({
        mutationFn: (user_id: string) => sendFriendRequest(user_id)
    })

    const handleSendFriendRequest = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()

        mutateSendFriendRequest(user._id, {
            onSuccess: () => setIsSendedFriendRequest(true),
            onError: (error) => {
                if (isAxiosError<ErrorResponse>(error)) {
                    toast(error.response?.data.message as string)
                }
            }
        })
    }

    return (
        <Link
            ref={itemRef}
            to={routes.profile.replace(':profile_id', user._id)}
            className='flex items-center rounded-lg p-2 transition-all hover:bg-[#f2f2f2] dark:hover:bg-[#3a3b3c]'
        >
            <div className='h-10 w-10 overflow-hidden rounded-full'>
                <img
                    src={user.avatar ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${user.avatar}` : images.avatar}
                    alt='avatar'
                    className='h-full w-full object-cover'
                />
            </div>

            <div className='ml-3 flex flex-1 flex-col'>
                <span className='mb-2 line-clamp-1 text-sm font-medium transition-all dark:text-[#e4e6eb]'>
                    {user.name}
                </span>

                {isSendedFriendRequest ? (
                    <span className='text-[13px] text-[#65676b]'>Đã gửi lời mời kết bạn</span>
                ) : (
                    <Button
                        className='!h-9 !w-[calc(50%-4px)] !flex-1 !bg-[#0866ff] !px-0 hover:!bg-[#0e7eff] [&>span]:!text-white'
                        onMouseEnter={handleMouseEnterButton}
                        onMouseLeave={handleMouseLeaveButton}
                        onClick={(e) => handleSendFriendRequest(e)}
                    >
                        Thêm bạn
                    </Button>
                )}
            </div>
        </Link>
    )
}

export default FriendSuggestItem
