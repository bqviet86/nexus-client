import { useContext, useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroll-component'
import { AxiosResponse } from 'axios'
import { flatMap } from 'lodash'

import Post from '~/components/Post'
import Loading from '~/components/Loading'
import { GetNewsFeedReqQuery, getNewsFeed } from '~/apis/posts.apis'
import { AppContext } from '~/contexts/appContext'
import { Pagination } from '~/types/commons.types'
import { GetNewsFeedResponse, Post as PostType } from '~/types/posts.types'
import { PaginationResponse } from '~/types/response.types'

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
        gcTime: Infinity,
        enabled:
            !!socket &&
            socket.connected &&
            (pagination.page === 1 || pagination.page < pagination.total_pages) &&
            posts.length < pagination.page * LIMIT &&
            queryClient.getQueryData(['newsFeed', { page: pagination.page, limit: LIMIT }]) === undefined
    })

    useEffect(() => {
        const dataCaches = queryClient
            .getQueriesData({
                queryKey: ['newsFeed']
            })
            .filter(([_, dataCache]) => dataCache !== undefined)
            .map(
                ([_, dataCache]) =>
                    (dataCache as AxiosResponse<GetNewsFeedResponse, any>).data.result as PaginationResponse<{
                        posts: PostType[]
                    }>
            )

        if (dataCaches.length) {
            const posts = flatMap(dataCaches, (dataCache) => dataCache.posts)

            setPosts(posts)
            setPagination({
                page: dataCaches[dataCaches.length - 1].page,
                total_pages: dataCaches[dataCaches.length - 1].total_pages
            })
        }
    }, [])

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
