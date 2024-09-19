import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import { $getRoot, $insertNodes, EditorState, LexicalEditor } from 'lexical'
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html'
import { HashtagNode } from '@lexical/hashtag'

import { LEXICAL_POST_EDITOR_DEFAULT_CONTENT } from '~/constants/interfaceData'
import { EnterKeyPlugin, PasteKeyPlugin, PostEditorRefPlugin } from '~/plugins/lexical'

type PostEditorProps = {
    placeholder?: string
    initialContent?: string
    onChange: (html: string) => void
}

export type PostEditorRef = {
    getAllHashtags: () => string[]
    focus: () => void
    setContent: (content: string) => void
    reset: () => void
}

function PostEditor(
    {
        placeholder = 'Nhập nội dung bài viết...',
        initialContent = LEXICAL_POST_EDITOR_DEFAULT_CONTENT,
        onChange
    }: PostEditorProps,
    ref: React.ForwardedRef<PostEditorRef>
) {
    const handleSetContent = useCallback((editor: LexicalEditor, content: string) => {
        if (content) {
            const parser = new DOMParser()
            const dom = parser.parseFromString(content, 'text/html')
            const nodes = $generateNodesFromDOM(editor, dom)

            $getRoot().clear().select()
            $insertNodes(nodes)
        }
    }, [])

    const initialConfig: InitialConfigType = {
        namespace: 'Post Editor',
        theme: {
            paragraph: 'post-editor-paragraph',
            hashtag: 'post-editor-hashtag'
        },
        nodes: [HashtagNode],
        editorState: (editor) => handleSetContent(editor, initialContent),
        onError: (error: Error) => console.error(error)
    }

    const [postEditorRef, setPostEditorRef] = useState<PostEditorRef | null>(null)

    useImperativeHandle(ref, () => postEditorRef as PostEditorRef, [postEditorRef])

    const filterHtmlStr = (htmlStr: string) => {
        return (
            htmlStr
                // Replace 3 or more consecutive <br> tags with 2 <br> tags
                .replace(/(\s*<br\s*\/?>\s*){3,}/g, '<br><br>')
                // Remove <br> tags at the beginning and the end of <p> tags
                .replace(/<p([^>]*)>\s*(<br\s*\/?>\s*)+/g, '<p$1>')
                .replace(/(<br\s*\/?>\s*)+\s*<\/p>/g, '</p>')
                // Remove <span> tags attributes except class
                .replace(/<span((?!class)[^>]*)>/g, (match) => {
                    const classAttr = match.match(/class\s*=\s*["'][^"']*["']/)
                    return `<span${classAttr ? ` ${classAttr[0]}` : ''}>`
                })
        )
    }

    const handleChange = (editorState: EditorState, editor: LexicalEditor) => {
        editorState.read(() => {
            const root = $getRoot()
            const html = filterHtmlStr(root.getTextContent().trim() && $generateHtmlFromNodes(editor))

            onChange(html)
        })
    }

    return (
        <div className='relative'>
            <LexicalComposer initialConfig={initialConfig}>
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable
                            spellCheck={false}
                            className='min-h-[160px] w-full p-2 text-lg text-[#333] outline-none transition-all dark:text-[#e4e6eb] sm:text-xl'
                        />
                    }
                    placeholder={
                        <div className='pointer-events-none absolute inset-x-0 top-0 line-clamp-1 select-none px-2 pt-2 text-lg text-[#a0a0a1] sm:text-xl'>
                            {placeholder}
                        </div>
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <AutoFocusPlugin />
                <OnChangePlugin onChange={handleChange} />
                <HistoryPlugin />
                <HashtagPlugin />
                <EnterKeyPlugin />
                <PasteKeyPlugin />
                <PostEditorRefPlugin setPostEditorRef={setPostEditorRef} handleSetContent={handleSetContent} />
            </LexicalComposer>
        </div>
    )
}

export default forwardRef(PostEditor)
