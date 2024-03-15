import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import FriendSuggestItem from './FriendSuggestItem'
import { getAllFriendSuggestions } from '~/apis/users.apis'
import { User } from '~/types/users.types'

function FriendSuggestion() {
    const [friendSuggestions, setFriendSuggestions] = useState<User[]>([])

    useQuery({
        queryKey: ['friend_suggestions'],
        queryFn: async () => {
            const response = await getAllFriendSuggestions()
            setFriendSuggestions(response.data.result as User[])
            return response
        }
    })

    return (
        <div className='flex max-h-[50%] flex-col rounded-lg bg-white px-4 py-3 transition-all dark:bg-[#242526]'>
            <h3 className='font-medium text-[#65676b] transition-all dark:text-[#b0b3b8]'>Gợi ý kết bạn</h3>

            {friendSuggestions.length ? (
                <div
                    className={`mt-3 overflow-y-auto [&::-webkit-scrollbar-track]:!bg-transparent [&::-webkit-scrollbar]:!w-1.5${
                        friendSuggestions.length > 2 ? ' -mr-[11px] pr-[5px]' : ''
                    }`}
                >
                    {friendSuggestions.map((user) => (
                        <FriendSuggestItem key={user._id} user={user} />
                    ))}
                </div>
            ) : null}
        </div>
    )
}

export default FriendSuggestion
