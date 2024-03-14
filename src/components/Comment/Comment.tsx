import { Fragment, useContext, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Image } from 'antd'
import { Instance as TippyInstance } from 'tippy.js'
import Tippy from '@tippyjs/react/headless'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import { PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr'

import CommentLine from '~/components/CommentLine'
import CommentForm from '~/components/CommentForm'
import Modal from '~/components/Modal'
import { deleteComment } from '~/apis/comments.apis'
import images from '~/assets/images'
import { routes } from '~/config'
import { MediaTypes } from '~/constants/enums'
import { AppContext } from '~/contexts/appContext'
import { CommentDetail, Comment as CommentType } from '~/types/comments.types'
import { formatTime } from '~/utils/handle'
import '@vidstack/react/player/styles/base.css'
import '@vidstack/react/player/styles/plyr/theme.css'

type CommentProps = {
    data: CommentType
    handleClickReplyCommentBtn: () => void
    setComments: React.Dispatch<React.SetStateAction<CommentDetail[]>>
    isHasOverlay?: boolean
}

function Comment({ data, handleClickReplyCommentBtn, setComments, isHasOverlay = false }: CommentProps) {
    const Wrapper = data.parent_id ? CommentLine : Fragment

    const { user } = useContext(AppContext)
    const [isEditMode, setIsEditMode] = useState<boolean>(false)
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false)
    const [isFetchingDeleteComment, setIsFetchingDeleteComment] = useState<boolean>(false)

    const timeRef = useRef<string>(formatTime(data.created_at))

    const { mutateAsync: mutateDeleteComment } = useMutation({
        mutationFn: (comment_id: string) => deleteComment(comment_id)
    })

    const handleDeleteComment = async () => {
        setIsFetchingDeleteComment(true)

        await mutateDeleteComment(data._id)

        setIsFetchingDeleteComment(false)
        setIsOpenDeleteModal(false)
    }

    return isEditMode ? (
        <CommentForm
            mode='edit'
            postId={data.post_id}
            {...(data.parent_id ? { parentId: data.parent_id } : {})}
            commentId={data._id}
            editContent={data.content}
            editImage={
                data.media && {
                    ...data.media,
                    url: `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${data.media.url}`
                }
            }
            setIsEditMode={setIsEditMode}
            setComments={setComments}
        />
    ) : (
        <Wrapper {...(data.parent_id ? { className: '!bottom-[calc(100%-15px)]' } : {})}>
            <div className={`relative flex items-start${data.parent_id ? ' mt-2' : ''}`}>
                <Link
                    to={routes.profile.replace(':profile_id', data.user._id)}
                    className={`flex-shrink-0 overflow-hidden rounded-full ${data.parent_id ? 'h-7 w-7' : 'h-9 w-9'}`}
                >
                    <img
                        src={
                            data.user.avatar
                                ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${data.user.avatar}`
                                : images.avatar
                        }
                        alt='avatar'
                        className='h-full w-full rounded-full object-cover'
                    />
                </Link>

                <div className='ml-2 flex w-full flex-col items-start'>
                    <div className='flex max-w-full items-center gap-1'>
                        <div className='rounded-xl bg-[#f0f2f5] px-3 py-2 transition-all dark:bg-[#3a3b3c]'>
                            <Link
                                to={routes.profile.replace(':profile_id', data.user._id)}
                                className='line-clamp-1 w-max text-[13px] font-medium transition-all dark:text-[#e4e6eb]'
                            >
                                {data.user.name}
                            </Link>

                            {data.content && (
                                <p className='break-all text-sm transition-all dark:text-[#e4e6eb]'>{data.content}</p>
                            )}

                            {data.media && (
                                <div className='relative mt-1 aspect-[16/9] max-w-[260px] overflow-hidden rounded-lg bg-black'>
                                    {data.media.type === MediaTypes.Image ? (
                                        <Image
                                            src={`${import.meta.env.VITE_IMAGE_URL_PREFIX}/${data.media.url}`}
                                            alt='comment-image'
                                            wrapperClassName='h-full w-full'
                                            className='!h-full !w-full !object-cover'
                                            preview
                                        />
                                    ) : (
                                        <MediaPlayer src={`${import.meta.env.VITE_VIDEO_URL_PREFIX}/${data.media.url}`}>
                                            <MediaProvider />
                                            <PlyrLayout icons={plyrLayoutIcons} className='left-auto right-0' />
                                        </MediaPlayer>
                                    )}
                                </div>
                            )}
                        </div>

                        {user && user._id === data.user._id && (
                            <>
                                <Tippy
                                    interactive
                                    hideOnClick
                                    trigger='click'
                                    placement='bottom'
                                    offset={[0, 8]}
                                    render={(attrs, _, tippy) => (
                                        <div
                                            className='min-w-32 animate-fadeIn rounded-lg bg-white p-1 shadow-[0_0_10px_rgba(0,0,0,.2)] transition-all dark:bg-[#242526]'
                                            tabIndex={-1}
                                            {...attrs}
                                        >
                                            <div
                                                className='flex cursor-pointer items-center rounded-md bg-white px-1 py-2 text-sm transition-all hover:bg-[#f2f2f2] dark:bg-[#242526] dark:hover:bg-[#3a3b3c]'
                                                onClick={() => setIsEditMode(true)}
                                            >
                                                <svg
                                                    className='h-[20px] w-[20px] text-[#050505] transition-all dark:text-[#e4e6eb]'
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
                                                        d='m14.3 4.8 2.9 2.9M7 7H4a1 1 0 0 0-1 1v10c0 .6.4 1 1 1h11c.6 0 1-.4 1-1v-4.5m2.4-10a2 2 0 0 1 0 3l-6.8 6.8L8 14l.7-3.6 6.9-6.8a2 2 0 0 1 2.8 0Z'
                                                    />
                                                </svg>
                                                <span className='ml-1 text-[#050505] transition-all dark:text-[#e4e6eb]'>
                                                    Chỉnh sửa
                                                </span>
                                            </div>

                                            <div
                                                className='flex cursor-pointer items-center rounded-md bg-white px-1 py-2 text-sm transition-all hover:bg-[#f2f2f2] dark:bg-[#242526] dark:hover:bg-[#3a3b3c]'
                                                onClick={() => {
                                                    setIsOpenDeleteModal(true)
                                                    ;(tippy as TippyInstance).hide()
                                                }}
                                            >
                                                <svg
                                                    className='h-[20px] w-[20px] text-[#050505] transition-all dark:text-[#e4e6eb]'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    fill='none'
                                                    viewBox='0 0 24 24'
                                                    strokeWidth='1.5'
                                                    stroke='currentColor'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                                                    />
                                                </svg>
                                                <span className='ml-1 text-[#050505] transition-all dark:text-[#e4e6eb]'>
                                                    Xoá
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                >
                                    <div className='flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-full transition-all hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]'>
                                        <svg
                                            className='h-5 w-5 text-[#606770] transition-all dark:text-[#a8abaf]'
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth='1.5'
                                            stroke='currentColor'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                                            />
                                        </svg>
                                    </div>
                                </Tippy>

                                <Modal
                                    title='Xoá bình luận'
                                    open={isOpenDeleteModal}
                                    onOk={handleDeleteComment}
                                    onCancel={() => setIsOpenDeleteModal(false)}
                                    okText='Xoá'
                                    cancelText='Không'
                                    confirmLoading={isFetchingDeleteComment}
                                >
                                    <p className='my-3'>Bạn có chắc chắn muốn xóa bình luận này không?</p>
                                </Modal>
                            </>
                        )}
                    </div>

                    <div className='mt-1 flex items-center'>
                        <div className='mx-2 text-xs text-[#65676b] transition-all dark:text-[#b0b3b8]'>
                            {timeRef.current}
                        </div>

                        <div
                            className='mx-2 cursor-pointer text-xs text-[#65676b] transition-all hover:underline dark:text-[#b0b3b8]'
                            onClick={handleClickReplyCommentBtn}
                        >
                            Phản hồi
                        </div>
                    </div>
                </div>

                {isHasOverlay && (
                    <div className='absolute right-full z-10 h-full w-11 bg-white transition-all dark:bg-[#242526]' />
                )}
            </div>
        </Wrapper>
    )
}

export default Comment
