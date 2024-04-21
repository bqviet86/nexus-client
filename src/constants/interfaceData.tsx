import { routes } from '~/config'
import {
    MBTIDimension,
    MBTIType,
    NotificationFriendAction,
    NotificationPostAction,
    NotificationTag,
    NotificationType
} from './enums'
import { NotificationAction } from '~/types/notifications.types'
import { getUserFromLS } from '~/utils/localStorage'
import { stringEnumToArray } from '~/utils/handle'

type HeaderNavItemType = {
    path: string
    color: string
    icon: JSX.Element
}

type HeaderMenuItemType = {
    title: string
    path?: string
} & Omit<HeaderNavItemType, 'path'>

const user = getUserFromLS()

export const HEADER_NAV_ITEMS_NOT_LOGGED_IN: HeaderNavItemType[] = [
    {
        path: routes.welcome,
        color: '#c24269',
        icon: (
            <svg
                className='h-[20px] w-[20px] text-[#c24269]'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 20'
            >
                <path d='m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z' />
            </svg>
        )
    },
    {
        path: routes.login,
        color: '#26a69a',
        icon: (
            <svg
                className='h-[20px] w-[20px] text-[#26a69a]'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 20'
            >
                <path d='m7.164 3.805-4.475.38L.327 6.546a1.114 1.114 0 0 0 .63 1.89l3.2.375 3.007-5.006ZM11.092 15.9l.472 3.14a1.114 1.114 0 0 0 1.89.63l2.36-2.362.38-4.475-5.102 3.067Zm8.617-14.283A1.613 1.613 0 0 0 18.383.291c-1.913-.33-5.811-.736-7.556 1.01-1.98 1.98-6.172 9.491-7.477 11.869a1.1 1.1 0 0 0 .193 1.316l.986.985.985.986a1.1 1.1 0 0 0 1.316.193c2.378-1.3 9.889-5.5 11.869-7.477 1.746-1.745 1.34-5.643 1.01-7.556Zm-3.873 6.268a2.63 2.63 0 1 1-3.72-3.72 2.63 2.63 0 0 1 3.72 3.72Z' />
            </svg>
        )
    },
    {
        path: routes.register,
        color: '#607d8b',
        icon: (
            <svg
                className='h-[20px] w-[20px] text-[#607d8b]'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 21 20'
            >
                <path d='M20.168 6.136 14.325.293a1 1 0 0 0-1.414 0l-1.445 1.444a1 1 0 0 0 0 1.414l5.844 5.843a1 1 0 0 0 1.414 0l1.444-1.444a1 1 0 0 0 0-1.414Zm-4.205 2.927L11.4 4.5a1 1 0 0 0-1-.25L4.944 5.9a1 1 0 0 0-.652.624L.518 17.206a1 1 0 0 0 .236 1.04l.023.023 6.606-6.606a2.616 2.616 0 1 1 3.65 1.304 2.615 2.615 0 0 1-2.233.108l-6.61 6.609.024.023a1 1 0 0 0 1.04.236l10.682-3.773a1 1 0 0 0 .624-.653l1.653-5.457a.999.999 0 0 0-.25-.997Z' />
                <path d='M10.233 11.1a.613.613 0 1 0-.867-.868.613.613 0 0 0 .867.868Z' />
            </svg>
        )
    }
]

export const HEADER_NAV_ITEMS_LOGGED_IN: HeaderNavItemType[] = [
    {
        path: routes.home,
        color: '#c24269',
        icon: (
            <svg
                className='h-[20px] w-[20px] text-[#c24269]'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 20'
            >
                <path d='m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z' />
            </svg>
        )
    },
    {
        path: routes.chat,
        color: '#26a69a',
        icon: (
            <svg
                className='h-[20px] w-[20px] text-[#26a69a]'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 18'
            >
                <path d='M18 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3.546l3.2 3.659a1 1 0 0 0 1.506 0L13.454 14H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-8 10H5a1 1 0 0 1 0-2h5a1 1 0 1 1 0 2Zm5-4H5a1 1 0 0 1 0-2h10a1 1 0 1 1 0 2Z' />
            </svg>
        )
    },
    {
        path: routes.dating,
        color: '#e41e3f',
        icon: (
            <svg
                className='h-[24px] w-[24px] text-[#e41e3f]'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 24 24'
            >
                <path d='m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z' />
            </svg>
        )
    }
]

