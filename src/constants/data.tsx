import { routes } from '~/config'

export const HEADER_MENU_ITEMS: {
    title: string
    path: string
    nav_color: string
    menu_color: string
    renderIcon: ({ color, fontSize }: { color: string; fontSize: string }) => JSX.Element
}[] = [
    {
        title: 'Trang chủ',
        path: routes.welcome,
        nav_color: '#c24269',
        menu_color: '#ff5722',
        renderIcon: ({ color, fontSize }: { color: string; fontSize: string }) => (
            <svg
                className='transition-all'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 20'
                style={{ color, width: fontSize, height: fontSize }}
            >
                <path d='m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z' />
            </svg>
        )
    },
    {
        title: 'Đăng nhập',
        path: routes.login,
        nav_color: '#26a69a',
        menu_color: '#795548',
        renderIcon: ({ color, fontSize }: { color: string; fontSize: string }) => (
            <svg
                className='transition-all'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 20'
                style={{ color, width: fontSize, height: fontSize }}
            >
                <path d='m7.164 3.805-4.475.38L.327 6.546a1.114 1.114 0 0 0 .63 1.89l3.2.375 3.007-5.006ZM11.092 15.9l.472 3.14a1.114 1.114 0 0 0 1.89.63l2.36-2.362.38-4.475-5.102 3.067Zm8.617-14.283A1.613 1.613 0 0 0 18.383.291c-1.913-.33-5.811-.736-7.556 1.01-1.98 1.98-6.172 9.491-7.477 11.869a1.1 1.1 0 0 0 .193 1.316l.986.985.985.986a1.1 1.1 0 0 0 1.316.193c2.378-1.3 9.889-5.5 11.869-7.477 1.746-1.745 1.34-5.643 1.01-7.556Zm-3.873 6.268a2.63 2.63 0 1 1-3.72-3.72 2.63 2.63 0 0 1 3.72 3.72Z' />
            </svg>
        )
    },
    {
        title: 'Đăng ký',
        path: routes.register,
        nav_color: '#607d8b',
        menu_color: '#546e7a',
        renderIcon: ({ color, fontSize }: { color: string; fontSize: string }) => (
            <svg
                className='transition-all'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 21 20'
                style={{ color, width: fontSize, height: fontSize }}
            >
                <path d='M20.168 6.136 14.325.293a1 1 0 0 0-1.414 0l-1.445 1.444a1 1 0 0 0 0 1.414l5.844 5.843a1 1 0 0 0 1.414 0l1.444-1.444a1 1 0 0 0 0-1.414Zm-4.205 2.927L11.4 4.5a1 1 0 0 0-1-.25L4.944 5.9a1 1 0 0 0-.652.624L.518 17.206a1 1 0 0 0 .236 1.04l.023.023 6.606-6.606a2.616 2.616 0 1 1 3.65 1.304 2.615 2.615 0 0 1-2.233.108l-6.61 6.609.024.023a1 1 0 0 0 1.04.236l10.682-3.773a1 1 0 0 0 .624-.653l1.653-5.457a.999.999 0 0 0-.25-.997Z' />
                <path d='M10.233 11.1a.613.613 0 1 0-.867-.868.613.613 0 0 0 .867.868Z' />
            </svg>
        )
    }
]
