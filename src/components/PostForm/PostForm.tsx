import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { nanoid } from 'nanoid'
import toast from 'react-hot-toast'
import lodash from 'lodash'

import Modal from '~/components/Modal'
import Button from '~/components/Button'
import Loading from '~/components/Loading'
import PostEditor from '~/components/PostEditor'
import MediasGrid from '~/components/MediasGrid'
import Post from '~/components/Post'
import { uploadImages, uploadVideos } from '~/apis/medias.apis'
import { CreatePostReqData, createPost } from '~/apis/posts.apis'
import images from '~/assets/images'
import { routes } from '~/config'
import { MEDIAS_MAX_LENGTH } from '~/constants/interfaceData'
import { MediaTypes, PostType } from '~/constants/enums'
import { AppContext } from '~/contexts/appContext'
import { Media, MediaWithFile, UploadMediasResponse } from '~/types/medias.types'
import { ParentPost } from '~/types/posts.types'

type PostFormProps = {
    formType: 'create_post' | 'edit_post' | 'share_post'
    isOpenForm: boolean
    isShowInputFile?: boolean
    setIsShowInputFile?: React.Dispatch<React.SetStateAction<boolean>>
    onOpenForm?: (medias: MediaWithFile[]) => void
    onCloseForm: () => void
    postShared?: ParentPost | null
}

