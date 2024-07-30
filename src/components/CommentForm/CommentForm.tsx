import { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Image } from 'antd'

import CommentLine from '~/components/CommentLine'
import Loading from '~/components/Loading'
import { uploadImages } from '~/apis/medias.apis'
import { UpdateCommentReqData, updateComment } from '~/apis/comments.apis'
import assetImages from '~/assets/images'
import { envConfig } from '~/config'
import { MediaTypes, NotificationPostAction } from '~/constants/enums'
import { AppContext } from '~/contexts/appContext'
import { useSocket } from '~/hooks'
import { Comment, CommentDetail } from '~/types/comments.types'
import { Media, MediaWithFile } from '~/types/medias.types'
import { renderCommentUpdated } from '~/utils/handle'

type CommentFormProps = {
    mode: 'create' | 'edit'
    showInput?: boolean
    postId: string
    parentId?: string
    commentId?: string
    editContent?: string
    editImage?: Media | null
    setIsEditMode?: React.Dispatch<React.SetStateAction<boolean>>
    setComments?: React.Dispatch<React.SetStateAction<CommentDetail[]>>
    replyInputRefs?: React.MutableRefObject<Record<string, HTMLInputElement | null>>
}

function CommentForm({
    mode,
    showInput = true,
    postId,
    parentId = '',
    commentId = '',
    editContent = '',
    editImage = null,
    setIsEditMode = () => {},
    setComments = () => {},
    replyInputRefs
}: CommentFormProps) {
    const Wrapper = showInput && parentId ? CommentLine : Fragment
    const { instance: socket, emit } = useSocket()

    const { user } = useContext(AppContext)
    const [content, setContent] = useState<string>(editContent)
    const [image, setImage] = useState<Media | MediaWithFile | null>(editImage)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const imageRef = useRef<string>('')

    const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files

        if (!files || !files[0]) return

        const url = URL.createObjectURL(files[0])

        imageRef.current = url
        setImage({
            url,
            type: MediaTypes.Image,
            file: files[0]
        })
    }

    useEffect(() => {
        if ((image && image.url !== imageRef.current) || (!image && imageRef.current)) {
            URL.revokeObjectURL(imageRef.current)
        }
    }, [image])

    const { mutateAsync: mutateUploadImage } = useMutation({
        mutationFn: (data: FormData) => uploadImages(data)
    })

    const handleCreateComment = async () => {
        let uploadImageRes = null

        if (image) {
            const formData = new FormData()

            formData.append('image', (image as MediaWithFile).file)
            uploadImageRes = await mutateUploadImage(formData)
        }

        const mediaRes = uploadImageRes && (uploadImageRes.data.result as Media[])[0]
        const comment: Pick<Comment, 'post_id' | 'parent_id' | 'content' | 'media'> = {
            post_id: postId,
            parent_id: parentId || null,
            content,
            media: mediaRes && { ...mediaRes, url: mediaRes.url.split('/').slice(-1)[0] }
        }

        emit('create_comment', comment)

        setContent('')
        setImage(null)
    }

    useEffect(() => {
        if (mode === 'edit') {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    setIsEditMode(false)
                }
            }

            window.addEventListener('keydown', handleKeyDown)

            return () => window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const { mutateAsync: mutateUpdateComment } = useMutation({
        mutationFn: (payload: UpdateCommentReqData) => updateComment(payload)
    })

    const handleUpdateComment = async () => {
        let uploadImageRes = null

        if (image && (image as any).file) {
            const formData = new FormData()

            formData.append('image', (image as MediaWithFile).file)
            uploadImageRes = await mutateUploadImage(formData)
        }

        const mediaRes = uploadImageRes ? (uploadImageRes.data.result as Media[])[0] : image
        const updateCommentRes = await mutateUpdateComment({
            comment_id: commentId,
            content,
            media: mediaRes && { ...mediaRes, url: mediaRes.url.split('/').slice(-1)[0] }
        })

        setIsEditMode(false)
        setComments((prevComments) =>
            prevComments.map((comment) => {
                const { result } = updateCommentRes.data
                const newContent = result?.content as string
                const newMedia = result?.media as Media | null

                return parentId
                    ? renderCommentUpdated<CommentDetail>({ comment, parentId, commentId, newContent, newMedia })
                    : renderCommentUpdated<CommentDetail>({ comment, commentId, newContent, newMedia })
            })
        )
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!content && !image) return

        setIsLoading(true)

        if (mode === 'create') {
            await handleCreateComment()
        } else {
            await handleUpdateComment()
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (socket && socket.connected) {
            const handleOffLoading = () => setIsLoading(false)

            socket.on(NotificationPostAction.CommentPost, handleOffLoading)

            return () => {
                socket.off(NotificationPostAction.CommentPost, handleOffLoading)
            }
        }
    }, [socket])

    return (
        user && (
            <Wrapper {...(showInput && parentId ? { className: '!bottom-[calc(100%-19px)]' } : {})}>
                <div className={`relative flex items-start ${parentId ? 'mt-2' : 'mt-3'}${showInput ? '' : ' hidden'}`}>
                    <div className={`overflow-hidden ${parentId ? 'mt-1 h-7 w-7' : 'h-9 w-9'}`}>
                        <img
                            src={user.avatar ? `${envConfig.imageUrlPrefix}/${user.avatar}` : assetImages.avatar}
                            alt='avatar'
                            className='h-full w-full rounded-full object-cover'
                        />
                    </div>

                    <div className='ml-2 flex-1'>
                        <form
                            className='flex h-9 rounded-full bg-[#f0f2f5] pr-3 transition-all dark:bg-[#3a3b3c]'
                            onSubmit={handleSubmit}
                        >
                            <input
                                {...(parentId && replyInputRefs
                                    ? { ref: (ref) => (replyInputRefs.current[parentId] = ref) }
                                    : {})}
                                placeholder='Viết phản hồi...'
                                spellCheck='false'
                                autoFocus={mode === 'edit' && !replyInputRefs}
                                className='h-full flex-[1] rounded-full bg-[#f0f2f5] px-3 py-2 text-sm transition-all dark:bg-[#3a3b3c] dark:text-[#e4e6eb]'
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />

                            <div className='flex h-full items-center'>
                                {isLoading ? (
                                    <Loading
                                        className='w-full'
                                        loaderClassName='!text-[#65676b] dark:!text-[#e4e6eb]'
                                        loaderSize={16}
                                    />
                                ) : (
                                    <>
                                        <label htmlFor={`upload-image-comment-${parentId}`} className='cursor-pointer'>
                                            <svg
                                                className='h-[20px] w-[20px] text-[#bec3c9] transition-all hover:text-[#65676b] dark:hover:text-[#e4e6eb]'
                                                aria-hidden='true'
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                            >
                                                <path
                                                    stroke='currentColor'
                                                    strokeLinejoin='round'
                                                    strokeWidth='2'
                                                    d='M4 18V8c0-.6.4-1 1-1h1.5l1.7-1.7c.2-.2.4-.3.7-.3h6.2c.3 0 .5.1.7.3L17.5 7H19c.6 0 1 .4 1 1v10c0 .6-.4 1-1 1H5a1 1 0 0 1-1-1Z'
                                                />
                                                <path
                                                    stroke='currentColor'
                                                    strokeLinejoin='round'
                                                    strokeWidth='2'
                                                    d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                                                />
                                            </svg>
                                        </label>

                                        <input
                                            id={`upload-image-comment-${parentId}`}
                                            type='file'
                                            accept='image/*'
                                            className='invisible block h-0 w-0'
                                            onChange={handleUploadImage}
                                        />

                                        <button type='submit' className='ml-2'>
                                            <svg
                                                className={`h-[20px] w-[20px] rotate-90 ${
                                                    content || image
                                                        ? 'text-[#007bff] transition-all hover:text-[#2997ff]'
                                                        : 'cursor-not-allowed text-[#bec3c9]'
                                                }`}
                                                aria-hidden='true'
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='currentColor'
                                                viewBox='0 0 24 24'
                                            >
                                                <path
                                                    fillRule='evenodd'
                                                    d='M12 2c.4 0 .8.3 1 .6l7 18a1 1 0 0 1-1.4 1.3L13 19.5V13a1 1 0 1 0-2 0v6.5L5.4 22A1 1 0 0 1 4 20.6l7-18a1 1 0 0 1 1-.6Z'
                                                    clipRule='evenodd'
                                                />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>

                        {image && (
                            <div className='relative mt-2 aspect-[16/9] w-3/4 max-w-[260px] overflow-hidden rounded-lg'>
                                <Image
                                    src={image.url}
                                    alt='image-upload'
                                    wrapperClassName='h-full w-full'
                                    className='!h-full !w-full !object-cover'
                                    preview
                                />

                                <div
                                    className='absolute right-2 top-2 h-4 w-4 cursor-pointer'
                                    onClick={() => setImage(null)}
                                >
                                    <div className='h-full w-full rounded-full bg-[#eee]'>
                                        <svg
                                            className='absolute text-[#7c7e80] transition-all hover:text-[#a7a5a5]'
                                            aria-hidden='true'
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='currentColor'
                                            viewBox='0 0 20 20'
                                        >
                                            <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z' />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}

                        {mode === 'edit' && (
                            <div className='ml-3 mt-2 text-xs transition-all dark:text-[#b0b3b8]'>
                                Nhấn Esc để{' '}
                                <span
                                    className='cursor-pointer text-[#ab2b3a] transition-all hover:underline'
                                    onClick={() => setIsEditMode(false)}
                                >
                                    hủy
                                </span>
                            </div>
                        )}
                    </div>

                    {mode === 'create' && parentId && (
                        <div className='absolute right-full z-10 h-full w-11 bg-white transition-all dark:bg-[#242526]' />
                    )}
                </div>
            </Wrapper>
        )
    )
}

export default CommentForm