export const HEADER_MENU_ITEMS_NOT_LOGGED_IN: HeaderMenuItemType[] = [
    {
        title: 'Chào mừng',
        path: routes.welcome,
        color: '#ff5722',
        icon: (
            <svg
                className='h-[16px] w-[16px] text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 20'
            >
                <path d='m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z' />
            </svg>
        )
    },
    {
        title: 'Đăng nhập',
        path: routes.login,
        color: '#795548',
        icon: (
            <svg
                className='h-[16px] w-[16px] text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 20'
            >
                <path d='m7.164 3.805-4.475.38L.327 6.546a1.114 1.114 0 0 0 .63 1.89l3.2.375 3.007-5.006ZM11.092 15.9l.472 3.14a1.114 1.114 0 0 0 1.89.63l2.36-2.362.38-4.475-5.102 3.067Zm8.617-14.283A1.613 1.613 0 0 0 18.383.291c-1.913-.33-5.811-.736-7.556 1.01-1.98 1.98-6.172 9.491-7.477 11.869a1.1 1.1 0 0 0 .193 1.316l.986.985.985.986a1.1 1.1 0 0 0 1.316.193c2.378-1.3 9.889-5.5 11.869-7.477 1.746-1.745 1.34-5.643 1.01-7.556Zm-3.873 6.268a2.63 2.63 0 1 1-3.72-3.72 2.63 2.63 0 0 1 3.72 3.72Z' />
            </svg>
        )
    },
    {
        title: 'Đăng ký',
        path: routes.register,
        color: '#546e7a',
        icon: (
            <svg
                className='h-[16px] w-[16px] text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 21 20'
            >
                <path d='M20.168 6.136 14.325.293a1 1 0 0 0-1.414 0l-1.445 1.444a1 1 0 0 0 0 1.414l5.844 5.843a1 1 0 0 0 1.414 0l1.444-1.444a1 1 0 0 0 0-1.414Zm-4.205 2.927L11.4 4.5a1 1 0 0 0-1-.25L4.944 5.9a1 1 0 0 0-.652.624L.518 17.206a1 1 0 0 0 .236 1.04l.023.023 6.606-6.606a2.616 2.616 0 1 1 3.65 1.304 2.615 2.615 0 0 1-2.233.108l-6.61 6.609.024.023a1 1 0 0 0 1.04.236l10.682-3.773a1 1 0 0 0 .624-.653l1.653-5.457a.999.999 0 0 0-.25-.997Z' />
                <path d='M10.233 11.1a.613.613 0 1 0-.867-.868.613.613 0 0 0 .867.868Z' />
            </svg>
        )
    }
]

export const HEADER_MENU_ITEMS_LOGGED_IN: HeaderMenuItemType[] = [
    {
        title: 'Trang cá nhân',
        path: routes.profile.replace(':profile_id', user?._id || ''),
        color: '#ff5722',
        icon: (
            <svg
                className='h-[18px] w-[18px] text-white'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
            >
                <path
                    fillRule='evenodd'
                    d='M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z'
                    clipRule='evenodd'
                />
            </svg>
        )
    },
    {
        title: 'Cập nhật hồ sơ',
        path: routes.updateProfile,
        color: '#795548',
        icon: (
            <svg
                className='h-[18px] w-[18px] text-white'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
            >
                <path
                    fillRule='evenodd'
                    d='M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z'
                    clipRule='evenodd'
                />
            </svg>
        )
    },
    {
        title: 'Đăng xuất',
        color: '#546e7a',
        icon: (
            <svg
                className='mr-1 h-[15px] w-[15px] translate-x-0.5 text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 16 16'
            >
                <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3'
                />
            </svg>
        )
    }
]

