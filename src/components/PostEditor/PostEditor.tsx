import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'

import { isHashtag } from '~/utils/check'

type PostEditorProps = {
    innerRef: React.RefObject<HTMLElement>
    placeholder: string
    html: string
    setHtml: React.Dispatch<React.SetStateAction<string>>
}

function PostEditor({ innerRef, placeholder, html, setHtml }: PostEditorProps) {
    const renderParagraph = (paragraph: string): string => {
        const words = paragraph.split(' ')
        const result: string[] = []
        let temp = ''

        words.forEach((word, index) => {
            const space = index === 0 ? '' : ' '

            if (!isHashtag(word)) {
                temp += space + word
            } else {
                if (index !== 0) {
                    result.push(`<span class="text">${temp} </span>`)
                }
                result.push(`<span class="hashtag">${word}</span>`)
                temp = ''
            }
        })

        if (temp) {
            result.push(`<span class="text">${temp}</span>`)
        }

        return result.join('')
    }

    const handleChange = (e: ContentEditableEvent) => {
        const value = e.currentTarget.innerText as string

        if (!value || value === '<br>') {
            setHtml('')
            return
        }

        const paragraphs: string[] = value.split('\n')
        const newContent = paragraphs.map((paragraph) => renderParagraph(paragraph)).join('<br>')

        setHtml(newContent)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.code === 'Enter') {
            e.preventDefault()
            document.execCommand('insertHTML', false, '<br><br>')
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault()

        const text = e.clipboardData.getData('text/plain')
        document.execCommand('insertHTML', false, text)
    }

    return (
        <ContentEditable
            innerRef={innerRef}
            tabIndex={0}
            role='textbox'
            aria-multiline
            spellCheck={false}
            data-placeholder={placeholder}
            html={html}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            className={`relative min-h-[160px] w-full cursor-text whitespace-pre-wrap p-2 text-lg text-[#333] transition-all before:absolute before:inset-0 before:p-2 before:text-lg before:text-[#a0a0a1] sm:text-xl sm:before:text-xl dark:text-[#e4e6eb] before:content-[attr(data-placeholder)]${
                html && html !== '<br>' ? ' before:hidden' : ''
            }`}
        />
    )
}

export default PostEditor
