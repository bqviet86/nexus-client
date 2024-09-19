import { useEffect } from 'react'
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_HIGH, KEY_ENTER_COMMAND } from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

function EnterKeyPlugin() {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        return editor.registerCommand(
            KEY_ENTER_COMMAND,
            (event) => {
                event?.preventDefault()

                const selection = $getSelection()

                if ($isRangeSelection(selection)) {
                    editor.update(() => {
                        const range = selection.clone()
                        range.insertRawText('\n')
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

export default EnterKeyPlugin
