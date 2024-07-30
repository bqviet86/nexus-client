import { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import parse, { DOMNode, Element, HTMLReactParserOptions, domToReact } from 'html-react-parser'
import { Instance as TippyInstance } from 'tippy.js'
import Tippy from '@tippyjs/react/headless'

import MediasGrid from '~/components/MediasGrid'
import Button from '~/components/Button'
import PostForm from '~/components/PostForm'
import PostComment from '~/components/PostComment'
import { likePost, unlikePost } from '~/apis/likes.apis'
import images from '~/assets/images'
import { envConfig, routes } from '~/config'
import { NotificationPostAction, PostType } from '~/constants/enums'
import { AppContext } from '~/contexts/appContext'
import { useSocket } from '~/hooks'
import { ParentPost, Post as PostDataType } from '~/types/posts.types'
import { User } from '~/types/users.types'
import { Comment } from '~/types/comments.types'
import { formatTime } from '~/utils/handle'

type PostProps = {
    data: PostDataType | ParentPost
    isParentPost?: boolean
}

function Post({ data, isParentPost = false }: PostProps) {
    const postData = data as PostDataType
    const { instance: socket } = useSocket()

    const { user } = useContext(AppContext)
    const [isShowMoreBtn, setIsShowMoreBtn] = useState<boolean>(false)
    const [isShowComment, setIsShowComment] = useState<boolean>(false)
    const [isLiked, setIsLiked] = useState<boolean>(isParentPost ? false : postData.is_liked)
    const [likeCount, setLikeCount] = useState<number>(postData.like_count)
    const [commentCount, setCommentCount] = useState<number>(postData.comment_count)
    const [shareCount, setShareCount] = useState<number>(postData.share_count)
    const [isDisabledLikeBtn, setIsDisabledLikeBtn] = useState<boolean>(false)
    const [mode, setMode] = useState<'edit_post' | 'share_post' | 'delete_post'>('edit_post')
    const [isOpenPostForm, setIsOpenPostForm] = useState<boolean>(false)
    const [isShowInputFile, setIsShowInputFile] = useState<boolean>(data.medias.length > 0)

    const contentDivRef = useRef<HTMLDivElement>(null)

    const parseOptions: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (domNode instanceof Element) {
                const { attribs, children } = domNode

                if (attribs.class === 'text') {
                    return (
                        <span className='text-sm text-[#333] transition-all sm:text-[15px] dark:text-[#e4e6eb]'>
                            {domToReact(children as DOMNode[], parseOptions)}
                        </span>
                    )
                }

                if (attribs.class === 'hashtag') {
                    const hashtagName = domToReact(children as DOMNode[], parseOptions) as string
                    return (
                        <Link
                            to={routes.hashtag.replace(':hashtag_name', hashtagName.slice(1))}
                            className='text-sm text-[#1da1f2] transition-all hover:underline sm:text-[15px]'
                        >
                            {hashtagName}
                        </Link>
                    )
                }
            }
        }
    }

    useEffect(() => {
        if (contentDivRef.current && contentDivRef.current.clientHeight > 24 * 5) {
            setIsShowMoreBtn(true)
        }
    }, [])

    const { mutate: mutateLikePost } = useMutation({
        mutationFn: (post_id: string) => likePost(post_id)
    })

    const { mutate: mutateUnlikePost } = useMutation({
        mutationFn: (post_id: string) => unlikePost(post_id)
    })

    const handleLikeOrUnlikePost = () => {
        if (isDisabledLikeBtn) return

        isLiked ? mutateUnlikePost(data._id) : mutateLikePost(data._id)
        setIsDisabledLikeBtn(true)
    }

    useEffect(() => {
        if (socket && socket.connected) {
            const handleLikePost = ({ user_id, post_id }: { user_id: string; post_id: string }) => {
                if (post_id === data._id) {
                    user_id === (user as User)._id && setIsLiked(true)
                    setLikeCount((prevCount) => prevCount + 1)
                    setIsDisabledLikeBtn(false)
                }
            }
            const handleUnlikePost = ({ user_id, post_id }: { user_id: string; post_id: string }) => {
                if (post_id === data._id) {
                    user_id === (user as User)._id && setIsLiked(false)
                    setLikeCount((prevCount) => prevCount - 1)
                    setIsDisabledLikeBtn(false)
                }
            }

            socket.on(NotificationPostAction.LikePost, handleLikePost)
            socket.on('unlike_post', handleUnlikePost)

            return () => {
                socket.off(NotificationPostAction.LikePost, handleLikePost)
                socket.off('unlike_post', handleUnlikePost)
            }
        }
    }, [socket])

    useEffect(() => {
        if (socket && socket.connected) {
            const handleCommentPost = ({ comment }: { comment: Comment }) => {
                if (comment.post_id === data._id) {
                    setCommentCount((prevCount) => prevCount + 1)
                }
            }

            socket.on(NotificationPostAction.CommentPost, handleCommentPost)

            return () => {
                socket.off(NotificationPostAction.CommentPost, handleCommentPost)
            }
        }
    }, [socket])

    useEffect(() => {
        if (socket && socket.connected) {
            const handleDeleteComment = ({ comment, delete_count }: { comment: Comment; delete_count: number }) => {
                if (comment.post_id === data._id) {
                    setCommentCount((prevCount) => prevCount - delete_count)
                }
            }

            socket.on('delete_comment', handleDeleteComment)

            return () => {
                socket.off('delete_comment', handleDeleteComment)
            }
        }
    }, [socket])

    useEffect(() => {
        if (socket && socket.connected) {
            const handleSharePost = ({ post_id }: { post_id: string }) => {
                if (post_id === data._id) {
                    setShareCount((prevCount) => prevCount + 1)
                }
            }

            socket.on(NotificationPostAction.SharePost, handleSharePost)

            return () => {
                socket.off(NotificationPostAction.SharePost, handleSharePost)
            }
        }
    }, [socket])

    return (
        <div
            className={`post flex bg-white transition-all dark:bg-[#242526] ${
                isParentPost
                    ? 'flex-col-reverse rounded-xl border border-solid border-[#ced0d4] dark:border-[#3e4042]'
                    : 'flex-col rounded-lg px-2 pt-2 sm:px-4 sm:pt-3'
            }`}
        >
            <div className={isParentPost ? 'p-2 sm:px-4 sm:py-3' : 'mb-3'}>
                <div className='flex items-center'>
                    <Link
                        to={routes.profile.replace(':profile_id', data.user._id)}
                        className='h-10 w-10 overflow-hidden rounded-full'
                    >
                        <img
                            src={data.user.avatar ? `${envConfig.imageUrlPrefix}/${data.user.avatar}` : images.avatar}
                            alt='avatar'
                            className='h-full w-full rounded-full object-cover'
                        />
                    </Link>

                    <div className='ml-2 mr-auto flex flex-col'>
                        <Link
                            to={routes.profile.replace(':profile_id', data.user._id)}
                            className='w-max text-sm font-medium transition-all sm:text-[15px] dark:text-[#e4e6eb]'
                        >
                            {data.user.name}
                        </Link>
                        <span className='text-xs transition-all sm:mt-0.5 sm:text-[13px] dark:text-[#b0b3b8]'>
                            {formatTime(data.created_at, true)}
                        </span>
                    </div>

                    {user && user._id === data.user._id && (
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
                                        onClick={() => {
                                            setMode('edit_post')
                                            setIsOpenPostForm(true)
                                            ;(tippy as TippyInstance).hide()
                                        }}
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
                                            setMode('delete_post')
                                            setIsOpenPostForm(true)
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
                                    className='h-6 w-6 text-[#606770] transition-all dark:text-[#a8abaf]'
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 24 24'
                                    fill='currentColor'
                                >
                                    <path
                                        fillRule='evenodd'
                                        d='M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z'
                                        clipRule='evenodd'
                                    ></path>
                                </svg>
                            </div>
                        </Tippy>
                    )}
                </div>

                {data.content !== '<br>' && (
                    <div ref={contentDivRef} className={`leading-6 mt-3${isShowMoreBtn ? ' line-clamp-5' : ''}`}>
                        {parse(data.content, parseOptions)}
                    </div>
                )}

                {isShowMoreBtn && (
                    <span
                        className='cursor-pointer text-sm font-medium leading-6 text-[#333] transition-all hover:underline dark:text-[#e4e6eb]'
                        onClick={() => setIsShowMoreBtn(false)}
                    >
                        Xem thêm
                    </span>
                )}
            </div>

            {data.medias.length ? (
                <div className={`overflow-hidden ${isParentPost ? 'rounded-t-xl' : 'rounded-lg'}`}>
                    <MediasGrid mode='display' medias={data.medias} />
                </div>
            ) : null}

            {data.type === PostType.Share && <Post data={postData.parent_post as ParentPost} isParentPost />}

            {!isParentPost && (
                <>
                    <div className='flex justify-between py-2.5'>
                        <div className='flex items-center gap-1'>
                            <div className='flex h-5 w-5 items-center justify-center rounded-full bg-[#138df0]'>
                                <svg
                                    className='h-[14px] w-[14px] text-white'
                                    aria-hidden='true'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        fillRule='evenodd'
                                        d='M15 9.7h4a2 2 0 0 1 1.6.9 2 2 0 0 1 .3 1.8l-2.4 7.2c-.3.9-.5 1.4-1.9 1.4-2 0-4.2-.7-6.1-1.3L9 19.3V9.5A32 32 0 0 0 13.2 4c.1-.4.5-.7.9-.9h1.2c.4.1.7.4 1 .7l.2 1.3L15 9.7ZM4.2 10H7v8a2 2 0 1 1-4 0v-6.8c0-.7.5-1.2 1.2-1.2Z'
                                        clipRule='evenodd'
                                    />
                                </svg>
                            </div>
                            <span className='text-sm text-[#65676b] transition-all dark:text-[#b0b3b8]'>
                                {isLiked
                                    ? likeCount > 1
                                        ? `Bạn và ${likeCount - 1} người khác`
                                        : 'Bạn'
                                    : `${likeCount} lượt thích`}
                            </span>
                        </div>

                        <div className='flex items-center gap-2'>
                            <span className='text-sm text-[#65676b] transition-all dark:text-[#b0b3b8]'>
                                {commentCount} bình luận
                            </span>
                            {data.type !== PostType.Share && (
                                <span className='text-sm text-[#65676b] transition-all dark:text-[#b0b3b8]'>
                                    {shareCount} lượt chia sẻ
                                </span>
                            )}
                        </div>
                    </div>

                    <div className='flex border-t-[1px] border-solid border-[#ced0d4] py-1 transition-all dark:border-[#3e4042]'>
                        <Button
                            icon={
                                isLiked ? (
                                    <svg
                                        className='h-[20px] w-[20px] text-[#0566ff]'
                                        aria-hidden='true'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='currentColor'
                                        viewBox='0 0 24 24'
                                    >
                                        <path
                                            fillRule='evenodd'
                                            d='M15 9.7h4a2 2 0 0 1 1.6.9 2 2 0 0 1 .3 1.8l-2.4 7.2c-.3.9-.5 1.4-1.9 1.4-2 0-4.2-.7-6.1-1.3L9 19.3V9.5A32 32 0 0 0 13.2 4c.1-.4.5-.7.9-.9h1.2c.4.1.7.4 1 .7l.2 1.3L15 9.7ZM4.2 10H7v8a2 2 0 1 1-4 0v-6.8c0-.7.5-1.2 1.2-1.2Z'
                                            clipRule='evenodd'
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className='h-[20px] w-[20px] text-[#65676b] transition-all dark:text-[#b0b3b8]'
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
                                            d='M7 11c.9 0 1.4-.5 2.2-1a33.3 33.3 0 0 0 4.5-5.8 1.5 1.5 0 0 1 2 .3 1.6 1.6 0 0 1 .4 1.3L14.7 10M7 11H4v6.5c0 .8.7 1.5 1.5 1.5v0c.8 0 1.5-.7 1.5-1.5V11Zm6.5-1h5l.5.1a1.8 1.8 0 0 1 1 1.4l-.1.9-2.1 6.4c-.3.7-.4 1.2-1.7 1.2-2.3 0-4.8-1-6.7-1.5'
                                        />
                                    </svg>
                                )
                            }
                            className={`!h-9 !w-full !rounded !px-1 [&+.btn]:!ml-1${
                                isLiked ? ' [&>span]:!text-[#0566ff]' : ''
                            }`}
                            onClick={handleLikeOrUnlikePost}
                        >
                            Thích
                        </Button>

                        <Button
                            icon={
                                <svg
                                    className='h-[20px] w-[20px] text-[#65676b] transition-all dark:text-[#b0b3b8]'
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
                                        d='M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z'
                                    />
                                </svg>
                            }
                            className='!h-9 !w-full !rounded !px-1 [&+.btn]:!ml-1'
                            onClick={() => setIsShowComment(!isShowComment)}
                        >
                            Bình luận
                        </Button>

                        {user &&
                            (data.type === PostType.Post
                                ? data.user._id !== user._id
                                : (postData.parent_post as ParentPost).user._id !== user._id) && (
                                <Button
                                    icon={
                                        <svg
                                            className='h-[20px] w-[20px] text-[#65676b] transition-all dark:text-[#b0b3b8]'
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
                                                d='M4.2 19c-1-3.2 1-10.8 8.3-10.8V6.1a1 1 0 0 1 1.6-.9l5.5 4.3a1.1 1.1 0 0 1 0 1.7L14 15.6a1 1 0 0 1-1.6-1v-2c-7.2 1-8.3 6.4-8.3 6.4Z'
                                            />
                                        </svg>
                                    }
                                    className='!h-9 !w-full !rounded !px-1 [&+.btn]:!ml-1'
                                    onClick={() => {
                                        setMode('share_post')
                                        setIsOpenPostForm(true)
                                    }}
                                >
                                    Chia sẻ
                                </Button>
                            )}
                    </div>
                </>
            )}

            {isShowComment && <PostComment postId={data._id} />}

            <PostForm
                formType={mode}
                isOpenForm={isOpenPostForm}
                onCloseForm={() => setIsOpenPostForm(false)}
                {...(mode === 'share_post'
                    ? { postShared: data.type === PostType.Post ? data : postData.parent_post }
                    : {
                          isShowInputFile,
                          setIsShowInputFile,
                          post: data as PostDataType
                      })}
            />
        </div>
    )
}

export default Post
