import { useContext, useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'

import Notification from '~/components/Notification'
import { getMe, logoutUser } from '~/apis/users.apis'
import images from '~/assets/images'
import { envConfig, routes } from '~/config'
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
    removeDatingProfileFromLS,
    removeTokenFromLS,
    removeUserFromLS,
    setDarkModeToLS,
    setUserToLS
} from '~/utils/localStorage'
import { listenEvent } from '~/utils/event'

function Header() {
    const { user, setUser, token, darkMode, setDarkMode } = useContext(AppContext)
    const [showMenu, setShowMenu] = useState<boolean>(false)
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024)

    const access_token = token?.access_token || null
    const refresh_token = token?.refresh_token || null

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (e.target instanceof Element && !e.target.closest('.closest-header-menu')) {
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
            const isSmallerThanLg = window.innerWidth < 1024
            setIsMobile(isSmallerThanLg)
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
        enabled: !!access_token
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
        removeUserFromLS()
        removeTokenFromLS()
        removeDatingProfileFromLS()
        window.location.href = routes.welcome
    }

    const handleLogout = () => {
        mutateLogout(refresh_token as string, {
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

                <ul
                    className={`absolute left-1/2 top-0 hidden h-full -translate-x-1/2 items-center justify-evenly ${
                        user ? 'w-[50%] lg:flex' : 'md:flex'
                    }`}
                >
                    {(user ? HEADER_NAV_ITEMS_LOGGED_IN : HEADER_NAV_ITEMS_NOT_LOGGED_IN).map((item, index) => (
                        <li key={index} className='relative mx-1'>
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
                    <div className={`relative mr-3 ${user ? 'flex items-center' : 'md:hidden'}`}>
                        {user && (
                            <div className='flex max-w-[160px] translate-x-[18px] items-center rounded-s-full border border-solid border-[#3f51b5] bg-[#3f51b5] py-1.5 pl-4 pr-6 text-sm font-medium text-white transition-all dark:border-[#929292] dark:bg-[#3A3B3C]'>
                                <span className='line-clamp-1 leading-4'>{user.name}</span>
                            </div>
                        )}

                        <div
                            className={`closest-header-menu cursor-pointer ${
                                user
                                    ? 'z-40 h-10 w-10 rounded-full bg-[#3f51b5] p-[5px] transition-all dark:bg-[#cbd5e1]'
                                    : 'p-2'
                            }`}
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            {user ? (
                                <div className='h-[30px] w-[30px] overflow-hidden rounded-full border border-solid border-black'>
                                    <img
                                        src={user.avatar ? `${envConfig.imageUrlPrefix}/${user.avatar}` : images.avatar}
                                        alt='avatar'
                                        className='h-full w-full object-cover'
                                    />
                                </div>
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
                            className={`closest-header-menu absolute right-0 top-[calc(100%+20px)] w-max min-w-[160px] overflow-hidden rounded-md transition-all ${
                                showMenu ? 'visible opacity-100' : 'invisible opacity-0'
                            }`}
                        >
                            {(user
                                ? isMobile
                                    ? HEADER_MENU_ITEMS_LOGGED_IN_MOBILE
                                    : HEADER_MENU_ITEMS_LOGGED_IN
                                : HEADER_MENU_ITEMS_NOT_LOGGED_IN
                            ).map((item, index) => {
                                const Comp: React.ElementType<any> = item.path ? Link : 'div'
                                return (
                                    <li key={index} className='p-1' style={{ backgroundColor: item.color }}>
                                        <Comp
                                            className='flex cursor-pointer items-center rounded p-2 transition-all hover:bg-white/10'
                                            onClick={() => setShowMenu(false)}
                                            {...(item.path
                                                ? { to: item.path.replace(':profile_id', user?._id || '') }
                                                : { onClick: handleLogout })}
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

                    {user && (
                        <div className='mr-3'>
                            <Notification />
                        </div>
                    )}

                    <div
                        className='closest-notification relative flex h-[28px] w-[52px] items-center rounded-full border-2 border-black/30 bg-[#333]/10 p-0.5 transition-all dark:border-[#929292] dark:bg-[#3A3B3C]'
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
