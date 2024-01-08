import { useContext, useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { nanoid } from 'nanoid'

import { getMe, logoutUser } from '~/apis/users.apis'
import images from '~/assets/images'
import { routes } from '~/config'
import {
    HEADER_MENU_ITEMS_LOGGED_IN,
    HEADER_MENU_ITEMS_LOGGED_IN_MOBILE,
    HEADER_MENU_ITEMS_NOT_LOGGED_IN,
    HEADER_NAV_ITEMS_LOGGED_IN,
    HEADER_NAV_ITEMS_NOT_LOGGED_IN
} from '~/constants/interfaceData'
import { AppContext } from '~/contexts/appContext'
import { User } from '~/types/users.types'
import {
    getAccessTokenFromLS,
    getRefreshTokenFromLS,
    removeTokenFromLS,
    removeUserFromLS,
    setDarkModeToLS,
    setUserToLS
} from '~/utils/localStorage'
import { listenEvent } from '~/utils/event'

function Header() {
    const navigate = useNavigate()

    const { user, setUser, darkMode, setDarkMode } = useContext(AppContext)
    const [showMenu, setShowMenu] = useState<boolean>(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

    const accessToken = getAccessTokenFromLS()
    const refreshToken = getRefreshTokenFromLS()

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (e.target instanceof HTMLElement && !e.target.closest('header')) {
                setShowMenu(false)
            }
        }

        if (showMenu) {
            window.addEventListener('click', handleClick)
        }

        return () => window.removeEventListener('click', handleClick)
    }, [showMenu])

    useEffect(() => {
        const handleResize = () => {
            const isSmallerThanMd = window.innerWidth < 768
            setIsMobile(isSmallerThanMd)
        }

        if (user) {
            window.addEventListener('resize', handleResize)
        }

        return () => window.removeEventListener('resize', handleResize)
    }, [user])

    const handleToggleDarkMode = () => {
        const newDarkMode = !darkMode

        setDarkMode(newDarkMode)
        setDarkModeToLS(newDarkMode)
        document.documentElement.classList.toggle('dark', newDarkMode)
    }

    const { data: myProfile } = useQuery({
        queryKey: ['me'],
        queryFn: () => getMe(),
        enabled: !!accessToken
    })

    useEffect(() => {
        if (myProfile) {
            setUser(myProfile.data.result as User)
            setUserToLS(myProfile.data.result as User)
        }
    }, [myProfile])

    const { mutate: mutateLogout } = useMutation({
        mutationFn: (refresh_token: string) => logoutUser(refresh_token)
    })

    const handleLogoutSuccess = () => {
        setUser(null)
        setShowMenu(false)
        removeUserFromLS()
        removeTokenFromLS()
        navigate(routes.welcome)
    }

    const handleLogout = () => {
        mutateLogout(refreshToken as string, {
            onSuccess: handleLogoutSuccess
        })
    }

    useEffect(() => {
        const remove = listenEvent('force-logout', handleLogoutSuccess)
        return remove
    }, [])

    return (
        <header className='fixed inset-x-0 top-0 z-40 h-[60px] bg-white px-2 shadow-md transition-all dark:bg-[#242526]'>
            <div className='relative mx-auto flex h-full max-w-7xl items-center justify-between'>
                <Link to={routes.home}>
                    <img src={darkMode ? images.logo_dark : images.logo} alt='logo' className='w-10' />
                </Link>

                <ul className='absolute left-1/2 top-0 hidden h-full -translate-x-1/2 items-center md:flex'>
                    {(user ? HEADER_NAV_ITEMS_LOGGED_IN : HEADER_NAV_ITEMS_NOT_LOGGED_IN).map((item) => (
                        <li key={nanoid()} className='relative mx-1'>
                            <NavLink
                                to={item.path}
                                className='flex w-[160px] items-center justify-center rounded-lg px-10 py-3 transition-all hover:bg-[#f0f2f5] dark:hover:bg-[#3A3B3C]'
                            >
                                {({ isActive }) => (
                                    <>
                                        {item.icon}
                                        {isActive && (
                                            <span
                                                className='absolute bottom-0 left-1/2 h-[3.2px] w-3/4 -translate-x-1/2 rounded-full'
                                                style={{ backgroundColor: item.color }}
                                            />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className='flex items-center'>
                    <div className={`relative mr-3${user ? ' flex items-center' : ' md:hidden'}`}>
                        {user && (
                            <div className='flex max-w-[160px] translate-x-4 items-center rounded-s-full bg-[#3f51b5] py-2 pl-4 pr-6 text-sm font-medium text-white'>
                                <span className='line-clamp-1 leading-[14px]'>{user.name}</span>
                            </div>
                        )}

                        <div
                            className={`cursor-pointer${
                                user ? ' z-40 h-10 w-10 rounded-full bg-[#3f51b5] p-1.5' : ' p-2'
                            }`}
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            {user ? (
                                <img
                                    src={images.avatar}
                                    alt='avatar'
                                    className='h-full w-full rounded-full object-cover'
                                />
                            ) : (
                                <svg
                                    className='h-[16px] w-[16px] text-gray-800 transition-all dark:text-white'
                                    aria-hidden='true'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 17 14'
                                >
                                    <path
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M1 1h15M1 7h15M1 13h15'
                                    />
                                </svg>
                            )}
                        </div>
                        <ul
                            className={`absolute right-0 top-[calc(100%+20px)] w-max min-w-[160px] overflow-hidden rounded-md transition-all ${
                                showMenu ? 'visible opacity-100' : 'invisible opacity-0'
                            }`}
                        >
                            {(user
                                ? isMobile
                                    ? HEADER_MENU_ITEMS_LOGGED_IN_MOBILE
                                    : HEADER_MENU_ITEMS_LOGGED_IN
                                : HEADER_MENU_ITEMS_NOT_LOGGED_IN
                            ).map((item) => {
                                const Comp: React.ElementType<any> = item.path ? Link : 'div'
                                return (
                                    <li key={nanoid()} className='p-1' style={{ backgroundColor: item.color }}>
                                        <Comp
                                            {...(item.path ? { to: item.path } : { onClick: handleLogout })}
                                            className='flex cursor-pointer items-center rounded p-2 transition-all hover:bg-white/10'
                                        >
                                            {item.icon}
                                            <span className='ml-2 text-[15px] font-medium text-white'>
                                                {item.title}
                                            </span>
                                        </Comp>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <div
                        className='relative flex h-[28px] w-[52px] items-center rounded-full border-2 border-black/30 bg-[#333]/10 p-0.5 transition-all dark:border-[#929292] dark:bg-[#3A3B3C]'
                        onClick={handleToggleDarkMode}
                        role='button'
                    >
                        <div className='absolute left-1 top-1/2 -translate-y-1/2 opacity-0 transition-all dark:left-[calc(100%-22px)] dark:opacity-[1]'>
                            <svg
                                className='h-[18px] w-[18px] text-white'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 18 20'
                            >
                                <path
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M8.509 5.75c0-1.493.394-2.96 1.144-4.25h-.081a8.5 8.5 0 1 0 7.356 12.746A8.5 8.5 0 0 1 8.509 5.75Z'
                                />
                            </svg>
                        </div>
                        <div
                            className={`absolute left-1 top-1/2 -translate-y-1/2 transition-all dark:left-[calc(100%-22px)] dark:opacity-0`}
                        >
                            <svg
                                className='h-[18px] w-[18px] text-gray-800'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 20 20'
                            >
                                <path
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M10 3V1m0 18v-2M5.05 5.05 3.636 3.636m12.728 12.728L14.95 14.95M3 10H1m18 0h-2M5.05 14.95l-1.414 1.414M16.364 3.636 14.95 5.05M14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