function PostForm({
    formType,
    isOpenForm,
    isShowInputFile = false,
    setIsShowInputFile = () => {},
    onOpenForm = () => {},
    onCloseForm,
    postShared = null
}: PostFormProps) {
    const { user } = useContext(AppContext)
    const [content, setContent] = useState<string>('<br>')
    const [medias, setMedias] = useState<MediaWithFile[]>([])
    const [isDisabledSubmit, setIsDisabledSubmit] = useState<boolean>(formType !== 'share_post')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const contentEditableRef = useRef<HTMLElement>(null)
    const mediasRef = useRef<MediaWithFile[]>([])

    const handleUploadFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files

        if (!files) return

        setMedias((prevMedias) => {
            const toastFileTooMax = () => {
                toast(`Bạn chỉ có thể đăng tối đa ${MEDIAS_MAX_LENGTH} ảnh + video (tối đa 1 video) trong một bài viết`)
                return prevMedias
            }

            if (prevMedias.length + files.length > MEDIAS_MAX_LENGTH) {
                return toastFileTooMax()
            }

            const newMedias = [...prevMedias]

            for (const file of files) {
                const mediaUrl = URL.createObjectURL(file)
                const media: MediaWithFile = {
                    url: mediaUrl,
                    type: file.type.includes('image') ? MediaTypes.Image : MediaTypes.Video,
                    file
                }

                newMedias.push(media)
            }

            if (newMedias.filter((media) => media.type === MediaTypes.Video).length > 1) {
                return toastFileTooMax()
            }

            mediasRef.current = newMedias
            return newMedias
        })
    }, [])

    useEffect(() => {
        const mediasRemoved = lodash.difference(mediasRef.current, medias)

        mediasRemoved.forEach((media) => URL.revokeObjectURL(media.url))
        mediasRef.current = medias
    }, [medias])

    useEffect(() => {
        if (formType !== 'share_post') {
            if ((!content || content === '<br>') && !medias.length) {
                setIsDisabledSubmit(true)
                return
            }

            setIsDisabledSubmit(false)
        }
    }, [content, medias])

    const { mutate: mutateUploadImages } = useMutation({
        mutationFn: (data: FormData) => uploadImages(data)
    })

    const { mutate: mutateUploadVideos } = useMutation({
        mutationFn: (data: FormData) => uploadVideos(data)
    })

    const handleUploadMedias = async () => {
        let uploadMediasRes: AxiosResponse<UploadMediasResponse, any>[] = []

        if (medias.length) {
            const imageFormData = new FormData()
            const videoFormData = new FormData()
            const imageMedias = medias.filter((media) => media.type === MediaTypes.Image)
            const videoMedias = medias.filter((media) => media.type === MediaTypes.Video)
            const uploadMediaRequests: (() => Promise<AxiosResponse<UploadMediasResponse, any>>)[] = []

            for (const image of imageMedias) {
                imageFormData.append('image', image.file)
            }

            for (const video of videoMedias) {
                videoFormData.append('video', video.file)
            }

            if (imageMedias.length) {
                uploadMediaRequests.push(
                    () =>
                        new Promise((resolve, reject) => {
                            mutateUploadImages(imageFormData, {
                                onSuccess: (res) => resolve(res),
                                onError: (error) => reject(error)
                            })
                        })
                )
            }

            if (videoMedias.length) {
                uploadMediaRequests.push(
                    () =>
                        new Promise((resolve, reject) => {
                            mutateUploadVideos(videoFormData, {
                                onSuccess: (res) => resolve(res),
                                onError: (error) => reject(error)
                            })
                        })
                )
            }

            uploadMediasRes = await Promise.all(uploadMediaRequests.map((request) => request()))
        }

        const mediasRes = lodash.flatMap(
            uploadMediasRes.map((res) => res.data.result as Media[]),
            (mediaItems) =>
                mediaItems.map(
                    (mediaItem) =>
                        ({
                            ...mediaItem,
                            url: mediaItem.url
                                .split('/')
                                .slice(mediaItem.type === MediaTypes.Image ? -1 : -2)
                                .join('/')
                        }) as Media
                )
        )

        return mediasRes
    }

    const { mutateAsync: mutateCreatePost } = useMutation({
        mutationFn: (data: CreatePostReqData) => createPost(data)
    })

    const handleCreatePost = async (reqData: CreatePostReqData) => {
        const { medias } = reqData

        try {
            await mutateCreatePost(reqData)

            if (medias.some((media) => media.type === MediaTypes.Video)) {
                toast('Bài viết của bạn đang được xử lý.\nChúng tôi sẽ thông báo cho bạn khi hoàn tất!')
            }
        } catch (error) {
            toast('Đăng bài viết thất bại')
        }
    }

    const handleSharePost = async (reqData: CreatePostReqData) => {
        try {
            await mutateCreatePost(reqData)
            toast('Chia sẻ bài viết thành công')
        } catch (error) {
            toast('Chia sẻ bài viết thất bại')
        }
    }

    const handleSubmit = async () => {
        setIsLoading(true)

        if (formType === 'edit_post') {
        } else {
            const hashtagElements = contentEditableRef.current?.querySelectorAll('span.hashtag')
            const hashtags = hashtagElements
                ? Array.from(hashtagElements).map((hashtag) => hashtag.textContent as string)
                : []
            const mediasRes = await handleUploadMedias()

            const reqData: CreatePostReqData = {
                type: formType === 'create_post' ? PostType.Post : PostType.Share,
                content,
                parent_id: formType === 'share_post' && postShared ? postShared._id : null,
                hashtags,
                medias: mediasRes
            }

            if (formType === 'create_post') {
                await handleCreatePost(reqData)
            } else {
                await handleSharePost(reqData)
            }

            setContent('<br>')
            setMedias([])
            onCloseForm()
        }

        setIsLoading(false)
    }

    return (
        <Modal
            title={
                formType === 'create_post'
                    ? 'Tạo bài viết'
                    : formType === 'edit_post'
                      ? 'Chỉnh sửa bài viết'
                      : 'Chia sẻ bài viết'
            }
            open={isOpenForm}
            afterOpenChange={(isOpen) => {
                if (isOpen && medias.length) {
                    onOpenForm(medias)
                }
            }}
            onCancel={onCloseForm}
            footer={[
                <Button
                    key={nanoid()}
                    disabled={isDisabledSubmit}
                    className={`!w-full [&>span]:!text-white sm:[&>span]:!text-[15px] ${
                        isDisabledSubmit ? '!bg-[#3982e4]' : '!bg-[#007bff] hover:!bg-[#007bff]/90'
                    }`}
                    onClick={handleSubmit}
                >
                    {isLoading ? <Loading loaderClassName='!text-white' /> : formType === 'edit_post' ? 'Lưu' : 'Đăng'}
                </Button>
            ]}
            className='!w-full sm:!w-[560px]'
        >
            <div className='flex items-center py-2 sm:py-3'>
                <Link
                    to={routes.profile.replace(':profile_id', user?._id || '')}
                    className='mr-2 overflow-hidden rounded-full sm:mr-4'
                >
                    <img
                        src={user?.avatar ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${user.avatar}` : images.avatar}
                        alt='avatar'
                        className='h-10 w-10 object-cover'
                    />
                </Link>

                <div className='flex flex-col'>
                    <span className='line-clamp-1 text-sm font-medium text-[#050505] sm:text-base dark:text-[#e4e6eb]'>
                        {user?.name}
                    </span>
                    <span className='line-clamp-1 text-xs text-[#050505] sm:text-[13px] dark:text-[#e4e6eb]'>
                        {user?.email}
                    </span>
                </div>
            </div>

            <div className='-mx-1 max-h-[360px] overflow-y-auto overflow-x-hidden px-1 sm:-mx-2 sm:px-2 [&::-webkit-scrollbar-track]:!bg-transparent [&::-webkit-scrollbar]:!w-1.5 sm:[&::-webkit-scrollbar]:!w-2'>
                <PostEditor
                    innerRef={contentEditableRef}
                    placeholder={`Bạn đang nghĩ gì, ${user?.name}?`}
                    html={content}
                    setHtml={setContent}
                />

                {formType !== 'share_post' && isShowInputFile && (
                    <div
                        className={`group relative aspect-[16/9] w-full rounded-lg border border-solid border-black/20 p-2 transition-all dark:border-white/20 ${
                            medias.length ? 'h-auto' : 'h-[200px]'
                        }`}
                    >
                        {medias.length ? (
                            <MediasGrid medias={medias} setMedias={setMedias} handleUploadFile={handleUploadFile} />
                        ) : (
                            <>
                                <div className='relative flex h-full w-full flex-col items-center justify-center rounded-lg bg-[#eaebed]/60 transition-all group-hover:bg-[#d9dadc]/60 dark:bg-[#323436] dark:group-hover:bg-[#5a5b5c]/60'>
                                    <div
                                        className='absolute right-2 top-2 z-50 h-6 w-6 cursor-pointer'
                                        onClick={() => setIsShowInputFile(false)}
                                    >
                                        <svg
                                            className='h-full w-full text-[#8e8f91] transition-all hover:text-[#525151] dark:hover:text-[#c0bebe]'
                                            aria-hidden='true'
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='currentColor'
                                            viewBox='0 0 20 20'
                                        >
                                            <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z' />
                                        </svg>
                                    </div>

                                    <div className='flex justify-center'>
                                        <div className='flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#d8dadf] transition-all group-hover:bg-[#c2c3c8]'>
                                            <svg
                                                className='h-3/5 w-3/5'
                                                viewBox='0 0 24.00 24.00'
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='#000000'
                                                transform='rotate(0)'
                                            >
                                                <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                                                <g
                                                    id='SVGRepo_tracerCarrier'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    stroke='#CCCCCC'
                                                    strokeWidth='0.288'
                                                ></g>
                                                <g id='SVGRepo_iconCarrier'>
                                                    <rect x='0' fill='none' width='24' height='24'></rect>
                                                    <g>
                                                        <path d='M23 4v2h-3v3h-2V6h-3V4h3V1h2v3h3zm-8.5 7c.828 0 1.5-.672 1.5-1.5S15.328 8 14.5 8 13 8.672 13 9.5s.672 1.5 1.5 1.5zm3.5 3.234l-.513-.57c-.794-.885-2.18-.885-2.976 0l-.655.73L9 9l-3 3.333V6h7V4H6c-1.105 0-2 .895-2 2v12c0 1.105.895 2 2 2h12c1.105 0 2-.895 2-2v-7h-2v3.234z'></path>
                                                    </g>
                                                </g>
                                            </svg>
                                        </div>
                                    </div>

                                    <div className='text-center text-lg font-medium leading-6 text-black/60 transition-all dark:text-[#e4e6eb]'>
                                        Thêm ảnh/video
                                    </div>

                                    <div className='text-center text-xs text-[#949698] transition-all dark:text-[#e4e6eb]'>
                                        hoặc kéo và thả
                                    </div>
                                </div>

                                <label htmlFor='upload-file-post' className='absolute inset-0 cursor-pointer' />
                                <input
                                    id='upload-file-post'
                                    type='file'
                                    multiple
                                    accept='image/*, video/*'
                                    className='invisible block h-0 w-0'
                                    onChange={handleUploadFile}
                                />
                            </>
                        )}
                    </div>
                )}

                {formType === 'share_post' && postShared && <Post data={postShared} isParentPost />}
            </div>

            {formType !== 'share_post' && (
                <div className='mt-3 flex items-center justify-between rounded-lg border border-solid border-black/20 px-2 py-1 transition-all sm:px-4 sm:py-1.5 dark:border-white/20'>
                    <div className='text-sm font-medium text-[#333] transition-all sm:text-[15px] dark:text-[#e4e6eb]'>
                        Thêm vào bài viết của bạn
                    </div>

                    <div className='flex items-center'>
                        <button
                            className='flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-black/10 dark:hover:bg-[#3a3b3c] [&+button]:ml-2 sm:[&+button]:ml-4'
                            onClick={() => setIsShowInputFile(true)}
                        >
                            <svg
                                className='h-[20px] w-[20px] text-[#45bd62]'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='currentColor'
                                viewBox='0 0 20 18'
                            >
                                <path d='M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z' />
                            </svg>
                        </button>

                        <button
                            className='flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-black/10 dark:hover:bg-[#3a3b3c] [&+button]:ml-2 sm:[&+button]:ml-4'
                            onClick={() => setIsShowInputFile(true)}
                        >
                            <svg
                                className='h-[20px] w-[20px] text-[#f3425f]'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='currentColor'
                                viewBox='0 0 20 14'
                            >
                                <path d='M11 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm8.585 1.189a.994.994 0 0 0-.9-.138l-2.965.983a1 1 0 0 0-.685.949v8a1 1 0 0 0 .675.946l2.965 1.02a1.013 1.013 0 0 0 1.032-.242A1 1 0 0 0 20 12V2a1 1 0 0 0-.415-.811Z' />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    )
}

export default PostForm
