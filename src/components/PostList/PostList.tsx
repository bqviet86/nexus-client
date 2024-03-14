import { useContext, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroll-component'

import Post from '~/components/Post'
import Loading from '~/components/Loading'
import { GetNewsFeedReqQuery, getNewsFeed } from '~/apis/posts.apis'
import { AppContext } from '~/contexts/appContext'
import { Pagination } from '~/types/commons.types'
import { Post as PostType } from '~/types/posts.types'

const LIMIT = 10

function PostList() {
    const queryClient = useQueryClient()

    const { socket } = useContext(AppContext)
    const [posts, setPosts] = useState<PostType[]>([])
    const [pagination, setPagination] = useState<Pagination>({ page: 1, total_pages: 0 })

    const getNewsFeedQueryFn = async (query: GetNewsFeedReqQuery) => {
        const response = await getNewsFeed(query)
        const { result } = response.data

        setPosts((prevPosts) => {
            const newPosts = result?.posts as PostType[]
            return query.page === 1 ? newPosts : [...prevPosts, ...newPosts]
        })
        setPagination({
            page: result?.page as number,
            total_pages: result?.total_pages as number
        })

        return response
    }

    useQuery({
        queryKey: ['newsFeed', { page: pagination.page, limit: LIMIT }],
        queryFn: () => getNewsFeedQueryFn({ page: pagination.page, limit: LIMIT }),
        enabled:
            !!socket &&
            socket.connected &&
            (pagination.page === 1 || pagination.page < pagination.total_pages) &&
            posts.length < pagination.page * LIMIT
    })

    const handleFetchMorePosts = () => {
        const nextPage = pagination.page + 1

        if (nextPage < pagination.total_pages) {
            setPagination((prevPagination) => ({
                ...prevPagination,
                page: nextPage
            }))
        } else {
            queryClient.fetchQuery({
                queryKey: ['newsFeed', { page: nextPage, limit: LIMIT }],
                queryFn: () => getNewsFeedQueryFn({ page: nextPage, limit: LIMIT })
            })
        }
    }

    return (
        <InfiniteScroll
            dataLength={posts.length}
            hasMore={pagination.page < pagination.total_pages}
            loader={<Loading className='my-2 w-full' loaderClassName='dark:!text-[#e4e6eb]' />}
            next={handleFetchMorePosts}
            className='flex flex-col gap-5'
        >
            {posts.map((post) => (
                <Post key={post._id} data={post} />
            ))}
        </InfiniteScroll>
    )
}

export default PostList
