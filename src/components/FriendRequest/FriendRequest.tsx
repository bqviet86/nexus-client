import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import FriendRequestItem from './FriendRequestItem'
import { getAllFriendRequests } from '~/apis/users.apis'
import { Friend } from '~/types/users.types'

function FriendRequest() {
    const [friendRequests, setFriendRequests] = useState<Friend[]>([])

    useQuery({
        queryKey: ['friend_requests'],
        queryFn: async () => {
            const response = await getAllFriendRequests()
            setFriendRequests(response.data.result as Friend[])
            return response
        }
    })

    return (
        <div className='flex max-h-[50%] flex-col rounded-lg bg-white px-4 py-3 transition-all dark:bg-[#242526]'>
            <h3 className='font-medium text-[#65676b] transition-all dark:text-[#b0b3b8]'>Lời mời kết bạn</h3>

            {friendRequests.length ? (
                <div
                    className={`mt-3 overflow-y-auto [&::-webkit-scrollbar-track]:!bg-transparent [&::-webkit-scrollbar]:!w-1.5${
                        friendRequests.length > 2 ? ' -mr-[11px] pr-[5px]' : ''
                    }`}
                >
                    {friendRequests.map((friend) => (
                        <FriendRequestItem key={friend._id} friend={friend} />
                    ))}
                </div>
            ) : null}
        </div>
    )
}

export default FriendRequest
