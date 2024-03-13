import { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Instance as TippyInstance } from 'tippy.js'
import Tippy from '@tippyjs/react/headless'
import InfiniteScroll from 'react-infinite-scroll-component'

import Button from '~/components/Button'
import Loading from '~/components/Loading'
import NotificationItem from './NotificationItem'
import {
    GetAllNotificationsReqQuery,
    getAllNotifications,
    getUnreadNotifications,
    updateAllNotifications
} from '~/apis/notifications.apis'
import { NotificationTag } from '~/constants/enums'
import { NOTIFICATION_SOCKET_EVENTS, NOTIFICATION_TAG_BUTTONS } from '~/constants/interfaceData'
import { AppContext } from '~/contexts/appContext'
import { useSocket } from '~/hooks'
import { Notification as NotificationResponse } from '~/types/notifications.types'
import { Pagination } from '~/types/commons.types'

const LIMIT = 10

function Notification() {
    const queryClient = useQueryClient()
    const { instance: socket } = useSocket()

    const { user } = useContext(AppContext)
    const [notifications, setNotifications] = useState<NotificationResponse[]>([])
    const [unreadNotificationCount, setUnreadNotificationCount] = useState<number>(0)
    const [showNotification, setShowNotification] = useState<boolean>(false)
    const [tag, setTag] = useState<NotificationTag>(NotificationTag.All)
    const [pagination, setPagination] = useState<Pagination>({ page: 1, total_pages: 0 })

    const handleIncreaseUnreadCount = ({ notification }: { notification: NotificationResponse }) => {
        if (user && notification.user_to._id === user._id) {
            if (
                showNotification &&
                tag !== NotificationTag.Read &&
                !notifications.some((n) => n._id === notification._id)
            ) {
                setNotifications((prevNotifications) => [notification, ...prevNotifications])
            }

            setUnreadNotificationCount((prevUnreadNotificationCount) => prevUnreadNotificationCount + 1)
        }
    }

    useEffect(() => {
        if (socket) {
            NOTIFICATION_SOCKET_EVENTS.forEach((event) => socket.on(event, handleIncreaseUnreadCount))
            return () => NOTIFICATION_SOCKET_EVENTS.forEach((event) => socket.off(event, handleIncreaseUnreadCount))
        }
    }, [socket])

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (e.target instanceof Element && !e.target.closest('.closest-notification')) {
                setShowNotification(false)
            }
        }

        if (showNotification) {
            window.addEventListener('click', handleClick)
        }

        return () => window.removeEventListener('click', handleClick)
    }, [showNotification])

    const handleToggleShowNotification = () => {
        const newShowNotification = !showNotification

        if (newShowNotification) {
            setUnreadNotificationCount(0)
        }

        setShowNotification(newShowNotification)
        setTag(NotificationTag.All)
        setPagination((prevPagination) => ({ ...prevPagination, page: 1 }))
    }

    useQuery({
        queryKey: ['notifications', 'unread'],
        queryFn: async () => {
            const response = await getUnreadNotifications()
            setUnreadNotificationCount(response.data.result?.total_unread as number)
            return response
        }
    })

    const getAllNotificationsQueryFn = async (query: GetAllNotificationsReqQuery) => {
        const response = await getAllNotifications(query)
        const { result } = response.data

        setNotifications((prevNotifications) => {
            const newNotifications = result?.notifications as NotificationResponse[]
            return query.page === 1 ? newNotifications : [...prevNotifications, ...newNotifications]
        })
        setPagination({
            page: result?.page as number,
            total_pages: result?.total_pages as number
        })

        return response
    }

    const { isFetching } = useQuery({
        queryKey: ['notifications', { page: pagination.page, limit: LIMIT, tag }],
        queryFn: () => getAllNotificationsQueryFn({ page: pagination.page, limit: LIMIT, tag }),
        enabled: showNotification && (pagination.page === 1 || pagination.page < pagination.total_pages)
    })

    const handleChangeTag = (tag: NotificationTag) => {
        setTag(tag)
        setPagination((prevPagination) => ({ ...prevPagination, page: 1 }))
    }

    const { mutate: mutateUpdateAllNotifications } = useMutation({
        mutationFn: (body: { is_read: boolean }) => updateAllNotifications(body)
    })

    const handleReadAllNotifications = (tippy: TippyInstance) => {
        mutateUpdateAllNotifications(
            { is_read: true },
            {
                onSuccess: () => {
                    setNotifications((prevNotifications) =>
                        prevNotifications.map((notification) => ({ ...notification, is_read: true }))
                    )
                    tippy.hide()
                }
            }
        )
    }

    const handleFetchMoreNotifications = () => {
        const nextPage = pagination.page + 1

        if (nextPage < pagination.total_pages) {
            setPagination((prevPagination) => ({
                ...prevPagination,
                page: nextPage
            }))
        } else {
            queryClient.fetchQuery({
                queryKey: ['notifications', { page: nextPage, limit: LIMIT, tag }],
                queryFn: () => getAllNotificationsQueryFn({ page: nextPage, limit: LIMIT, tag })
            })
        }
    }

    return (
        <div className='closest-notification relative'>
            <div
                className='relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-solid border-black/30 bg-[#333]/10 transition-all dark:border-[#929292] dark:bg-[#3A3B3C]'
                onClick={handleToggleShowNotification}
            >
                <div
                    className={`absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#e41e3f] text-[11px] font-medium leading-5 text-white ${
                        unreadNotificationCount > 0 ? 'visible opacity-100' : 'invisible opacity-0'
                    }`}
                >
                    {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </div>

                <svg
                    className='h-[20px] w-[20px] text-gray-800 transition-all dark:text-white'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 16 21'
                >
                    <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M8 3.464V1.1m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175C15 15.4 15 16 14.462 16H1.538C1 16 1 15.4 1 14.807c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 8 3.464ZM4.54 16a3.48 3.48 0 0 0 6.92 0H4.54Z'
                    />
                </svg>
            </div>

            <div
                className={`fixed right-2 top-[70px] flex w-[360px] max-w-[calc(100vw-16px)] cursor-auto flex-col overflow-hidden rounded-lg bg-white p-2 shadow-[0_0_28px_-2px_rgba(0,0,0,.3)] transition-all sm:absolute sm:-right-[64px] sm:top-[calc(100%+20px)] dark:bg-[#242526] ${
                    showNotification ? 'visible opacity-100' : 'invisible opacity-0'
                }`}
            >
                <div className='mx-2 flex items-center justify-between'>
                    <h2 className='text-xl font-semibold text-[#050505] transition-all dark:text-[#e4e6eb]'>
                        Thông báo
                    </h2>
                    <Tippy
                        interactive
                        hideOnClick
                        trigger='click'
                        placement='bottom-end'
                        offset={[0, 8]}
                        render={(attrs, _, tippy) => (
                            <div
                                className='animate-fadeIn rounded-lg bg-white p-1 shadow-[0_0_10px_rgba(0,0,0,.2)] transition-all dark:bg-[#242526]'
                                tabIndex={-1}
                                {...attrs}
                            >
                                <div
                                    className='flex cursor-pointer items-center rounded-md bg-white px-1 py-2 text-sm transition-all hover:bg-[#f2f2f2] dark:bg-[#242526] dark:hover:bg-[#3a3b3c]'
                                    onClick={() => handleReadAllNotifications(tippy as TippyInstance)}
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
                                        Đánh dấu tất cả là đã đọc
                                    </span>
                                </div>
                            </div>
                        )}
                    >
                        <div className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all hover:bg-[#f2f2f2] dark:hover:bg-[#3a3b3c]'>
                            <svg
                                className='h-6 w-6 text-[#606770] transition-all dark:text-[#a8abaf]'
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 24 24'
                                fill='currentColor'
                            >
                                <path
                                    fillRule='evenodd'
                                    d='M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z'
                                    clipRule='evenodd'
                                />
                            </svg>
                        </div>
                    </Tippy>
                </div>

                <div className='mx-2 mt-2 flex flex-wrap'>
                    {NOTIFICATION_TAG_BUTTONS.map(({ title, tagname }, index) => (
                        <Button
                            key={index}
                            className={`!h-9 !w-auto !rounded-full ${
                                tag === tagname
                                    ? '!bg-[#ebf5ff] dark:!bg-[#213851] [&>span]:!text-[#1d76d6] dark:[&>span]:!text-[#75b6ff]'
                                    : 'dark:hover:!bg-[#3a3b3c] [&>span]:!text-[#050505] dark:[&>span]:!text-[#e4e6eb]'
                            }`}
                            onClick={() => handleChangeTag(tagname)}
                        >
                            {title}
                        </Button>
                    ))}
                </div>

                <div
                    id='notifications_scrollbar'
                    className='-mr-1.5 mt-2 max-h-[70vh] overflow-y-auto pr-0.5 [&::-webkit-scrollbar-track]:!bg-transparent [&::-webkit-scrollbar]:!w-1.5'
                >
                    {isFetching && pagination.page === 1 ? (
                        <Loading className='my-2 w-full' loaderClassName='dark:!text-[#e4e6eb]' />
                    ) : notifications.length === 0 ? (
                        <div className='my-2 flex flex-col items-center justify-center'>
                            <svg
                                className='h-[32px] w-[32px] text-gray-800 transition-all dark:text-[#e4e6eb]'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path d='M17.1 12.6v-1.8A5.4 5.4 0 0 0 13 5.6V3a1 1 0 0 0-2 0v2.4a5.4 5.4 0 0 0-4 5.5v1.8c0 2.4-1.9 3-1.9 4.2 0 .6 0 1.2.5 1.2h13c.5 0 .5-.6.5-1.2 0-1.2-1.9-1.8-1.9-4.2ZM8.8 19a3.5 3.5 0 0 0 6.4 0H8.8Z' />
                            </svg>
                            <div className='mt-2 text-center text-sm transition-all dark:text-[#e4e6eb]'>
                                Không có thông báo nào
                            </div>
                        </div>
                    ) : (
                        <InfiniteScroll
                            scrollableTarget='notifications_scrollbar'
                            dataLength={notifications.length}
                            hasMore={pagination.page < pagination.total_pages}
                            loader={<Loading className='my-2 w-full' loaderClassName='dark:!text-[#e4e6eb]' />}
                            next={handleFetchMoreNotifications}
                        >
                            {notifications.map((notification) => (
                                <NotificationItem
                                    key={notification._id}
                                    data={notification}
                                    notifications={notifications}
                                    setNotifications={setNotifications}
                                    onClick={() => setShowNotification(false)}
                                />
                            ))}
                        </InfiniteScroll>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Notification