export const HEADER_MENU_ITEMS_LOGGED_IN_MOBILE: HeaderMenuItemType[] = [
    {
        title: 'Trang chủ',
        path: routes.home,
        color: '#c24269',
        icon: (
            <svg
                className='mr-[3px] h-[15px] w-[15px] text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 20'
            >
                <path d='m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z' />
            </svg>
        )
    },
    {
        title: 'Trò chuyện',
        path: routes.chat,
        color: '#26a69a',
        icon: (
            <svg
                className='mr-[3px] h-[15px] w-[15px] text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 18'
            >
                <path d='M18 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3.546l3.2 3.659a1 1 0 0 0 1.506 0L13.454 14H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-8 10H5a1 1 0 0 1 0-2h5a1 1 0 1 1 0 2Zm5-4H5a1 1 0 0 1 0-2h10a1 1 0 1 1 0 2Z' />
            </svg>
        )
    },
    {
        title: 'Hẹn hò',
        path: routes.dating,
        color: '#e41e3f',
        icon: (
            <svg
                className='h-[18px] w-[18px] text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 24 24'
            >
                <path d='m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z' />
            </svg>
        )
    },
    ...HEADER_MENU_ITEMS_LOGGED_IN
]

export const MEDIAS_MAX_LENGTH: number = 5

export const MEDIAS_GRID_TEMPLATE_AREAS: Record<number, string> = {
    1: 'grid-areas-medias-1',
    2: 'grid-areas-medias-2',
    3: 'grid-areas-medias-3',
    4: 'grid-areas-medias-4',
    5: 'grid-areas-medias-5'
}

export const MEDIAS_GRID_AREA: Record<number, string> = {
    1: 'grid-in-media-1',
    2: 'grid-in-media-2',
    3: 'grid-in-media-3',
    4: 'grid-in-media-4',
    5: 'grid-in-media-5'
}

export type NotificationItemType = { title: string; icon: JSX.Element; color: string }

export type NotificationItemsType = Partial<Record<NotificationAction, NotificationItemType>>

export const NOTIFICATION_SOCKET_EVENTS: string[] = [
    ...stringEnumToArray(NotificationPostAction),
    ...stringEnumToArray(NotificationFriendAction)
]

export const NOTIFICATION_TAG_BUTTONS: { title: string; tagname: NotificationTag }[] = [
    {
        title: 'Tất cả',
        tagname: NotificationTag.All
    },
    {
        title: 'Chưa đọc',
        tagname: NotificationTag.Unread
    },
    {
        title: 'Đã đọc',
        tagname: NotificationTag.Read
    }
]

