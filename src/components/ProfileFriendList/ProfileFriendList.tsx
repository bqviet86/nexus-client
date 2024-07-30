import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { getAllFriends } from '~/apis/users.apis'
import images from '~/assets/images'
import { envConfig, routes } from '~/config'
import Loading from '~/components/Loading'

type ProfileFriendListProps = {
    profile_id: string
}

function ProfileFriendList({ profile_id }: ProfileFriendListProps) {
    const { data: friends } = useQuery({
        queryKey: ['friend_list', profile_id],
        queryFn: async () => {
            const response = await getAllFriends(profile_id)
            return response.data.result
        },
        enabled: !!profile_id
    })

    return (
        <div className='rounded-lg bg-white p-3 transition-all sm:p-4 dark:bg-[#242526]'>
            <h3 className='text-xl font-semibold transition-all sm:text-2xl dark:text-[#e4e6eb]'>Bạn bè</h3>

            {friends ? (
                friends.length ? (
                    <div className='mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4'>
                        {friends.map((friend) => (
                            <Link
                                key={friend._id}
                                to={routes.profile.replace(':profile_id', friend._id)}
                                className='flex items-center rounded-lg border border-solid border-[#e4e6eb] px-2 py-3 transition-all hover:bg-[#f2f2f2] sm:w-[calc(50%-8px)] sm:p-4 dark:border-[#3d3f41] dark:hover:bg-[#4e4f50]'
                            >
                                <div className='h-10 w-10 overflow-hidden rounded-lg sm:h-20 sm:w-20'>
                                    <img
                                        src={
                                            friend.avatar
                                                ? `${envConfig.imageUrlPrefix}/${friend.avatar}`
                                                : images.avatar
                                        }
                                        alt='avatar'
                                        className='h-full w-full object-cover'
                                    />
                                </div>

                                <span className='ml-4 text-sm font-medium transition-all dark:text-[#e4e6eb]'>
                                    {friend.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className='mt-2 text-center transition-all dark:text-[#e4e6eb]'>Không có bạn bè nào</p>
                )
            ) : (
                <Loading className='mt-2 w-full' />
            )}
        </div>
    )
}

export default ProfileFriendList
