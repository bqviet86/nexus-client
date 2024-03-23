import { useQuery } from '@tanstack/react-query'

import Modal from '~/components/Modal'
import { getProvinces } from '~/apis/provinces.apis'
import { Province } from '~/types/provinces.types'

type HometownListProps = {
    isOpen: boolean
    onClose: () => void
    onSelectHometown: (hometown: string) => void
}

function HometownList({ isOpen, onClose, onSelectHometown }: HometownListProps) {
    const { data } = useQuery({
        queryKey: ['hometownList'],
        queryFn: async () => {
            const response = await getProvinces()
            return response.data.result as Province[]
        }
    })

    const handleSelectHometown = (hometown: string) => {
        onSelectHometown(hometown)
        onClose()
    }

    return (
        <Modal dating title='Chọn quê quán' open={isOpen} onCancel={onClose} footer={null}>
            <div className='my-2 max-h-[360px] overflow-y-auto [&::-webkit-scrollbar-track]:!bg-transparent'>
                {data &&
                    data.map((province) => (
                        <div
                            key={province._id}
                            className='flex cursor-pointer items-center rounded-md p-2 transition-all hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]'
                            onClick={() => handleSelectHometown(province.province_name)}
                        >
                            <span>{province.province_name}</span>
                        </div>
                    ))}
            </div>
        </Modal>
    )
}

export default HometownList