export const NOTIFICATION_ITEMS: Record<NotificationType, NotificationItemsType> = {
    post: {
        like_post: {
            title: '{{user_from}} đã thích bài viết của bạn',
            icon: (
                <svg
                    className='h-[20px] w-[20px] text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                >
                    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                    <g id='SVGRepo_iconCarrier'>
                        <path d='M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z' />
                    </g>
                </svg>
            ),
            color: '#f93042'
        },
        comment_post: {
            title: '{{user_from}} đã bình luận về bài viết của bạn',
            icon: (
                <svg
                    className='h-[20px] w-[20px] text-white'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                >
                    <path
                        fillRule='evenodd'
                        d='M3 6c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6.6l-2.9 2.6c-1 .9-2.5.2-2.5-1.1V17H5a2 2 0 0 1-2-2V6Zm4 2a1 1 0 0 0 0 2h5a1 1 0 1 0 0-2H7Zm8 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2Zm-8 3a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H7Zm5 0a1 1 0 1 0 0 2h5a1 1 0 1 0 0-2h-5Z'
                        clipRule='evenodd'
                    />
                </svg>
            ),
            color: '#44cf67'
        },
        share_post: {
            title: '{{user_from}} đã chia sẻ bài viết của bạn',
            icon: (
                <svg
                    className='h-[20px] w-[20px] text-white'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                >
                    <path
                        fillRule='evenodd'
                        d='M4 5a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4Zm0 6h16v6H4v-6Z'
                        clipRule='evenodd'
                    />
                    <path
                        fillRule='evenodd'
                        d='M5 14c0-.6.4-1 1-1h2a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Zm5 0c0-.6.4-1 1-1h5a1 1 0 1 1 0 2h-5a1 1 0 0 1-1-1Z'
                        clipRule='evenodd'
                    />
                </svg>
            ),
            color: '#138df0'
        },
        handle_post_success: {
            title: 'Bài viết của bạn đã được xử lý xong',
            icon: (
                <svg
                    className='h-[20px] w-[20px] text-white'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                >
                    <path d='M17.1 12.6v-1.8A5.4 5.4 0 0 0 13 5.6V3a1 1 0 0 0-2 0v2.4a5.4 5.4 0 0 0-4 5.5v1.8c0 2.4-1.9 3-1.9 4.2 0 .6 0 1.2.5 1.2h13c.5 0 .5-.6.5-1.2 0-1.2-1.9-1.8-1.9-4.2Zm-13.2-.8a1 1 0 0 1-1-1c0-2.3.9-4.6 2.5-6.4a1 1 0 1 1 1.5 1.4 7.4 7.4 0 0 0-2 5 1 1 0 0 1-1 1Zm16.2 0a1 1 0 0 1-1-1c0-1.8-.7-3.6-2-5a1 1 0 0 1 1.5-1.4c1.6 1.8 2.5 4 2.5 6.4a1 1 0 0 1-1 1ZM8.8 19a3.5 3.5 0 0 0 6.4 0H8.8Z' />
                </svg>
            ),
            color: '#585c61'
        }
    },
    friend: {
        send_friend_request: {
            title: '{{user_from}} đã gửi cho bạn lời mời kết bạn.',
            icon: (
                <svg
                    className='h-[20px] w-[20px] text-white'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <g strokeWidth='0'></g>
                    <g strokeLinecap='round' strokeLinejoin='round'></g>
                    <g>
                        <circle cx='12' cy='6' r='4' fill='currentColor'></circle>
                        <path
                            d='M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z'
                            fill='currentColor'
                        />
                    </g>
                </svg>
            ),
            color: '#138df0'
        },
        accept_friend_request: {
            title: '{{user_from}} đã chấp nhận lời mời kết bạn của bạn.',
            icon: (
                <svg
                    className='h-[20px] w-[20px] text-white'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <g strokeWidth='0' />
                    <g strokeLinecap='round' strokeLinejoin='round' />
                    <g>
                        <circle cx='12' cy='6' r='4' fill='currentColor' />
                        <path
                            d='M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z'
                            fill='currentColor'
                        />
                    </g>
                </svg>
            ),
            color: '#138df0'
        }
    }
}

type DatingHeaderMenuItemType = {
    title: string
    path?: string
    icon: JSX.Element
}

export const DATING_HEADER_MENU_ITEMS: DatingHeaderMenuItemType[] = [
    {
        title: 'Trang cá nhân',
        path: routes.datingProfile,
        icon: (
            <svg
                className='h-[18px] w-[18px]'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
            >
                <path
                    fillRule='evenodd'
                    d='M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z'
                    clipRule='evenodd'
                />
            </svg>
        )
    },
    {
        title: 'Cập nhật hồ sơ',
        path: routes.datingUpdateProfile,
        icon: (
            <svg
                className='h-[18px] w-[18px]'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
            >
                <path
                    fillRule='evenodd'
                    d='M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z'
                    clipRule='evenodd'
                />
            </svg>
        )
    },
    {
        title: 'Trắc nghiệm tính cách',
        path: routes.datingPersonalityTest,
        icon: (
            <svg
                className='ml-0.5 h-[16px] w-[16px]'
                viewBox='0 0 48 48'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
            >
                <g>
                    <path d='M10 29V26H13V29H10Z' fill='currentColor' />
                    <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M32 44H8C5.79086 44 4 42.2091 4 40V8C4 5.79086 5.79086 4 8 4H32C34.2091 4 36 5.79086 36 8V40C36 42.2091 34.2091 44 32 44ZM18 13C18 12.4477 18.4477 12 19 12H31C31.5523 12 32 12.4477 32 13C32 13.5523 31.5523 14 31 14H19C18.4477 14 18 13.5523 18 13ZM19 16C18.4477 16 18 16.4477 18 17C18 17.5523 18.4477 18 19 18H31C31.5523 18 32 17.5523 32 17C32 16.4477 31.5523 16 31 16H19ZM15.7071 12.2929C16.0976 12.6834 16.0976 13.3166 15.7071 13.7071L11 18.4142L8.29289 15.7071C7.90237 15.3166 7.90237 14.6834 8.29289 14.2929C8.68342 13.9024 9.31658 13.9024 9.70711 14.2929L11 15.5858L14.2929 12.2929C14.6834 11.9024 15.3166 11.9024 15.7071 12.2929ZM19 24C18.4477 24 18 24.4477 18 25C18 25.5523 18.4477 26 19 26H31C31.5523 26 32 25.5523 32 25C32 24.4477 31.5523 24 31 24H19ZM18 29C18 28.4477 18.4477 28 19 28H31C31.5523 28 32 28.4477 32 29C32 29.5523 31.5523 30 31 30H19C18.4477 30 18 29.5523 18 29ZM14 24H9C8.44772 24 8 24.4477 8 25V30C8 30.5523 8.44772 31 9 31H14C14.5523 31 15 30.5523 15 30V25C15 24.4477 14.5523 24 14 24Z'
                        fill='currentColor'
                    />
                    <path fillRule='evenodd' clipRule='evenodd' d='M44 40L41 44L38 40V22H44V40Z' fill='currentColor' />
                    <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M40 15H42C43.1046 15 44 15.8954 44 17V21H38V17C38 15.8954 38.8954 15 40 15Z'
                        fill='currentColor'
                    />
                </g>
            </svg>
        )
    },
    {
        title: 'Đăng xuất',
        icon: (
            <svg
                className='mr-1 h-[15px] w-[15px] translate-x-0.5'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 16 16'
            >
                <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3'
                />
            </svg>
        )
    }
]

