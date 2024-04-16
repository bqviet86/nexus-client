import { Fragment, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import DatingCallHistoryItem from '~/components/DatingCallHistoryItem'
import { getAllDatingCalls } from '~/apis/datingCalls.apis'
import { DatingCall } from '~/types/datingCalls.types'

function DatingCallHistory() {
    const [callOpened, setCallOpened] = useState<string>('')

    const { data: datingCalls } = useQuery({
        queryKey: ['datingCalls'],
        queryFn: async () => {
            const response = await getAllDatingCalls()
            return response.data.result as DatingCall[]
        }
    })

    return datingCalls ? (
        <>
            <h3 className='mt-2 text-center text-xl font-medium'>Lịch sử cuộc gọi</h3>

            {datingCalls.length ? (
                <div className='mt-4 flex flex-col gap-2'>
                    {datingCalls.map((datingCall) => (
                        <DatingCallHistoryItem
                            key={datingCall._id}
                            datingCall={datingCall}
                            callOpened={callOpened}
                            setCallOpened={setCallOpened}
                        />
                    ))}
                </div>
            ) : (
                <div className='mt-10 text-center text-sm'>Không có cuộc gọi nào</div>
            )}
        </>
    ) : (
        <Fragment />
    )
}

export default DatingCallHistory
