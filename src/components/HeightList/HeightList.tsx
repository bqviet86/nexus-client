import Modal from '~/components/Modal'

type HeightListProps = {
    isOpen: boolean
    onClose: () => void
    onSelectHeight: (height: number) => void
}

const MAX_HEIGHT = 220
const MIN_HEIGHT = 140

function HeightList({ isOpen, onClose, onSelectHeight }: HeightListProps) {
    const handleSelectHeight = (height: number) => {
        onSelectHeight(height)
        onClose()
    }

    return (
        <Modal dating title='Chọn chiều cao' open={isOpen} onCancel={onClose} footer={null}>
            <div className='my-2 max-h-[360px] overflow-y-auto [&::-webkit-scrollbar-track]:!bg-transparent'>
                {Array.from({ length: MAX_HEIGHT - MIN_HEIGHT + 1 }, (_, index) => (
                    <div
                        key={index}
                        className='flex cursor-pointer items-center rounded-md p-2 transition-all hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]'
                        onClick={() => handleSelectHeight(index + MIN_HEIGHT)}
                    >
                        <span>{index + MIN_HEIGHT} cm</span>
                    </div>
                ))}
            </div>
        </Modal>
    )
}

export default HeightList
