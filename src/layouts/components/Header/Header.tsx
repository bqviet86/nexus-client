import { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'

import images from '~/assets/images'
import { routes } from '~/config'
import { AppContext } from '~/contexts/appContext'

function Header() {
    const { darkMode, setDarkMode } = useContext(AppContext)

    const handleToggleTheme = () => {
        setDarkMode(!darkMode)
    }

    return (
        <div className='h-[60px] bg-white shadow-lg transition-all dark:bg-[#242526]'>
            <div className='mx-auto flex h-full max-w-7xl items-center justify-between'>
                <Link to={routes.home}>
                    <img src={darkMode ? images.logo_dark : images.logo} alt='logo' className='w-10' />
                </Link>

                <ul className='flex h-full items-center'>
                    <li className='relative mx-1'>
                        <NavLink
                            to={routes.home}
                            className={({ isActive }) =>
                                `flex w-[140px] items-center justify-center rounded-lg px-10 py-3 transition-all hover:bg-[#f0f2f5] dark:hover:bg-[#3A3B3C] ${
                                    isActive
                                        ? 'after:absolute after:bottom-0 after:left-1/2 after:h-[3.2px] after:w-3/4 after:-translate-x-1/2 after:rounded-full after:bg-[#c24269] dark:after:bg-white'
                                        : ''
                                }`
                            }
                        >
                            <svg
                                className='h-[20px] w-[20px] text-[#c24269] transition-all dark:text-white'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                            >
                                <path d='m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z' />
                            </svg>
                        </NavLink>
                    </li>
                    <li className='relative mx-1'>
                        <NavLink
                            to={routes.login}
                            className={({ isActive }) =>
                                `flex w-[140px] items-center justify-center rounded-lg px-10 py-3 transition-all hover:bg-[#f0f2f5] dark:hover:bg-[#3A3B3C] ${
                                    isActive
                                        ? 'after:absolute after:bottom-0 after:left-1/2 after:h-[3.2px] after:w-3/4 after:-translate-x-1/2 after:rounded-full after:bg-[#26a69a] dark:after:bg-white'
                                        : ''
                                }`
                            }
                        >
                            <svg
                                className='h-[20px] w-[20px] text-[#26a69a] transition-all dark:text-white'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                            >
                                <path d='m7.164 3.805-4.475.38L.327 6.546a1.114 1.114 0 0 0 .63 1.89l3.2.375 3.007-5.006ZM11.092 15.9l.472 3.14a1.114 1.114 0 0 0 1.89.63l2.36-2.362.38-4.475-5.102 3.067Zm8.617-14.283A1.613 1.613 0 0 0 18.383.291c-1.913-.33-5.811-.736-7.556 1.01-1.98 1.98-6.172 9.491-7.477 11.869a1.1 1.1 0 0 0 .193 1.316l.986.985.985.986a1.1 1.1 0 0 0 1.316.193c2.378-1.3 9.889-5.5 11.869-7.477 1.746-1.745 1.34-5.643 1.01-7.556Zm-3.873 6.268a2.63 2.63 0 1 1-3.72-3.72 2.63 2.63 0 0 1 3.72 3.72Z' />
                            </svg>
                        </NavLink>
                    </li>
                    <li className='relative mx-1'>
                        <NavLink
                            to={routes.register}
                            className={({ isActive }) =>
                                `flex w-[140px] items-center justify-center rounded-lg px-10 py-3 transition-all hover:bg-[#f0f2f5] dark:hover:bg-[#3A3B3C] ${
                                    isActive
                                        ? 'after:absolute after:bottom-0 after:left-1/2 after:h-[3.2px] after:w-3/4 after:-translate-x-1/2 after:rounded-full after:bg-[#607d8b] dark:after:bg-white'
                                        : ''
                                }`
                            }
                        >
                            <svg
                                className='h-[20px] w-[20px] text-[#607d8b] transition-all dark:text-white'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='currentColor'
                                viewBox='0 0 21 20'
                            >
                                <path d='M20.168 6.136 14.325.293a1 1 0 0 0-1.414 0l-1.445 1.444a1 1 0 0 0 0 1.414l5.844 5.843a1 1 0 0 0 1.414 0l1.444-1.444a1 1 0 0 0 0-1.414Zm-4.205 2.927L11.4 4.5a1 1 0 0 0-1-.25L4.944 5.9a1 1 0 0 0-.652.624L.518 17.206a1 1 0 0 0 .236 1.04l.023.023 6.606-6.606a2.616 2.616 0 1 1 3.65 1.304 2.615 2.615 0 0 1-2.233.108l-6.61 6.609.024.023a1 1 0 0 0 1.04.236l10.682-3.773a1 1 0 0 0 .624-.653l1.653-5.457a.999.999 0 0 0-.25-.997Z' />
                                <path d='M10.233 11.1a.613.613 0 1 0-.867-.868.613.613 0 0 0 .867.868Z' />
                            </svg>
                        </NavLink>
                    </li>
                </ul>

                <div
                    className='relative flex h-[28px] w-[52px] items-center rounded-full border-2 border-black/30 bg-[#333]/10 p-0.5 transition-all dark:border-[#929292] dark:bg-[#3A3B3C]'
                    onClick={handleToggleTheme}
                    role='button'
                >
                    <div className='absolute left-1 top-2/4 -translate-y-2/4 opacity-0 transition-all dark:left-[calc(100%-22px)] dark:opacity-[1]'>
                        <svg
                            className='h-[18px] w-[18px] text-gray-800 dark:text-white'
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
                        className={`absolute left-1 top-2/4 -translate-y-2/4 transition-all dark:left-[calc(100%-22px)] dark:opacity-0`}
                    >
                        <svg
                            className='h-[18px] w-[18px] text-gray-800 dark:text-white'
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
    )
}

export default Header
