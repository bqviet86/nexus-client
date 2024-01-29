import { memo } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import parse, { DOMNode, Element as ParserElement, HTMLReactParserOptions, domToReact } from 'html-react-parser'

import { readNotification } from '~/apis/notifications.apis'
import images from '~/assets/images'
import { routes } from '~/config'
import { NotificationType } from '~/constants/enums'
import { NOTIFICATION_ITEMS, NotificationItemType } from '~/constants/interfaceData'
import { Notification } from '~/types/notifications.types'
import { User } from '~/types/users.types'
import { Post } from '~/types/posts.types'
import { formatTime } from '~/utils/handle'

type NotificationItemProps = {
    notification: Notification
    onClick?: () => void
}

function NotificationItem({ notification, onClick }: NotificationItemProps) {
    const { user_from, user_to, type, action, payload, is_read, created_at } = notification
    const avatarSuffix = user_from?.avatar ?? user_to.avatar
    const avatar = avatarSuffix ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${avatarSuffix}` : images.avatar
    const { title, icon, color } = NOTIFICATION_ITEMS[type][action] as NotificationItemType

    const parseOptions: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (domNode instanceof ParserElement) {
                const { name, attribs, children } = domNode

                if (name === 'br') {
                    return <> </>
                }

                if (name === 'strong') {
                    return domToReact(children as DOMNode[], parseOptions)
                }

                if (attribs.class === 'hashtag' || 'text') {
                    return <>{domToReact(children as DOMNode[], parseOptions)}</>
                }
            }
        }
    }

    const { mutate: mutateReadNotification } = useMutation({
        mutationFn: (notification_id: string) => readNotification(notification_id)
    })

    const handleClickNotification = () => {
        if (!is_read) {
            mutateReadNotification(notification._id)
        }

        onClick && onClick()
    }

    return (
        <Link
            to={
                type === NotificationType.Post
                    ? routes.postDetail.replace(':post_id', (payload.post as Post)._id)
                    : routes.profile.replace(':profile_id', (user_from as User)._id)
            }
            className='flex rounded-lg p-2 transition-all hover:bg-[#f2f2f2] dark:hover:bg-[#3a3b3c]'
            onClick={handleClickNotification}
        >
            <div className='relative h-[56px] w-[56px] flex-shrink-0 rounded-full'>
                <img src={avatar} alt='avatar' className='h-full w-full rounded-full object-cover' />
                <div
                    className='absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full'
                    style={{ backgroundColor: color }}
                >
                    {icon}
                </div>
            </div>

            <div className='mx-3 flex flex-col'>
                <span className='line-clamp-3 text-sm transition-all dark:text-[#e4e6eb]'>
                    {parse(
                        `${title.replace('{{user_from}}', `<strong>${user_from?.name || ''}</strong>`)}${
                            type === NotificationType.Post ? `: ${(payload.post as Post).content}` : ''
                        }`,
                        parseOptions
                    )}
                </span>
                <span className='text-xs text-[#0866ff]'>{formatTime(created_at)}</span>
            </div>

            <div className='m-auto flex-shrink-0'>
                <div className={`h-3 w-3 rounded-full ${is_read ? 'bg-transparent' : 'bg-[#0866ff]'}`} />
            </div>
        </Link>
    )
}

export default memo(NotificationItem)