type DatingFooterItemType = {
    path: string
    icon: JSX.Element
    activeIcon: JSX.Element
}

export const DATING_FOOTER_ITEMS: DatingFooterItemType[] = [
    {
        path: routes.datingCallHistory,
        icon: (
            <svg
                className='h-7 w-7'
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
        ),
        activeIcon: (
            <svg
                className='h-7 w-7'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 24 24'
            >
                <path d='M7.978 4a2.553 2.553 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572 1.68 1.679 3.577 3.018 5.57 3.459 2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.689 2.689 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.692 2.692 0 0 0 0-3.803l-1.21-1.211A2.555 2.555 0 0 0 7.978 4Z' />
            </svg>
        )
    },
    {
        path: routes.datingChat,
        icon: (
            <svg
                className='h-7 w-7'
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
                    d='M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z'
                />
            </svg>
        ),
        activeIcon: (
            <svg
                className='h-7 w-7'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 24 24'
            >
                <path
                    fillRule='evenodd'
                    d='M4 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1v2a1 1 0 0 0 1.707.707L9.414 13H15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Z'
                    clipRule='evenodd'
                />
                <path
                    fillRule='evenodd'
                    d='M8.023 17.215c.033-.03.066-.062.098-.094L10.243 15H15a3 3 0 0 0 3-3V8h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-1.707.707L14.586 18H9a1 1 0 0 1-.977-.785Z'
                    clipRule='evenodd'
                />
            </svg>
        )
    },
    {
        path: routes.dating,
        icon: (
            <svg
                className='h-7 w-7'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                fill='none'
                viewBox='0 0 24 24'
            >
                <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5'
                />
            </svg>
        ),
        activeIcon: (
            <svg
                className='h-7 w-7'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 24 24'
            >
                <path
                    fillRule='evenodd'
                    d='M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z'
                    clipRule='evenodd'
                />
            </svg>
        )
    },
    {
        path: routes.datingNotification,
        icon: (
            <svg
                className='h-7 w-7'
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
                    d='M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z'
                />
            </svg>
        ),
        activeIcon: (
            <svg
                className='h-7 w-7'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 24 24'
            >
                <path d='M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z' />
            </svg>
        )
    },
    {
        path: routes.datingProfile,
        icon: (
            <svg
                className='h-7 w-7'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
            >
                <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeWidth='2'
                    d='M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                />
            </svg>
        ),
        activeIcon: (
            <svg
                className='h-7 w-7'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 24 24'
            >
                <path
                    fillRule='evenodd'
                    d='M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H6Zm7.25-2.095c.478-.86.75-1.85.75-2.905a5.973 5.973 0 0 0-.75-2.906 4 4 0 1 1 0 5.811ZM15.466 20c.34-.588.535-1.271.535-2v-1a5.978 5.978 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-4.535Z'
                    clipRule='evenodd'
                />
            </svg>
        )
    }
]

