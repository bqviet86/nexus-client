import { useContext, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'

import Button from '~/components/Button'
import Loading from '~/components/Loading'
import Modal from '~/components/Modal'
import { createMBTITest, deleteMBTITest, getAllMBTITests } from '~/apis/mbtiTests.apis'
import { routes } from '~/config'
import { MBTIType } from '~/constants/enums'
import { MBTI_TYPES } from '~/constants/interfaceData'
import { AppContext } from '~/contexts/appContext'
import { MBTITest } from '~/types/mbtiTests.types'
import { DatingProfile } from '~/types/datingUsers.types'
import { formatTime } from '~/utils/handle'
import { getDatingProfileFromLS, setDatingProfileToLS } from '~/utils/localStorage'

function DatingPersonalityTest() {
    const navigate = useNavigate()

    const { setDatingProfile } = useContext(AppContext)
    const [mbtiTests, setMBTITests] = useState<MBTITest[]>([])
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
    const [isFetchingPerformNewMBTITest, setIsFetchingPerformNewMBTITest] = useState<boolean>(false)

    const completedMBTITestIndexRef = useRef<number>(-1)
    const timerRef = useRef<string[]>([])

    const { isFetching: isFetchingAllMBTITests } = useQuery({
        queryKey: ['mbti-tests'],
        queryFn: async () => {
            const response = await getAllMBTITests()
            const result = response.data.result as MBTITest[]

            completedMBTITestIndexRef.current = result.findIndex((test) => test.status === 'completed')
            timerRef.current = result.map((test) => formatTime(test.created_at, true))
            setMBTITests(result)

            if (completedMBTITestIndexRef.current !== -1) {
                const datingProfile = getDatingProfileFromLS() as DatingProfile
                const mbtiType = result[completedMBTITestIndexRef.current].mbti_type

                setDatingProfile({ ...datingProfile, mbti_type: mbtiType })
                setDatingProfileToLS({ ...datingProfile, mbti_type: mbtiType })
            }

            return result
        }
    })

    const { mutateAsync: mutateCreateMBTITest } = useMutation({
        mutationFn: createMBTITest
    })

    const handlePerformMBTITest = async () => {
        if (mbtiTests.length && completedMBTITestIndexRef.current !== 0) {
            setIsOpenModal(true)
            return
        }

        const response = await mutateCreateMBTITest()
        navigate(routes.datingPersonalityTestDetail.replace(':test_id', (response.data.result as MBTITest)._id))
    }

    const { mutateAsync: mutateDeleteMBTITest } = useMutation({
        mutationFn: deleteMBTITest
    })

    const handlePerformNewMBTITest = async () => {
        setIsFetchingPerformNewMBTITest(true)

        const [response] = await Promise.all([mutateCreateMBTITest(), mutateDeleteMBTITest(mbtiTests[0]._id)])

        setIsFetchingPerformNewMBTITest(false)
        navigate(routes.datingPersonalityTestDetail.replace(':test_id', (response.data.result as MBTITest)._id))
    }

    return (
        <div className='relative h-full py-2'>
            <div className='mt-5 flex flex-col items-center gap-2'>
                {completedMBTITestIndexRef.current !== -1 && (
                    <div className='text-center text-xl font-medium'>Bạn là kiểu người</div>
                )}

                <h2 className='text-center text-2xl font-semibold text-teal-500'>
                    {completedMBTITestIndexRef.current !== -1
                        ? MBTI_TYPES[mbtiTests[completedMBTITestIndexRef.current].mbti_type as MBTIType].title
                        : 'Trắc nghiệm tính cách'}
                </h2>

                {completedMBTITestIndexRef.current !== -1 && (
                    <p className='text-center text-sm'>{mbtiTests[completedMBTITestIndexRef.current].mbti_type}</p>
                )}

                {completedMBTITestIndexRef.current !== -1 ? (
                    <Link
                        to={MBTI_TYPES[mbtiTests[completedMBTITestIndexRef.current].mbti_type as MBTIType].path}
                        target='_blank'
                        className='text-center text-sm underline'
                    >
                        Đọc thêm về tính cách của bạn
                    </Link>
                ) : (
                    <p className='text-center text-sm'>
                        Hãy giúp chúng tôi hiểu rõ hơn về bạn để giúp bạn tìm kiếm người phù hợp nhất.
                    </p>
                )}
            </div>

            <div
                className={`mt-5 ${
                    completedMBTITestIndexRef.current !== -1 ? 'h-[calc(100%-200px-44px)]' : 'h-[calc(100%-200px)]'
                }`}
            >
                <div className='flex h-6 items-center justify-between'>
                    <span className='text-sm'>Lịch sử khảo sát</span>
                    <span className='text-sm'>Kiểu tính cách</span>
                </div>

                {isFetchingAllMBTITests ? (
                    <Loading className='mt-2 flex h-[calc(100%-32px)] items-center justify-center' loaderSize={32} />
                ) : mbtiTests.length ? (
                    <div className='-mr-2 mt-2 h-[calc(100%-32px)] overflow-y-auto overflow-x-hidden pr-2 [&::-webkit-scrollbar-track]:!bg-transparent'>
                        {mbtiTests.map((test, index) => (
                            <Link
                                key={test._id}
                                to={routes.datingPersonalityTestDetail.replace(':test_id', test._id)}
                                className='flex items-center justify-between rounded-lg bg-[#4c4a4c] p-2 [&+&]:mt-2'
                            >
                                <span className='flex-[1] text-sm'>{timerRef.current[index]}</span>
                                <span className='ml-2 text-end text-sm'>
                                    {test.status === 'completed'
                                        ? `${MBTI_TYPES[test.mbti_type as MBTIType].title} - ${test.mbti_type}`
                                        : `Chưa hoàn thành${
                                              test.current_question
                                                  ? ` (${test.current_question - 1}/${test.answers.length})`
                                                  : ''
                                          }`}
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className='mt-2 flex h-[calc(100%-32px)] items-center justify-center'>
                        <p className='text-sm'>Chưa có dữ liệu</p>
                    </div>
                )}
            </div>

            <div className='absolute bottom-2 my-5 flex w-full justify-center'>
                <Button
                    className='!w-auto !bg-teal-500 hover:!bg-teal-500/80 [&>span]:!text-[#fff]'
                    onClick={handlePerformMBTITest}
                >
                    Thực hiện trắc nghiệm
                </Button>

                <Modal
                    dating
                    open={isOpenModal}
                    title={`Bài kiểm tra gần nhất chưa hoàn thành. Bạn có muốn thực hiện bài kiểm tra mới không?`}
                    closeIcon={null}
                    okText='Thực hiện và xóa bài kiểm tra cũ'
                    cancelText='Hủy'
                    onOk={handlePerformNewMBTITest}
                    onCancel={() => setIsOpenModal(false)}
                    confirmLoading={isFetchingPerformNewMBTITest}
                    className='[&_.ant-modal-footer>button]:!m-0 [&_.ant-modal-footer]:mx-auto [&_.ant-modal-footer]:mb-1 [&_.ant-modal-footer]:flex [&_.ant-modal-footer]:w-max [&_.ant-modal-footer]:flex-col-reverse [&_.ant-modal-footer]:gap-2 [&_.ant-modal-title]:!text-base'
                />
            </div>
        </div>
    )
}

export default DatingPersonalityTest
