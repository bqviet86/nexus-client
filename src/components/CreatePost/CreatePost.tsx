import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import Button from '~/components/Button'
import PostForm from '~/components/PostForm'
import images from '~/assets/images'
import { envConfig, routes } from '~/config'
import { AppContext } from '~/contexts/appContext'
import { Media, MediaWithFile } from '~/types/medias.types'

function CreatePost() {
    const { user } = useContext(AppContext)
    const [isOpenForm, setIsOpenForm] = useState<boolean>(false)
    const [isShowInputFile, setIsShowInputFile] = useState<boolean>(false)

    const handleOpenForm = ({
        showInputFile = true,
        medias = []
    }: {
        showInputFile?: boolean
        medias?: (Media | MediaWithFile)[]
    }) => {
        setIsOpenForm(true)
        medias.length ? setIsShowInputFile(true) : setIsShowInputFile(showInputFile)
    }

    const handleCloseForm = () => {
        setIsOpenForm(false)
    }

    return (
        <div className='rounded-lg bg-white px-2 pt-2 transition-all dark:bg-[#242526] sm:px-4 sm:pt-3'>
            <div className='flex border-b border-solid border-b-[#bbb9b9] pb-2 sm:pb-3'>
                <Link
                    to={routes.profile.replace(':profile_id', user?._id || '')}
                    className='mr-2 overflow-hidden rounded-full sm:mr-4'
                >
                    <img
                        src={user?.avatar ? `${envConfig.imageUrlPrefix}/${user.avatar}` : images.avatar}
                        alt='avatar'
                        className='h-10 w-10 object-cover'
                    />
                </Link>
                <div
                    className='flex flex-1 cursor-pointer items-center rounded-full bg-[#eff0f2] px-6 py-2 transition-all hover:bg-[#e4e6e9] dark:bg-[#4e4f50]/70 dark:hover:bg-[#4e4f50]'
                    onClick={() => handleOpenForm({ showInputFile: false })}
                >
                    <span className='line-clamp-1 text-sm text-[#65676b] transition-all dark:text-[#b0b3b8] sm:text-base'>
                        Bạn đang nghĩ gì, {user?.name}?
                    </span>
                </div>
            </div>

            <div className='flex py-1 sm:py-2'>
                <Button
                    icon={
                        <svg
                            className='h-[20px] w-[20px] text-[#45bd62]'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='currentColor'
                            viewBox='0 0 20 18'
                        >
                            <path d='M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z' />
                        </svg>
                    }
                    className='!w-full'
                    onClick={() => handleOpenForm({ showInputFile: true })}
                >
                    Hình ảnh
                </Button>
                <Button
                    icon={
                        <svg
                            className='h-[20px] w-[20px] text-[#f3425f]'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='currentColor'
                            viewBox='0 0 20 14'
                        >
                            <path d='M11 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm8.585 1.189a.994.994 0 0 0-.9-.138l-2.965.983a1 1 0 0 0-.685.949v8a1 1 0 0 0 .675.946l2.965 1.02a1.013 1.013 0 0 0 1.032-.242A1 1 0 0 0 20 12V2a1 1 0 0 0-.415-.811Z' />
                        </svg>
                    }
                    className='!w-full'
                    onClick={() => handleOpenForm({ showInputFile: true })}
                >
                    Video
                </Button>
            </div>

            <PostForm
                formType='create_post'
                isOpenForm={isOpenForm}
                isShowInputFile={isShowInputFile}
                setIsShowInputFile={setIsShowInputFile}
                onOpenForm={(medias) => {
                    if (medias.length) handleOpenForm({ medias })
                }}
                onCloseForm={handleCloseForm}
            />
        </div>
    )
}

export default CreatePost
