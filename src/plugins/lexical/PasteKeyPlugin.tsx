import { useEffect } from 'react'
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_HIGH, PASTE_COMMAND } from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

function PasteKeyPlugin() {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        return editor.registerCommand(
            PASTE_COMMAND,
            (event) => {
                event.preventDefault()

                const selection = $getSelection()

                if (event instanceof ClipboardEvent && $isRangeSelection(selection)) {
                    editor.update(() => {
                        const pasteData = event.clipboardData?.getData('text/plain') || ''
                        const range = selection.clone()

                        range.insertRawText(pasteData)
                    })

                    return true
                }

                return false
            },
            COMMAND_PRIORITY_HIGH
        )
    }, [editor])

    return null
}

export default PasteKeyPlugin