export const MBTI_TYPES: Record<MBTIType, { title: string; path: string; color: string }> = {
    ESTJ: {
        title: 'Người điều hành',
        path: 'https://www.16personalities.com/vi/lo%E1%BA%A1i-t%C3%ADnh-c%C3%A1ch-estj',
        color: '#4298b4'
    },
    ESTP: {
        title: 'Người doanh nhân',
        path: 'https://www.16personalities.com/vi/lo%E1%BA%A1i-t%C3%ADnh-c%C3%A1ch-estp',
        color: '#d8a537'
    },
    ESFJ: {
        title: 'Người lãnh sự',
        path: 'https://www.16personalities.com/vi/lo%E1%BA%A1i-t%C3%ADnh-c%C3%A1ch-esfj',
        color: '#4298b4'
    },
    ESFP: {
        title: 'Nguời trình diễn',
        path: 'https://www.16personalities.com/vi/lo%E1%BA%A1i-t%C3%ADnh-c%C3%A1ch-esfp',
        color: '#d8a537'
    },
    ENTJ: {
        title: 'Người chỉ huy',
        path: 'https://www.16personalities.com/vi/lo%E1%BA%A1i-t%C3%ADnh-c%C3%A1ch-entj',
        color: '#88619a'
    },
    ENTP: {
        title: 'Người đàm phán',
        path: 'https://www.16personalities.com/vi/lo%E1%BA%A1i-t%C3%ADnh-c%C3%A1ch-entp',
        color: '#88619a'
    },
    ENFJ: {
        title: 'Người hướng dẫn',
        path: 'https://www.16personalities.com/vi/lo%E1%BA%A1i-t%C3%ADnh-c%C3%A1ch-enfj',
        color: '#33a474'
    },
    ENFP: {
        title: 'Người truyền cảm hứng',
        path: 'https://www.16personalities.com/vi/lo%E1%BA%A1i-t%C3%ADnh-c%C3%A1ch-enfp',
        color: '#33a474'
    },
    ISTJ: {
        title: 'Nhà suy luận',
        path: 'https://www.16personalities.com/vi/lo%E1%BA%A1i-t%C3%ADnh-c%C3%A1ch-istj',
        color: '#4298b4'
    },
    ISTP: {
        title: 'Nghệ sĩ bậc thầy',
        path: 'https://www.16personalities.com/vi/lo%E1%BA%A1i-t%C3%ADnh-c%C3%A1ch-istp',
        color: '#d8a537'
    },
    ISFJ: {
        title: 'Người bảo vệ',
        path: 'https://www.16personalities.com/vi/lo%E1%BA%A1i-t%C3%ADnh-c%C3%A1ch-isfj',
        color: '#4298b4'
    },
    ISFP: {
        title: 'Nhà phiêu lưu',
        path: 'https://www.16personalities.com/vi/lo%E1%BA%A1i-t%C3%ADnh-c%C3%A1ch-isfp',
        color: '#d8a537'
    },
    INTJ: {
        title: 'Nguời kiến tạo',
        path: 'https://www.16personalities.com/vi/lo%E1%BA%A1i-t%C3%ADnh-c%C3%A1ch-intj',
        color: '#88619a'
    },
    INTP: {
        title: 'Nhà tư duy',
        path: 'https://www.16personalities.com/vi/lo%E1%BA%A1i-t%C3%ADnh-c%C3%A1ch-intp',
        color: '#88619a'
    },
    INFJ: {
        title: 'Người cố vấn',
        path: 'https://www.16personalities.com/vi/lo%E1%BA%A1i-t%C3%ADnh-c%C3%A1ch-infj',
        color: '#33a474'
    },
    INFP: {
        title: 'Người hoà giải',
        path: 'https://www.16personalities.com/vi/lo%E1%BA%A1i-t%C3%ADnh-c%C3%A1ch-infp',
        color: '#33a474'
    }
}

