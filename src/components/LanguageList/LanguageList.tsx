import Modal from '~/components/Modal'
import { Language } from '~/constants/enums'
import { stringEnumToArray } from '~/utils/handle'

type LanguageListProps = {
    isOpen: boolean
    onClose: () => void
    onSelectLanguage: (language: Language) => void
}

const languages = stringEnumToArray(Language)

function LanguageList({ isOpen, onClose, onSelectLanguage }: LanguageListProps) {
    const handleSelectLanguage = (language: Language) => {
        onSelectLanguage(language)
        onClose()
    }

    return (
        <Modal dating title='Chọn ngôn ngữ' open={isOpen} onCancel={onClose} footer={null}>
            <div className='my-2 max-h-[360px] overflow-y-auto [&::-webkit-scrollbar-track]:!bg-transparent'>
                {languages.map((language, index) => (
                    <div
                        key={index}
                        className='flex cursor-pointer items-center rounded-md p-2 transition-all hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]'
                        onClick={() => handleSelectLanguage(language as Language)}
                    >
                        <span>{language}</span>
                    </div>
                ))}
            </div>
        </Modal>
    )
}

export default LanguageList
