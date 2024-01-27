import { routes } from '~/config'
import { NotificationTag, NotificationType } from './enums'

type HeaderNavItemType = {
    path: string
    color: string
    icon: JSX.Element
}

type HeaderMenuItemType = {
    title: string
    path?: string
} & Omit<HeaderNavItemType, 'path'>

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
        path: routes.myProfile,
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
        title: 'Trò chuyện',
        path: routes.chat,
        color: '#26a69a',
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

export const NOTIFICATION_ITEMS: Record<NotificationType, { title: string; icon: JSX.Element; color: string }> = {
    new_post: {
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
    },
    like: {
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
    share: {
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
    comment: {
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
    }
}
