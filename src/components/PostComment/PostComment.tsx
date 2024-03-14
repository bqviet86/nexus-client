import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import Comment from '~/components/Comment'
import CommentForm from '~/components/CommentForm'
import CommentLine from '~/components/CommentLine'
import Loading from '~/components/Loading'
import { getCommentsOfPost, getRepliesOfComment } from '~/apis/comments.apis'
import { NotificationPostAction } from '~/constants/enums'
import { useSocket } from '~/hooks'
import { Comment as CommentType, CommentDetail, CommentWithChildrenCount } from '~/types/comments.types'

type PostCommentProps = {
    postId: string
}

function PostComment({ postId }: PostCommentProps) {
    const queryClient = useQueryClient()
    const { instance: socket } = useSocket()

    const [comments, setComments] = useState<CommentDetail[]>([])

    // State to store the parent comment ids that showing its replies
    const [showRepliesParentIds, setShowRepliesParentIds] = useState<string[]>([])

    // State to store the parent comment ids that fetching its replies
    const [isFetchingRepliesParentIds, setIsFetchingRepliesParentIds] = useState<string[]>([])

    // State to store the parent comment ids that showing its input to reply
    const [showReplyInputParentIds, setShowReplyInputParentIds] = useState<string[]>([])

    const replyInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

    const { isFetching: isFetchingComments } = useQuery({
        queryKey: ['comments', { post_id: postId }],
        queryFn: async () => {
            const response = await getCommentsOfPost(postId)
            const result = response.data.result as CommentWithChildrenCount[]

            setComments(result.map((comment) => ({ ...comment, children: [] }) as CommentDetail))

            return response.data.result
        }
    })

    const getChildCommentsQueryFn = async (commentId: string) => {
        setIsFetchingRepliesParentIds((prevIds) => [...prevIds, commentId])

        const response = await getRepliesOfComment(commentId)

        setComments(
            comments.map((comment) =>
                comment._id === commentId ? { ...comment, children: response.data.result as CommentType[] } : comment
            )
        )
        setIsFetchingRepliesParentIds((prevIds) => prevIds.filter((id) => id !== commentId))
        setShowRepliesParentIds((prevIds) => (prevIds.includes(commentId) ? prevIds : [...prevIds, commentId]))

        return response.data.result
    }

    useQuery({
        queryKey: ['childComments', { post_id: postId, comment_id: '' }],
        queryFn: () => getChildCommentsQueryFn(''),
        enabled: false
    })

    const handleShowOrHideReplies = (commentId: string) => {
        if (showRepliesParentIds.includes(commentId)) {
            setShowRepliesParentIds((prevIds) => prevIds.filter((id) => id !== commentId))
        } else {
            queryClient.fetchQuery({
                queryKey: ['childComments', { post_id: postId, comment_id: commentId }],
                queryFn: () => getChildCommentsQueryFn(commentId)
            })
        }
    }

    const handlePrepareReplyComment = (commentId: string) => {
        setShowReplyInputParentIds((prevIds) => (prevIds.includes(commentId) ? prevIds : [...prevIds, commentId]))
        setTimeout(() => replyInputRefs.current[commentId]?.focus())
    }

    useEffect(() => {
        if (socket && socket.connected) {
            const handleCommentPost = ({ comment }: { comment: CommentType }) => {
                if (comment.post_id === postId) {
                    if (comment.parent_id) {
                        setComments((prevComments) =>
                            prevComments.map((prevComment) =>
                                prevComment._id === comment.parent_id
                                    ? {
                                          ...prevComment,
                                          children: [...prevComment.children, comment],
                                          children_count: prevComment.children_count + 1
                                      }
                                    : prevComment
                            )
                        )
                    } else {
                        setComments((prevComments) => [
                            { ...comment, children: [], children_count: 0 },
                            ...prevComments
                        ])
                    }
                }
            }

            socket.on(NotificationPostAction.CommentPost, handleCommentPost)

            return () => {
                socket.off(NotificationPostAction.CommentPost, handleCommentPost)
            }
        }
    }, [socket])

    useEffect(() => {
        if (socket && socket.connected) {
            const handleDeleteComment = ({ comment }: { comment: CommentType }) => {
                if (comment.post_id === postId) {
                    if (comment.parent_id) {
                        setComments((prevComments) =>
                            prevComments.map((prevComment) =>
                                prevComment._id === comment.parent_id
                                    ? {
                                          ...prevComment,
                                          children: prevComment.children.filter((child) => child._id !== comment._id),
                                          children_count: prevComment.children_count - 1
                                      }
                                    : prevComment
                            )
                        )
                    } else {
                        setComments((prevComments) =>
                            prevComments.filter((prevComment) => prevComment._id !== comment._id)
                        )
                    }
                }
            }

            socket.on('delete_comment', handleDeleteComment)

            return () => {
                socket.off('delete_comment', handleDeleteComment)
            }
        }
    }, [socket])

    return (
        <div className='border-t-[1px] border-solid border-[#ced0d4] py-2 transition-all sm:py-3 dark:border-[#3e4042]'>
            {isFetchingComments ? (
                <Loading className='w-full' loaderClassName='!text-[#65676b] dark:!text-[#e4e6eb]' />
            ) : (
                <>
                    {comments.map((comment) => {
                        const isShowReplies = showRepliesParentIds.includes(comment._id)
                        const isFetchingChildComments = isFetchingRepliesParentIds.includes(comment._id)
                        const isShowReplyInput = showReplyInputParentIds.includes(comment._id)
                        const notShowReplyInputText = `Xem thêm ${comment.children_count} phản hồi`
                        const showReplyInputText = 'Ẩn phản hồi'
                        const lineHeight =
                            isShowReplies || isShowReplyInput ? 'h-[calc(100%-40px-36px)]' : 'h-[calc(100%-40px-20px)]'

                        return (
                            <div key={comment._id} className='comment relative [&+.comment]:mt-3'>
                                <Comment
                                    data={comment}
                                    handleClickReplyCommentBtn={() => handlePrepareReplyComment(comment._id)}
                                    setComments={setComments}
                                />

                                {comment.children_count > 0 && (
                                    <CommentLine>
                                        <div
                                            className='mt-1 flex h-5 w-max cursor-pointer items-center text-[#65676b] transition-all hover:underline dark:text-[#b0b3b8]'
                                            onClick={() => handleShowOrHideReplies(comment._id)}
                                        >
                                            <svg
                                                className='h-[22px] w-[22px]'
                                                viewBox='0 0 24.00 24.00'
                                                fill='none'
                                                xmlns='http://www.w3.org/2000/svg'
                                            >
                                                <g>
                                                    <path
                                                        d='M8 7L8 9C8 11.2091 9.79086 13 12 13L17 13'
                                                        stroke='currentColor'
                                                        strokeWidth='1.44'
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                    />
                                                    <path
                                                        d='M14 16L17 13L14 10'
                                                        stroke='currentColor'
                                                        strokeWidth='1.44'
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                    />
                                                </g>
                                            </svg>

                                            <span className='text-[13px] font-medium'>
                                                {isShowReplies && !isFetchingChildComments
                                                    ? showReplyInputText
                                                    : notShowReplyInputText}
                                            </span>

                                            {isFetchingChildComments && (
                                                <Loading
                                                    className='ml-1.5'
                                                    loaderClassName='!text-[#65676b] dark:!text-[#e4e6eb]'
                                                    loaderSize={12}
                                                />
                                            )}
                                        </div>
                                    </CommentLine>
                                )}

                                {isShowReplies &&
                                    !isFetchingChildComments &&
                                    comment.children.map((childComment, index) => (
                                        <Comment
                                            key={childComment._id}
                                            data={childComment}
                                            handleClickReplyCommentBtn={() => handlePrepareReplyComment(comment._id)}
                                            setComments={setComments}
                                            isHasOverlay={!isShowReplyInput && index === comment.children.length - 1}
                                        />
                                    ))}

                                <CommentForm
                                    mode='create'
                                    showInput={isShowReplyInput}
                                    postId={postId}
                                    parentId={comment._id}
                                    replyInputRefs={replyInputRefs}
                                />

                                {(comment.children_count > 0 || isShowReplyInput) && (
                                    <div
                                        className={`absolute left-[17px] top-10 w-[1.6px] bg-[#f0f2f5] transition-all dark:bg-[#3a3b3c] ${lineHeight}`}
                                    />
                                )}
                            </div>
                        )
                    })}

                    <CommentForm mode='create' postId={postId} replyInputRefs={replyInputRefs} />
                </>
            )}
        </div>
    )
}

export default PostComment
