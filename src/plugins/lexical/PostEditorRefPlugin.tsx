import { useEffect } from 'react'
import { $getRoot, LexicalEditor } from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { HashtagNode } from '@lexical/hashtag'

import { PostEditorRef } from '~/components/PostEditor'
import { LEXICAL_POST_EDITOR_DEFAULT_CONTENT } from '~/constants/interfaceData'

type PostEditorRefPluginProps = {
    setPostEditorRef: React.Dispatch<React.SetStateAction<PostEditorRef | null>>
    handleSetContent: (editor: LexicalEditor, content: string) => void
}

function PostEditorRefPlugin({ setPostEditorRef, handleSetContent }: PostEditorRefPluginProps) {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        setPostEditorRef({
            getAllHashtags: () => {
                return editor.read(() => {
                    const nodes = $getRoot().getAllTextNodes()
                    const hashtags = nodes
                        .filter((node) => node instanceof HashtagNode)
                        .map((hashtagNode) => hashtagNode.__text)

                    return hashtags
                })
            },
            focus: () => editor.focus(),
            setContent: (content) => editor.update(() => handleSetContent(editor, content)),
            reset: () => editor.update(() => handleSetContent(editor, LEXICAL_POST_EDITOR_DEFAULT_CONTENT))
        })
    }, [editor])

    return null
}

export default PostEditorRefPlugin
