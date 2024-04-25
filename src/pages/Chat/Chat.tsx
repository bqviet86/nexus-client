import { useContext, useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroll-component'

import Loading from '~/components/Loading'
import { GetConversationReqData, getAllConversations, getConversation } from '~/apis/conversations.apis'
import images from '~/assets/images'
import { AppContext } from '~/contexts/appContext'
import { useSocket } from '~/hooks'
import { User } from '~/types/users.types'
import { Conversation } from '~/types/conversations.types'
import { Pagination } from '~/types/commons.types'
import { formatTime } from '~/utils/handle'

const LIMIT = 20

function Chat() {
    const queryClient = useQueryClient()
    const { instance: socket, emit } = useSocket()

    const { user } = useContext(AppContext)
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])
    const [searchText, setSearchText] = useState<string>('')
    const [isShowMessages, setIsShowMessages] = useState<boolean>(window.innerWidth >= 640)
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
    const [currentUserProperty, setCurrentUserProperty] = useState<'sender' | 'receiver' | null>(null)
    const [messages, setMessages] = useState<Conversation[]>([])
    const [pagination, setPagination] = useState<Pagination>({ page: 1, total_pages: 0 })
    const [content, setContent] = useState<string>('')

    const { isFetching } = useQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
            const response = await getAllConversations()
            const result = response.data.result as Conversation[]

            setConversations(result)
            setFilteredConversations(result)

            return result
        }
    })

    useEffect(() => {
        setFilteredConversations(conversations)
    }, [conversations])

    useEffect(() => {
        if (!searchText) {
            setFilteredConversations(conversations)
            return
        }

        setFilteredConversations(
            conversations.filter((conversation) => {
                const userProperty = (user as User)._id === conversation.sender._id ? 'receiver' : 'sender'
                return new RegExp(searchText, 'i').test(conversation[userProperty].name)
            })
        )
    }, [conversations, searchText])

    const getConversationQueryFn = async (data: GetConversationReqData) => {
        const response = await getConversation(data)
        const { result } = response.data

        !isShowMessages && setIsShowMessages(true)
        setMessages((prevMessages) => {
            const newMessages = result?.conversations as Conversation[]
            return data.page === 1 ? newMessages : [...prevMessages, ...newMessages]
        })
        setPagination({
            page: result?.page as number,
            total_pages: result?.total_pages as number
        })

        return response
    }

    useQuery({
        queryKey: [
            'conversation',
            {
                receiver_id: (currentUserProperty && (currentConversation?.[currentUserProperty]._id as string)) || '',
                page: pagination.page,
                limit: LIMIT
            }
        ],
        queryFn: () =>
            getConversationQueryFn({
                receiver_id: (currentUserProperty && (currentConversation?.[currentUserProperty]._id as string)) || '',
                page: pagination.page,
                limit: LIMIT
            }),
        enabled:
            !!currentConversation &&
            !!currentUserProperty &&
            (pagination.page === 1 || pagination.page < pagination.total_pages)
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
                queryKey: [
                    'conversation',
                    {
                        receiver_id:
                            (currentUserProperty && (currentConversation?.[currentUserProperty]._id as string)) || '',
                        page: nextPage,
                        limit: LIMIT
                    }
                ],
                queryFn: () =>
                    getConversationQueryFn({
                        receiver_id:
                            (currentUserProperty && (currentConversation?.[currentUserProperty]._id as string)) || '',
                        page: nextPage,
                        limit: LIMIT
                    })
            })
        }
    }

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!content) return

        emit('send_message', {
            sender_id: (user as User)._id,
            receiver_id: (currentUserProperty && (currentConversation?.[currentUserProperty]._id as string)) || '',
            content
        })
    }

    useEffect(() => {
        if (socket && socket.connected) {
            const handleReceiveMessage = (conversation: Conversation) => {
                const myProperty = (user as User)._id === conversation.sender._id ? 'sender' : 'receiver'
                const userProperty = myProperty === 'sender' ? 'receiver' : 'sender'

                setConversations((prevConversations) =>
                    prevConversations.map((c) =>
                        [c.sender._id, c.receiver._id].includes(conversation[userProperty]._id) ? conversation : c
                    )
                )
                setMessages((prevMessages) => [conversation, ...prevMessages])
                if (myProperty === 'sender') setContent('')
            }

            socket.on('receive_message', handleReceiveMessage)

            return () => {
                socket.off('receive_message', handleReceiveMessage)
            }
        }
    }, [socket])

    return (
        <div className='h-[calc(100vh-60px)] overflow-hidden py-4'>
            {conversations.length ? (
                <div
                    className={`-mx-1 flex h-full w-[calc(200%+16px)] transition-all sm:w-[calc(100%+8px)]${
                        isShowMessages ? ' -translate-x-1/2 sm:translate-x-0' : ''
                    }`}
                >
                    <div className='mx-1 h-full w-[calc(50%-8px)] lg:w-[calc(25%-8px)]'>
                        <div className='flex flex-col gap-2'>
                            <h2 className='text-[28px] font-semibold text-[#26a69a]'>Trò chuyện</h2>
                            <input
                                placeholder='Tìm kiếm'
                                spellCheck={false}
                                className='h-10 w-full rounded-full border border-solid border-[#8eabb4] bg-transparent px-4 py-2'
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>

                        <div className='mt-4 flex h-[calc(100%-106px)] flex-col gap-2 overflow-hidden overflow-y-auto rounded-lg [&::-webkit-scrollbar-track]:!bg-transparent'>
                            {filteredConversations.map((conversation) => {
                                const myProperty =
                                    (user as User)._id === conversation.sender._id ? 'sender' : 'receiver'
                                const userProperty = myProperty === 'sender' ? 'receiver' : 'sender'
                                const isActive = conversation._id === currentConversation?._id

                                return (
                                    <div
                                        key={conversation._id}
                                        className={`group flex cursor-pointer rounded-lg border border-solid bg-[#f8f8f8] p-2 transition-all hover:border-[#26a69a] ${
                                            isActive ? 'border-[#26a69a]' : 'border-[#e4e6eb]'
                                        }`}
                                        onClick={() => {
                                            if (isActive) {
                                                setIsShowMessages(true)
                                                return
                                            }

                                            setCurrentConversation(conversation)
                                            setCurrentUserProperty(userProperty)
                                            setPagination({ page: 1, total_pages: 0 })
                                        }}
                                    >
                                        <img
                                            src={
                                                conversation[userProperty].avatar
                                                    ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${
                                                          conversation[userProperty].avatar
                                                      }`
                                                    : images.avatar
                                            }
                                            alt={conversation[userProperty].name}
                                            className='h-12 w-12 rounded-full object-cover'
                                        />

                                        <div className='ml-2 flex flex-[1] flex-col justify-between'>
                                            <div className='flex items-center justify-between gap-2'>
                                                <span
                                                    className={`line-clamp-1 transition-all group-hover:text-[#26a69a] font-medium${
                                                        isActive ? ' text-[#26a69a]' : ''
                                                    }`}
                                                >
                                                    {conversation[userProperty].name}
                                                </span>
                                                <span
                                                    className={`flex-shrink-0 transition-all group-hover:text-[#26a69a] text-xs${
                                                        isActive ? ' text-[#26a69a]' : ''
                                                    }`}
                                                >
                                                    {formatTime(conversation.created_at)}
                                                </span>
                                            </div>

                                            <p
                                                className={`line-clamp-1 text-sm transition-all group-hover:text-[#26a69a]/50 ${
                                                    isActive ? 'text-[#26a69a]/50' : 'text-[#969696]'
                                                }`}
                                            >
                                                {conversation.content}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className='mx-1 h-full w-[calc(50%-8px)] lg:w-[calc(75%-8px)]'>
                        {isShowMessages &&
                            (currentConversation && currentUserProperty ? (
                                <div className='flex h-full flex-col gap-2'>
                                    <div className='flex items-center justify-between gap-2'>
                                        <button
                                            className='flex h-9 w-9 items-center justify-center p-1 sm:hidden'
                                            onClick={() => {
                                                setIsShowMessages(false)
                                                setCurrentConversation(null)
                                                setCurrentUserProperty(null)
                                            }}
                                        >
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

                                        <div className='flex flex-row-reverse items-center gap-2 sm:flex-row'>
                                            <img
                                                src={
                                                    currentConversation[currentUserProperty].avatar
                                                        ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${
                                                              currentConversation[currentUserProperty].avatar
                                                          }`
                                                        : images.avatar
                                                }
                                                alt={currentConversation[currentUserProperty].name}
                                                className='h-10 w-10 rounded-full object-cover'
                                            />
                                            <span className='line-clamp-1 text-lg font-semibold'>
                                                {currentConversation[currentUserProperty].name}
                                            </span>
                                        </div>
                                    </div>

                                    <div className='h-[calc(100%-104px)] rounded-lg shadow-[inset_0_0_6px_rgba(0,0,0,.3)] [&>div]:h-full'>
                                        <InfiniteScroll
                                            inverse
                                            height='100%'
                                            dataLength={messages.length}
                                            hasMore={pagination.page < pagination.total_pages}
                                            loader={
                                                <Loading
                                                    className='my-2 w-full'
                                                    loaderClassName='dark:!text-[#e4e6eb] !text-[#26a69a]'
                                                />
                                            }
                                            next={handleFetchMoreConversations}
                                            className='flex flex-col-reverse p-3 [&::-webkit-scrollbar-track]:!bg-transparent'
                                        >
                                            {messages.map((message, index) => {
                                                const isMe = message.sender._id === (user as User)._id
                                                const isSameSender =
                                                    message.sender._id === messages[index + 1]?.sender._id

                                                return (
                                                    <div
                                                        key={message._id}
                                                        className={`flex items-start gap-3${
                                                            isMe ? ' flex-row-reverse' : ''
                                                        } ${isSameSender ? 'mt-1' : 'mt-3'}`}
                                                    >
                                                        {!isMe && !isSameSender && (
                                                            <img
                                                                src={
                                                                    message.sender.avatar
                                                                        ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${
                                                                              message.sender.avatar
                                                                          }`
                                                                        : images.avatar
                                                                }
                                                                alt={message.sender.name}
                                                                className='h-8 w-8 flex-shrink-0 rounded-full object-cover'
                                                            />
                                                        )}

                                                        <div
                                                            className={`flex min-w-20 max-w-80 flex-col gap-1 rounded-xl px-3 py-1.5 ${
                                                                isMe ? 'ml-16 bg-[#26a69a]' : 'mr-16 bg-[#26a69a]/70'
                                                            }${isSameSender ? ' ml-11' : ''}`}
                                                        >
                                                            <p className='break-words text-base text-white'>
                                                                {message.content}
                                                            </p>
                                                            <span className='text-xs text-[#e4e6eb]/90'>
                                                                {formatTime(message.created_at)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </InfiniteScroll>
                                    </div>

                                    <form className='relative mt-2' onSubmit={handleSendMessage}>
                                        <input
                                            placeholder='Nhập tin nhắn...'
                                            spellCheck={false}
                                            className='h-10 w-full rounded-full border border-solid border-[#8eabb4] bg-transparent py-2 pl-4 pr-12'
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
                                </div>
                            ) : (
                                <div className='flex h-full flex-col items-center justify-center gap-1'>
                                    <svg
                                        className='mx-auto h-24 w-24'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'
                                    >
                                        <g>
                                            <path
                                                d='M14.7767 14.0377L17.4267 10.1182C17.689 9.73215 17.1916 9.31251 16.8117 9.58947L13.9536 11.6038C13.8597 11.6691 13.7454 11.7045 13.628 11.7045C13.5106 11.7045 13.3963 11.6691 13.3024 11.6038L11.186 10.1266C10.5529 9.69019 9.64842 9.84965 9.22333 10.4623L6.57328 14.3818C6.31099 14.7679 6.80844 15.1875 7.18831 14.9105L10.0464 12.8962C10.1403 12.8309 10.2546 12.7955 10.372 12.7955C10.4894 12.7955 10.6037 12.8309 10.6976 12.8962L12.814 14.3482C13.4471 14.8098 14.3516 14.6504 14.7767 14.0377Z'
                                                fill='currentColor'
                                            />
                                            <path
                                                fillRule='evenodd'
                                                clipRule='evenodd'
                                                d='M12 2.25C6.61522 2.25 2.25 6.61522 2.25 12C2.25 14.7651 3.40194 17.2621 5.25 19.0356V21.5C5.25 21.7411 5.36589 21.9675 5.56147 22.1084C5.75704 22.2494 6.00846 22.2878 6.23717 22.2115L9.01683 21.285C9.95792 21.5871 10.9606 21.75 12 21.75C17.3848 21.75 21.75 17.3848 21.75 12C21.75 6.61522 17.3848 2.25 12 2.25ZM3.75 12C3.75 7.44365 7.44365 3.75 12 3.75C16.5563 3.75 20.25 7.44365 20.25 12C20.25 16.5563 16.5563 20.25 12 20.25C11.0405 20.25 10.1207 20.0865 9.26612 19.7865C9.10916 19.7313 8.93832 19.73 8.7805 19.7826L6.75 20.4594V18.7083C6.75 18.495 6.65915 18.2917 6.50019 18.1495C4.81118 16.6378 3.75 14.4433 3.75 12Z'
                                                fill='currentColor'
                                            />
                                        </g>
                                    </svg>
                                    <div className='text-xl font-medium'>Tin nhắn của bạn</div>
                                    <p className='text-sm text-[#969696]'>Gửi ảnh và tin nhắn riêng tư cho bạn bè</p>
                                </div>
                            ))}
                    </div>
                </div>
            ) : (
                isFetching && (
                    <Loading
                        loaderSize={40}
                        loaderClassName='!text-[#26a69a]'
                        className='flex h-full w-full items-center justify-center'
                    />
                )
            )}
        </div>
    )
}

export default Chat
