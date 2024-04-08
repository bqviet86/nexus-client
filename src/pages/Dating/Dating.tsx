import { Fragment, useContext, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import DatingWelcome from '~/components/DatingWelcome'
import DatingProfileCard from '~/components/DatingProfileCard'
import Button from '~/components/Button'
import { getDatingProfile } from '~/apis/datingUsers.apis'
import { routes } from '~/config'
import { AppContext } from '~/contexts/appContext'
import { DatingProfile } from '~/types/datingUsers.types'
import { setDatingProfileToLS } from '~/utils/localStorage'

function Dating() {
    const { pathname } = useLocation()

    const { user, datingProfile, setDatingProfile, datingOnlineAmount, stream, setStream } = useContext(AppContext)

    useQuery({
        queryKey: ['datingProfile'],
        queryFn: async () => {
            const response = await getDatingProfile(user?._id as string, 'user_id')
            const result = response.data.result as DatingProfile | null

            setDatingProfile(result)
            result && setDatingProfileToLS(result)

            return result
        },
        enabled: datingProfile === undefined
    })

    useEffect(() => {
        if (!stream) {
            navigator.mediaDevices
                .getUserMedia({
                    audio: true
                })
                .then((currentStream) => setStream(currentStream))
        }
    }, [stream])

    return datingProfile !== undefined ? (
        datingProfile === null ? (
            <DatingWelcome />
        ) : pathname === routes.dating ? (
            <div className='flex h-full flex-col justify-evenly'>
                <div className='flex flex-col gap-2'>
                    <p className='text-center text-sm'>Hiện tại đang có {datingOnlineAmount} thành viên trực tuyến.</p>
                    <DatingProfileCard datingProfile={datingProfile} />
                </div>

                <div>
                    <p className='text-center text-sm'>
                        Bạn có thể tùy chỉnh cuộc gọi trước khi bắt đầu tìm kiếm người bạn phù hợp.{` `}
                        <Link to={routes.datingUpdateCriteria} className='cursor-pointer text-teal-500 hover:underline'>
                            Tìm hiểu thêm
                        </Link>
                    </p>
                </div>

                <div className='flex flex-col items-center gap-2'>
                    <Button
                        to={routes.datingUpdateCriteria}
                        className='!w-60 !bg-teal-500 hover:!bg-teal-500/80 [&>span]:!text-[#fff]'
                    >
                        Tuỳ chỉnh cuộc gọi
                    </Button>

                    <div className='flex w-[200px] items-center'>
                        <hr className='flex-1' />
                        <span className='mx-2 text-sm font-medium'>hoặc</span>
                        <hr className='flex-1' />
                    </div>

                    <Button
                        to={routes.datingCall}
                        className='!w-60 !bg-teal-500 hover:!bg-teal-500/80 [&>span]:!text-[#fff]'
                    >
                        Bắt đầu gọi ngay
                    </Button>
                </div>
            </div>
        ) : (
            <Outlet />
        )
    ) : (
        <Fragment />
    )
}

export default Dating
