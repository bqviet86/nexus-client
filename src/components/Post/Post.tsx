import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import parse, { DOMNode, Element, HTMLReactParserOptions, domToReact } from 'html-react-parser'

import MediasGrid from '~/components/MediasGrid'
import Button from '~/components/Button'
import images from '~/assets/images'
import { routes } from '~/config'
import { PostDetail } from '~/types/posts.types'
import { formatTime } from '~/utils/handle'

type PostProps = {
    data: PostDetail
}

function Post({ data }: PostProps) {
    const [isShowMoreBtn, setIsShowMoreBtn] = useState<boolean>(false)

    const contentDivRef = useRef<HTMLDivElement>(null)

    const parseOptions: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (domNode instanceof Element) {
                const { attribs, children } = domNode

                if (attribs.class === 'text') {
                    return (
                        <span className='text-sm text-[#333] sm:text-[15px] dark:text-[#e4e6eb]'>
                            {domToReact(children as DOMNode[], parseOptions)}
                        </span>
                    )
                }

                if (attribs.class === 'hashtag') {
                    const hashtagName = domToReact(children as DOMNode[], parseOptions) as string
                    return (
                        <Link
                            to={routes.hashtag.replace(':hashtag_name', hashtagName.slice(1))}
                            className='text-sm text-[#1da1f2] hover:underline sm:text-[15px]'
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

    return (
        <div className='post rounded-lg bg-white p-2 sm:px-4 sm:py-3'>
            <div className='flex items-center'>
                <Link
                    to={routes.profile.replace(':profile_id', data.user._id)}
                    className='h-10 w-10 overflow-hidden rounded-full'
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
                <div className='ml-2 flex flex-col'>
                    <Link
                        to={routes.profile.replace(':profile_id', data.user._id)}
                        className='w-max text-sm font-medium sm:text-[15px]'
                    >
                        {data.user.name}
                    </Link>
                    <span className='text-xs sm:mt-0.5 sm:text-[13px]'>{formatTime(data.created_at, true)}</span>
                </div>
            </div>

            {data.content !== '<br>' && (
                <div ref={contentDivRef} className={`leading-6 mt-3${isShowMoreBtn ? ' line-clamp-5' : ''}`}>
                    {parse(data.content, parseOptions)}
                </div>
            )}

            {isShowMoreBtn && (
                <span
                    className='cursor-pointer text-sm font-medium leading-6 text-[#333] hover:underline dark:text-[#e4e6eb]'
                    onClick={() => setIsShowMoreBtn(false)}
                >
                    Xem thêm
                </span>
            )}

            {data.medias.length ? (
                <div className='mt-3'>
                    <MediasGrid mode='display' medias={data.medias} />
                </div>
            ) : null}

            <div className='flex justify-between py-2.5'>
                <div className='flex items-center gap-1'>
                    <svg
                        className='h-[20px] w-[20px] text-[#65676b]'
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
                    <span className='text-sm text-[#65676b]'>18 luợt thích</span>
                </div>
                <div className='flex items-center gap-2'>
                    <span className='text-sm text-[#65676b]'>453 bình luận</span>
                    <span className='text-sm text-[#65676b]'>12 lượt chia sẻ</span>
                </div>
            </div>

            <div className='flex border-y-[1px] border-solid border-[#ddd] py-1'>
                <Button
                    icon={
                        <svg
                            className='h-[20px] w-[20px] text-[#65676b]'
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
                    }
                    className='!h-9 !w-full !rounded !px-1 [&+.btn]:!ml-1'
                >
                    Thích
                </Button>
                <Button
                    icon={
                        <svg
                            className='h-[20px] w-[20px] text-[#65676b]'
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
                >
                    Bình luận
                </Button>
                <Button
                    icon={
                        <svg
                            className='h-[20px] w-[20px] text-[#65676b]'
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
                                d='m15.1 6 5.6 5a1 1 0 0 1 0 1.5l-5.7 5m-6-3V16a1 1 0 0 0 1.5.8l5.1-4.2a1.1 1.1 0 0 0 0-1.7l-5-4.2a1 1 0 0 0-1.6.8v1.7c-3.3 0-6 3-6 6.7v1.3a.7.7 0 0 0 1.3.4A5.2 5.2 0 0 1 9 14.4h0Z'
                            />
                        </svg>
                    }
                    className='!h-9 !w-full !rounded !px-1 [&+.btn]:!ml-1'
                >
                    Chia sẻ
                </Button>
            </div>
        </div>
    )
}

export default Post
