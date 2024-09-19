import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import parse, { DOMNode, Element, HTMLReactParserOptions, domToReact } from 'html-react-parser'

import { routes } from '~/config'

type PostContentProps = {
    content: string
}

function PostContent({ content }: PostContentProps) {
    const [isShowMoreBtn, setIsShowMoreBtn] = useState<boolean>(true)
    const [isShowTempEl, setIsShowTempEl] = useState<boolean>(true)
    const [wrapperHeight, setWrapperHeight] = useState<string | number>('auto')

    const isClickShowMoreBtn = useRef<boolean>(false)
    const initialContentElRef = useRef<HTMLDivElement>(null)
    const lessContentElRef = useRef<HTMLDivElement>(null)

    const parseOptions: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (domNode instanceof Element) {
                const { name, attribs, children } = domNode

                if (name === 'p' && attribs.class === 'post-editor-paragraph') {
                    const paragraphs: Element[][] = []
                    let temp: Element[] = []

                    ;(children as Element[]).forEach((child, index, childrenNodes) => {
                        if (
                            child.name === 'br' &&
                            (childrenNodes[index - 1].name === 'br' || childrenNodes[index + 1].name === 'br')
                        ) {
                            if (temp.length) {
                                paragraphs.push(temp)
                                temp = []
                            }

                            return
                        }

                        temp.push(child)
                        if (index === childrenNodes.length - 1) paragraphs.push(temp)
                    })

                    return (
                        <>
                            {paragraphs.map((contents, index) => (
                                <p key={index} className='post-paragraph'>
                                    {domToReact(contents, parseOptions)}
                                </p>
                            ))}
                        </>
                    )
                }

                if (name === 'span') {
                    if (attribs.class === 'post-editor-hashtag') {
                        const hashtagName = (domNode.children[0] as any).data as string
                        return (
                            <Link
                                to={routes.hashtag.replace(':hashtag_name', hashtagName.slice(1))}
                                className='post-hashtag'
                            >
                                {hashtagName}
                            </Link>
                        )
                    }

                    return <>{domToReact(domNode.children as DOMNode[])}</>
                }
            }
        }
    }

    const contentParsed = parse(content, parseOptions)

    useEffect(() => {
        setIsShowTempEl(true)
    }, [content])

    useEffect(() => {
        const initialContentEl = initialContentElRef.current
        const lessContentEl = lessContentElRef.current

        if (isShowTempEl && initialContentEl && lessContentEl) {
            const initialHeight = initialContentEl.clientHeight
            const lessHeight = lessContentEl.clientHeight
            const isClickMore = isClickShowMoreBtn.current

            if (!isClickMore) {
                setIsShowMoreBtn(initialHeight > lessHeight)
                setWrapperHeight(lessHeight)
            }

            setIsShowTempEl(false)

            if (initialHeight <= lessHeight) isClickShowMoreBtn.current = false
        }
    }, [isShowTempEl])

    return (
        <>
            {content && (
                <div
                    className={`mt-3 overflow-hidden${isShowMoreBtn ? ' line-clamp-5' : ''}`}
                    style={{ height: wrapperHeight }}
                >
                    {contentParsed}
                </div>
            )}

            {isShowMoreBtn && (
                <span
                    className='cursor-pointer text-sm font-medium text-[#333] transition-all hover:underline dark:text-[#e4e6eb] sm:text-[15px] sm:leading-[1.5]'
                    onClick={() => {
                        isClickShowMoreBtn.current = true
                        setIsShowMoreBtn(false)
                        setWrapperHeight('auto')
                    }}
                >
                    {isShowMoreBtn ? 'Xem thêm' : 'Thu gọn'}
                </span>
            )}

            {isShowTempEl && (
                <div className='relative'>
                    <div
                        ref={initialContentElRef}
                        className='pointer-events-none invisible absolute inset-x-0 top-0 select-none opacity-0'
                    >
                        {contentParsed}
                    </div>

                    <div
                        ref={lessContentElRef}
                        className='pointer-events-none invisible absolute inset-x-0 top-0 line-clamp-5 select-none opacity-0'
                    >
                        {contentParsed}
                    </div>
                </div>
            )}
        </>
    )
}

export default PostContent
