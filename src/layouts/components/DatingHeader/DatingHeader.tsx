import { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Instance as TippyInstance } from 'tippy.js'
import Tippy from '@tippyjs/react/headless'

import { logoutUser } from '~/apis/users.apis'
import images from '~/assets/images'
import { routes } from '~/config'
import { DATING_HEADER_MENU_ITEMS } from '~/constants/interfaceData'
import { AppContext } from '~/contexts/appContext'
import { removeDatingProfileFromLS, removeTokenFromLS, removeUserFromLS } from '~/utils/localStorage'
import { listenEvent } from '~/utils/event'

type DatingHeaderProps = {
    backBtn?: boolean
}

function DatingHeader({ backBtn = false }: DatingHeaderProps) {
    const navigate = useNavigate()

    const { token, datingProfile } = useContext(AppContext)

    const refresh_token = token?.refresh_token || null

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
        datingProfile && (
            <div className='absolute left-0 top-0 flex w-full items-center justify-between bg-[#242526] px-4 py-2 shadow-md'>
                {backBtn ? (
                    <button className='flex h-8 w-8 items-center justify-center p-1' onClick={() => navigate(-1)}>
                        <svg
                            className='h-full w-full'
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
                                d='m15 19-7-7 7-7'
                            />
                        </svg>
                    </button>
                ) : (
                    <Link to={routes.home} className='flex items-center gap-1'>
                        <img src={images.logo_dark} alt='logo' className='h-10' />
                        <span className='text-xl font-bold'>Nexus</span>
                    </Link>
                )}

                <Tippy
                    interactive
                    hideOnClick
                    trigger='click'
                    placement='bottom-end'
                    offset={[0, 8]}
                    render={(attrs, _, tippy) => (
                        <div
                            className='animate-fadeIn rounded-lg bg-[#242526] p-1 shadow-[0_0_10px_rgba(0,0,0,.2)]'
                            tabIndex={-1}
                            {...attrs}
                        >
                            {DATING_HEADER_MENU_ITEMS.map((item, index) => {
                                const Comp: React.ElementType<any> = item.path ? Link : 'div'
                                return (
                                    <Comp
                                        key={index}
                                        className='flex cursor-pointer items-center rounded-md bg-[#242526] px-1 py-2 text-sm transition-all hover:bg-[#3a3b3c]'
                                        onClick={() => (tippy as TippyInstance).hide()}
                                        {...(item.path
                                            ? { to: item.path.replace(':profile_id', datingProfile._id) }
                                            : { onClick: handleLogout })}
                                    >
                                        {item.icon}
                                        <span className='ml-1 text-[#e4e6eb]'>{item.title}</span>
                                    </Comp>
                                )
                            })}
                        </div>
                    )}
                >
                    <div className='flex cursor-pointer items-center gap-2'>
                        <span title={datingProfile.name} className='line-clamp-1 max-w-[100px] text-sm font-medium'>
                            {datingProfile.name}
                        </span>

                        <img
                            src={
                                datingProfile.avatar
                                    ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${datingProfile.avatar}`
                                    : images.avatar
                            }
                            alt='avatar'
                            className='h-10 w-10 cursor-pointer rounded-full'
                        />
                    </div>
                </Tippy>
            </div>
        )
    )
}

export default DatingHeader