export const DATING_CALL_REVIEWS: string[] = [
    'hiểu biết',
    'trưởng thành',
    'tinh tế',
    'thú vị',
    'tự tin',
    'dễ thương',
    'dịu dàng',
    'giọng hay',
    'hài hước',
    'thân thiện',
    'ít nói',
    'nói quá nhiều',
    'chưa trưởng thành',
    'ít chủ động',
    'ngại ngùng',
    'chưa có chính kiến',
    'không thoải mái',
    'nhạt nhẽo',
    'lạnh lùng',
    'khó chịu',
    'thô lỗ',
    'quấy rối',
    'khoe khoang',
    'bất lịch sự'
]

// Admin
type AdminRouteType = {
    path: string
    title: string
    icon: JSX.Element
}

export const ADMIN_SIDEBAR_ROUTES: AdminRouteType[] = [
    {
        path: routes.adminStats,
        title: 'Thống kê',
        icon: (
            <svg
                className='mr-2 h-6 w-6 text-[#e4e6eb]'
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
                    d='M9.143 4H4.857A.857.857 0 0 0 4 4.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 10 9.143V4.857A.857.857 0 0 0 9.143 4Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 20 9.143V4.857A.857.857 0 0 0 19.143 4Zm-10 10H4.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286A.857.857 0 0 0 9.143 14Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z'
                />
            </svg>
        )
    },
    {
        path: `${routes.adminUsers}?page=1`,
        title: 'Quản lý người dùng',
        icon: (
            <svg
                className='mr-2 h-6 w-6 text-[#e4e6eb]'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
            >
                <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeWidth='2'
                    d='M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                />
            </svg>
        )
    },
    {
        path: `${routes.adminConstructiveTests}?page=1`,
        title: 'Câu hỏi kiến tạo',
        icon: (
            <svg
                className='mr-2 h-6 w-6 text-[#e4e6eb]'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
            >
                <g>
                    <path
                        d='M5 11.5C5 9.61438 5 8.67157 5.58579 8.08579C6.17157 7.5 7.11438 7.5 9 7.5H15C16.8856 7.5 17.8284 7.5 18.4142 8.08579C19 8.67157 19 9.61438 19 11.5V12.5C19 14.3856 19 15.3284 18.4142 15.9142C17.8284 16.5 16.8856 16.5 15 16.5H9C7.11438 16.5 6.17157 16.5 5.58579 15.9142C5 15.3284 5 14.3856 5 12.5V11.5Z'
                        stroke='currentColor'
                        strokeWidth='1.5'
                    />
                    <path
                        d='M19 2V2.5C19 3.88071 17.8807 5 16.5 5H7.5C6.11929 5 5 3.88071 5 2.5V2'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                    />
                    <path
                        d='M19 22V21.5C19 20.1193 17.8807 19 16.5 19H7.5C6.11929 19 5 20.1193 5 21.5V22'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                    />
                </g>
            </svg>
        )
    },
    {
        path: `${routes.adminPersonalityTests}?page=1`,
        title: 'Trắc nghiệm tính cách',
        icon: (
            <svg
                className='mr-2 h-6 w-6 text-[#e4e6eb]'
                fill='currentColor'
                viewBox='0 0 32 32'
                id='icon'
                xmlns='http://www.w3.org/2000/svg'
            >
                <g>
                    <path d='M25,23v3H7V16.83l3.59,3.58L12,19,6,13,0,19l1.41,1.41L5,16.83V26a2,2,0,0,0,2,2H25a2,2,0,0,0,2-2V23Z' />
                    <path d='M27,7v9.17l3.59-3.58L32,14l-6,6-6-6,1.41-1.41L25,16.17V7H13V5H25A2,2,0,0,1,27,7Z' />
                    <path d='M8,10H4A2,2,0,0,1,2,8V4A2,2,0,0,1,4,2H8a2,2,0,0,1,2,2V8A2,2,0,0,1,8,10ZM4,4V8H8V4Z' />
                </g>
            </svg>
        )
    }
]

export const MBTI_DIMENSIONS: Record<MBTIDimension, string> = {
    'E-I': 'Extraversion (Hướng ngoại) - Introversion (Hướng nội)',
    'S-N': 'Sensing (Cảm giác) - Intuition (Trực giác)',
    'T-F': 'Thinking (Lý trí) - Feeling (Tình cảm)',
    'J-P': 'Judgment (Nguyên tắc) - Perception (Linh hoạt)'
}
