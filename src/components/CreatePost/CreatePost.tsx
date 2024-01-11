import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal } from 'antd'
import { nanoid } from 'nanoid'

import Button from '~/components/Button'
import PostForm from '~/components/PostForm'
import images from '~/assets/images'
import { routes } from '~/config'
import { AppContext } from '~/contexts/appContext'

function CreatePost() {
    const { user } = useContext(AppContext)
    const [isOpenModal, setIsOpenModal] = useState(false)

    const handleOpenModal = () => {
        setIsOpenModal(true)
    }

    const handleCloseModal = () => {
        setIsOpenModal(false)
    }

    return (
        <div className='rounded-lg bg-white px-2 pt-2 transition-all sm:px-4 sm:pt-3 dark:bg-[#242526]'>
            <div className='flex border-b border-solid border-b-[#bbb9b9] pb-2 sm:pb-3'>
                <Link to={routes.myProfile} className='mr-2 overflow-hidden rounded-full sm:mr-4'>
                    <img
                        src={user?.avatar ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${user.avatar}` : images.avatar}
                        alt='avatar'
                        className='h-10 w-10 object-cover'
                    />
                </Link>
                <div
                    className='flex flex-1 cursor-pointer items-center rounded-full bg-[#eff0f2] px-6 py-2 transition-all hover:bg-[#e4e6e9] dark:bg-[#4e4f50]/70 dark:hover:bg-[#4e4f50]'
                    onClick={handleOpenModal}
                >
                    <span className='line-clamp-1 text-sm text-[#65676b] transition-all sm:text-base dark:text-[#b0b3b8]'>
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
                    onClick={handleOpenModal}
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
                    onClick={handleOpenModal}
                >
                    Video
                </Button>
            </div>

            <Modal
                title='Tạo bài viết'
                open={isOpenModal}
                onOk={() => {}}
                onCancel={handleCloseModal}
                okText='Đăng'
                centered
                closeIcon={
                    <svg
                        className='h-full w-full'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                    >
                        <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z' />
                    </svg>
                }
                footer={[
                    <Button
                        key={nanoid()}
                        className='!w-full !bg-[#007bff] hover:!bg-[#007bff]/90 [&>span]:!text-white sm:[&>span]:!text-[15px]'
                    >
                        Đăng
                    </Button>
                ]}
                className='!w-full sm:!w-[520px] [&_.ant-modal-close]:right-3 [&_.ant-modal-close]:top-3 [&_.ant-modal-close]:h-[26px] [&_.ant-modal-close]:w-[26px] [&_.ant-modal-close]:hover:bg-transparent sm:[&_.ant-modal-close]:right-[18px] sm:[&_.ant-modal-close]:top-[18px] sm:[&_.ant-modal-close]:h-6 sm:[&_.ant-modal-close]:w-6 [&_.ant-modal-content]:p-2 sm:[&_.ant-modal-content]:p-4 [&_.ant-modal-header]:mb-3 [&_.ant-modal-header]:mt-1 [&_.ant-modal-header]:text-center sm:[&_.ant-modal-header]:mb-4 sm:[&_.ant-modal-header]:mt-0 [&_.ant-modal-title]:text-xl'
            >
                <PostForm />
            </Modal>
        </div>
    )
}

export default CreatePost
