import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroll-component'

import Loading from '~/components/Loading'
import { GetDatingConversationReqData, getDatingConversation } from '~/apis/datingConversations.apis'
import images from '~/assets/images'
import { AppContext } from '~/contexts/appContext'
import { useSocket } from '~/hooks'
import { DatingConversation } from '~/types/datingConversations.types'
import { Pagination } from '~/types/commons.types'
import { DatingProfile } from '~/types/datingUsers.types'
import { formatTime } from '~/utils/handle'

const LIMIT = 20

function DatingChatDetail() {
    const { profile_id } = useParams()
    const queryClient = useQueryClient()
    const { instance: socket, emit } = useSocket()

    const { datingProfile } = useContext(AppContext)
    const [conversations, setConversations] = useState<DatingConversation[]>([])
    const [pagination, setPagination] = useState<Pagination>({ page: 1, total_pages: 0 })
    const [content, setContent] = useState<string>('')

    const getDatingConversationQueryFn = async (data: GetDatingConversationReqData) => {
        const response = await getDatingConversation(data)
        const { result } = response.data

        setConversations((prevConversations) => {
            const newConversations = result?.conversations as DatingConversation[]
            return data.page === 1 ? newConversations : [...prevConversations, ...newConversations]
        })
        setPagination({
            page: result?.page as number,
            total_pages: result?.total_pages as number
        })

        return response
    }

    const { isFetching } = useQuery({
        queryKey: ['datingConversation', { receiver_id: profile_id, page: pagination.page, limit: LIMIT }],
        queryFn: () =>
            getDatingConversationQueryFn({
                receiver_id: profile_id as string,
                page: pagination.page,
                limit: LIMIT
            }),
        enabled: !!profile_id && (pagination.page === 1 || pagination.page < pagination.total_pages)
    })

    const handleFetchMoreConversations = () => {
        const nextPage = pagination.page + 1

        if (nextPage < pagination.total_pages) {
            setPagination((prevPagination) => ({
                ...prevPagination,
                page: nextPage
            }))
        } else {
            queryClient.fetchQuery({
                queryKey: ['datingConversation', { receiver_id: profile_id, page: nextPage, limit: LIMIT }],
                queryFn: () =>
                    getDatingConversationQueryFn({
                        receiver_id: profile_id as string,
                        page: nextPage,
                        limit: LIMIT
                    })
            })
        }
    }

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!content) return

        emit('dating_send_message', {
            sender_id: (datingProfile as DatingProfile)._id,
            receiver_id: profile_id as string,
            content
        })
    }

    useEffect(() => {
        if (socket && socket.connected) {
            const handleReceiveMessage = (conversation: DatingConversation) => {
                setConversations((prevConversations) => [conversation, ...prevConversations])
                if (conversation.sender._id === (datingProfile as DatingProfile)._id) setContent('')
            }

            socket.on('dating_receive_message', handleReceiveMessage)

            return () => {
                socket.off('dating_receive_message', handleReceiveMessage)
            }
        }
    }, [socket])

    return (
        <>
            {isFetching && pagination.page === 1 ? (
                <Loading
                    className='flex h-[calc(100%-44px)] w-full items-center justify-center py-2'
                    loaderClassName='dark:!text-[#e4e6eb]'
                />
            ) : conversations.length === 0 ? (
                <div className='flex h-[calc(100%-44px)] flex-col items-center justify-center py-2'>
                    <div className='mt-2 text-center text-sm transition-all dark:text-[#e4e6eb]'>
                        Bắt đầu cuộc trò chuyện với người này
                    </div>
                </div>
            ) : (
                <div className='-mx-4 h-[calc(100%-28px)] -translate-y-2 [&>div]:h-full'>
                    <InfiniteScroll
                        inverse
                        height='100%'
                        dataLength={conversations.length}
                        hasMore={pagination.page < pagination.total_pages}
                        loader={<Loading className='my-2 w-full' loaderClassName='dark:!text-[#e4e6eb]' />}
                        next={handleFetchMoreConversations}
                        className='flex flex-col-reverse p-3 [&::-webkit-scrollbar-track]:!bg-transparent'
                    >
                        {conversations.map((conversation, index) => {
                            const isMe = conversation.sender._id === (datingProfile as DatingProfile)._id
                            const isSameSender = conversation.sender._id === conversations[index + 1]?.sender._id

                            return (
                                <div
                                    key={conversation._id}
                                    className={`flex items-start gap-3${isMe ? ' flex-row-reverse' : ''} ${
                                        isSameSender ? 'mt-1' : 'mt-3'
                                    }`}
                                >
                                    {!isMe && !isSameSender && (
                                        <img
                                            src={
                                                conversation.sender.avatar
                                                    ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${
                                                          conversation.sender.avatar
                                                      }`
                                                    : images.avatar
                                            }
                                            alt={conversation.sender.name}
                                            className='h-8 w-8 flex-shrink-0 rounded-full object-cover'
                                        />
                                    )}

                                    <div
                                        className={`flex min-w-20 flex-col gap-1 rounded-xl px-3 py-1.5 ${
                                            isMe ? 'ml-16 bg-[#423d48]' : 'mr-16 bg-[#3c373c]'
                                        }${isSameSender ? ' ml-11' : ''}`}
                                    >
                                        <p className='text-base'>{conversation.content}</p>
                                        <span className='text-xs text-[#e4e6eb]/70'>
                                            {formatTime(conversation.created_at)}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </InfiniteScroll>
                </div>
            )}

            <form className='absolute inset-x-0 bottom-0' onSubmit={handleSendMessage}>
                <input
                    placeholder='Nhập tin nhắn của bạn'
                    spellCheck='false'
                    className='h-11 w-full border border-solid border-[#4c4a4c] bg-[#3c373c] py-2 pl-3 pr-12'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <button type='submit' className='absolute right-3 top-1/2 -translate-y-1/2'>
                    <svg
                        className={`h-[24px] w-[24px] rotate-90 ${
                            content
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
            </form>
        </>
    )
}

export default DatingChatDetail
