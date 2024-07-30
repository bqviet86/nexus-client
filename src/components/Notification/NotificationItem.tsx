import { memo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import parse, { DOMNode, Element as ParserElement, HTMLReactParserOptions, domToReact } from 'html-react-parser'
import Tippy from '@tippyjs/react/headless'

import Button from '~/components/Button'
import { UpdateNotificationReqData, deleteNotification, updateNotification } from '~/apis/notifications.apis'
import { ResponseFriendRequestReqData, responseFriendRequest } from '~/apis/users.apis'
import images from '~/assets/images'
import { envConfig, routes } from '~/config'
import { FriendStatus, NotificationFriendAction, NotificationType } from '~/constants/enums'
import { NOTIFICATION_ITEMS, NotificationItemType } from '~/constants/interfaceData'
import { Notification } from '~/types/notifications.types'
import { Friend, User } from '~/types/users.types'
import { Post } from '~/types/posts.types'
import { formatTime } from '~/utils/handle'

type NotificationItemProps = {
    data: Notification
    notifications: Notification[]
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
    onClick?: () => void
}

function NotificationItem({ data, notifications, setNotifications, onClick }: NotificationItemProps) {
    const { _id, user_from, user_to, type, action, payload, is_read, created_at } = data
    const avatarSuffix = user_from?.avatar ?? user_to.avatar
    const avatar = avatarSuffix ? `${envConfig.imageUrlPrefix}/${avatarSuffix}` : images.avatar
    const { title, icon, color } = NOTIFICATION_ITEMS[type][action] as NotificationItemType

    const parseOptions: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (domNode instanceof ParserElement) {
                const { name, attribs, children } = domNode

                if (name === 'br') {
                    return <> </>
                }

                if (name === 'strong') {
                    return domToReact(children as DOMNode[], parseOptions)
                }

                if (['hashtag', 'text'].includes(attribs.class)) {
                    return <>{domToReact(children as DOMNode[], parseOptions)}</>
                }
            }
        }
    }

    const [friendStatus, setFriendStatus] = useState<FriendStatus | null>(
        type === NotificationType.Friend ? (payload.friend as Friend).status : null
    )
    const [isShowMenuButton, setIsShowMenuButton] = useState<boolean>(false)
    const [isShowMenu, setIsShowMenu] = useState<boolean>(false)

    const itemRef = useRef<HTMLAnchorElement>(null)
    const timeRef = useRef<string>(formatTime(created_at, true))

    const { mutate: mutateUpdateNotification } = useMutation({
        mutationFn: (data: UpdateNotificationReqData) => updateNotification(data),
        onSuccess: (_, { is_read }) =>
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification._id === _id ? { ...notification, is_read } : notification
                )
            )
    })

    const handleClickNotification = () => {
        if (!is_read) {
            mutateUpdateNotification({ notification_id: _id, is_read: true })
        }

        onClick?.()
    }

    const handleMouseEnterButton = () => {
        itemRef.current?.classList.add('!bg-transparent')
    }

    const handleMouseLeaveButton = () => {
        itemRef.current?.classList.remove('!bg-transparent')
    }

    const handleEventElement = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const { mutate: mutateResponseFriendRequest } = useMutation({
        mutationFn: (data: ResponseFriendRequestReqData) => responseFriendRequest(data)
    })

    const handleResponseFriendRequest = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, status: FriendStatus) => {
        handleEventElement(e)
        mutateResponseFriendRequest(
            { user_id: (user_from as User)._id, status },
            { onSuccess: () => setFriendStatus(status) }
        )

        if (!is_read) {
            mutateUpdateNotification({ notification_id: _id, is_read: true })
        }
    }

    const handleReadOrUnreadNotification = () => {
        mutateUpdateNotification(
            { notification_id: _id, is_read: !is_read },
            {
                onSuccess: () => {
                    setIsShowMenu(false)
                    handleMouseLeaveButton()
                }
            }
        )
    }

    const { mutate: mutateDeleteNotification } = useMutation({
        mutationFn: (notification_id: string) => deleteNotification(notification_id)
    })

    const handleDeleteNotification = () => {
        mutateDeleteNotification(_id, {
            onSuccess: () => {
                setNotifications((prevNotifications) =>
                    prevNotifications.filter((notification) => notification._id !== _id)
                )
                setIsShowMenu(false)
                handleMouseLeaveButton()
            }
        })
    }

    return (
        <Link
            ref={itemRef}
            to={
                type === NotificationType.Post
                    ? routes.postDetail.replace(':post_id', (payload.post as Post)._id)
                    : routes.profile.replace(':profile_id', (user_from as User)._id)
            }
            className='relative flex rounded-lg p-2 transition-all hover:bg-[#f2f2f2] dark:hover:bg-[#3a3b3c]'
            onClick={handleClickNotification}
            onMouseOver={() => setIsShowMenuButton(true)}
            onMouseOut={() => !isShowMenu && setIsShowMenuButton(false)}
            onBlur={() => !isShowMenu && setIsShowMenuButton(false)}
        >
            <div className='relative h-[56px] w-[56px] flex-shrink-0 rounded-full'>
                <img src={avatar} alt='avatar' className='h-full w-full rounded-full object-cover' />
                <div
                    className='absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full'
                    style={{ backgroundColor: color }}
                >
                    {icon}
                </div>
            </div>

            <div className='mx-3 flex flex-col'>
                <span
                    className={`line-clamp-3 text-sm transition-all ${
                        is_read ? 'text-[#65676b] dark:text-[#b0b3b8]' : 'text-[#050505] dark:text-[#e4e6eb]'
                    }`}
                >
                    {parse(
                        `${title.replace('{{user_from}}', `<strong>${user_from?.name || ''}</strong>`)}${
                            type === NotificationType.Post && !['', '<br>'].includes((payload.post as Post).content)
                                ? `: ${(payload.post as Post).content}`
                                : ''
                        }`,
                        parseOptions
                    )}
                </span>

                <span
                    className={`mt-0.5 text-xs transition-all ${
                        is_read ? 'text-[#65676b] dark:text-[#b0b3b8]' : 'font-medium text-[#0866ff]'
                    }`}
                >
                    {timeRef.current}
                </span>

                {type === NotificationType.Friend && action === NotificationFriendAction.SendFriendRequest && (
                    <div className='mt-2 flex w-full'>
                        {friendStatus === FriendStatus.Pending ? (
                            <>
                                <Button
                                    className='!h-9 !w-auto !flex-1 !bg-[#0866ff] hover:!bg-[#0e7eff] [&>span]:!text-white'
                                    onMouseEnter={handleMouseEnterButton}
                                    onMouseLeave={handleMouseLeaveButton}
                                    onClick={(e) => handleResponseFriendRequest(e, FriendStatus.Accepted)}
                                >
                                    Xác nhận
                                </Button>
                                <Button
                                    className='!h-9 !w-auto !flex-1 !bg-[#e4e6eb] hover:!bg-[#dfe0e4] dark:!bg-[#4e4f50]/70 dark:hover:!bg-[#4e4f50] [&>span]:!text-[#050505] dark:[&>span]:!text-[#e4e6eb]'
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
                )}
            </div>

            <div className='m-auto flex-shrink-0'>
                <div className={`h-3 w-3 rounded-full ${is_read ? 'bg-transparent' : 'bg-[#0866ff]'}`} />
            </div>

            {action !== NotificationFriendAction.SendFriendRequest && (
                <Tippy
                    visible={isShowMenu}
                    interactive
                    placement={notifications.length > 1 ? 'bottom-end' : 'left'}
                    offset={[0, 8]}
                    onClickOutside={() => setIsShowMenu(false)}
                    render={(attrs) => (
                        <div
                            className='animate-fadeIn rounded-lg bg-white p-1 shadow-[0_0_10px_rgba(0,0,0,.2)] transition-all dark:bg-[#242526]'
                            onMouseEnter={handleMouseEnterButton}
                            onMouseLeave={handleMouseLeaveButton}
                            onClick={handleEventElement}
                            tabIndex={-1}
                            {...attrs}
                        >
                            <div
                                className='flex cursor-pointer items-center rounded-md bg-white px-1 py-2 text-sm transition-all hover:bg-[#f2f2f2] dark:bg-[#242526] dark:hover:bg-[#3a3b3c]'
                                onClick={handleReadOrUnreadNotification}
                            >
                                <svg
                                    className='h-[20px] w-[20px] text-[#050505] transition-all dark:text-[#e4e6eb]'
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
                                        d='m5 12 4.7 4.5 9.3-9'
                                    />
                                </svg>
                                <span className='ml-1 text-[#050505] transition-all dark:text-[#e4e6eb]'>
                                    {is_read ? 'Đánh dấu là chưa đọc' : 'Đánh dấu là đã đọc'}
                                </span>
                            </div>

                            <div
                                className='flex cursor-pointer items-center rounded-md bg-white px-1 py-2 text-sm transition-all hover:bg-[#f2f2f2] dark:bg-[#242526] dark:hover:bg-[#3a3b3c]'
                                onClick={handleDeleteNotification}
                            >
                                <svg
                                    className='h-[20px] w-[20px] text-[#050505] transition-all dark:text-[#e4e6eb]'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth='1.5'
                                    stroke='currentColor'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                                    />
                                </svg>
                                <span className='ml-1 text-[#050505] transition-all dark:text-[#e4e6eb]'>
                                    Gỡ thông báo này
                                </span>
                            </div>
                        </div>
                    )}
                >
                    <div
                        className={`absolute right-7 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-solid border-[rgba(0,0,0,.1)] bg-white shadow-[0_0_10px_rgba(0,0,0,.1)] transition-all hover:bg-[#f2f2f2] dark:bg-[#3e4042] dark:hover:bg-[#4e4f50] ${
                            isShowMenuButton ? 'visible opacity-100' : 'invisible opacity-0'
                        }`}
                        onMouseEnter={handleMouseEnterButton}
                        onMouseLeave={handleMouseLeaveButton}
                        onClick={(e) => {
                            handleEventElement(e)
                            setIsShowMenu((prev) => !prev)
                        }}
                    >
                        <svg
                            className='h-[26px] w-[26px] text-[#606770] transition-all dark:text-[#a8abaf]'
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 24 24'
                            fill='currentColor'
                        >
                            <path
                                fillRule='evenodd'
                                d='M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z'
                                clipRule='evenodd'
                            />
                        </svg>
                    </div>
                </Tippy>
            )}
        </Link>
    )
}

export default memo(NotificationItem)
