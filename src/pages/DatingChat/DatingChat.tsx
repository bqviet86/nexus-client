import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import Loading from '~/components/Loading'
import { getAllDatingConversations } from '~/apis/datingConversations.apis'
import images from '~/assets/images'
import { envConfig, routes } from '~/config'
import { AppContext } from '~/contexts/appContext'
import { DatingProfile } from '~/types/datingUsers.types'
import { formatTime } from '~/utils/handle'

function DatingChat() {
    const { datingProfile } = useContext(AppContext)

    const { data: conversations } = useQuery({
        queryKey: ['datingConversations'],
        queryFn: async () => {
            const response = await getAllDatingConversations()
            return response.data.result
        }
    })

    return conversations ? (
        <>
            <h3 className='mt-2 text-center text-xl font-medium'>Tin nhắn</h3>

            <div className='mb-2 mt-4 flex flex-col gap-2'>
                {conversations.map((conversation) => {
                    const myProperty =
                        (datingProfile as DatingProfile)._id === conversation.sender._id ? 'sender' : 'receiver'
                    const userProperty = myProperty === 'sender' ? 'receiver' : 'sender'

                    return (
                        <Link
                            key={conversation._id}
                            to={routes.datingChatDetail.replace(':profile_id', conversation[userProperty]._id)}
                            className='flex cursor-pointer rounded-lg border-solid border-[#4c4a4c] bg-[#3c373c] px-4 py-2'
                        >
                            <img
                                src={
                                    conversation[userProperty].avatar
                                        ? `${envConfig.imageUrlPrefix}/${conversation[userProperty].avatar}`
                                        : images.avatar
                                }
                                alt={conversation[userProperty].name}
                                className='h-12 w-12 rounded-full object-cover'
                            />

                            <div className='ml-2 flex flex-[1] flex-col justify-between'>
                                <div className='flex items-center justify-between gap-2'>
                                    <span className='line-clamp-1 font-medium'>{conversation[userProperty].name}</span>
                                    <span className='flex-shrink-0 text-xs'>{formatTime(conversation.created_at)}</span>
                                </div>
                                <p className='line-clamp-1 text-sm text-[#e4e6eb]/70'>{conversation.content}</p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </>
    ) : (
        <Loading
            loaderSize={40}
            loaderClassName='!text-[#07e1ff]'
            className='flex h-full items-center justify-center'
        />
    )
}

export default DatingChat
