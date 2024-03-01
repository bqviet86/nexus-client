import { useContext, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import Post from '~/components/Post'
import { getNewsFeed } from '~/apis/posts.apis'
import { AppContext } from '~/contexts/appContext'
import { Pagination } from '~/types/commons.types'
import { PostDetail } from '~/types/posts.types'

const LIMIT = 10

function PostList() {
    const { socket } = useContext(AppContext)

    const [posts, setPosts] = useState<PostDetail[]>([])
    const [queryCount, setQueryCount] = useState<number>(0)
    const [pagination, setPagination] = useState<Pagination>({ page: 1, total_pages: 0 })

    useQuery({
        queryKey: ['posts', { page: pagination.page, limit: LIMIT }],
        queryFn: async () => {
            const response = await getNewsFeed({ page: pagination.page, limit: LIMIT })
            const { result } = response.data

            setPosts((prevPosts) => {
                const newPosts = result?.posts as PostDetail[]
                return pagination.page === 1 ? newPosts : [...prevPosts, ...newPosts]
            })
            setQueryCount((prevCount) => prevCount + 1)
            setPagination({
                page: result?.page as number,
                total_pages: result?.total_pages as number
            })

            return response
        },
        enabled: !!socket && socket.connected && queryCount === 0
    })

    return (
        <div className='flex flex-col gap-5'>
            {posts.map((post) => (
                <Post key={post._id} data={post} />
            ))}
        </div>
    )
}

export default PostList
