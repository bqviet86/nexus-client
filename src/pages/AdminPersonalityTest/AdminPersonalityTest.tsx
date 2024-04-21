import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ConfigProvider, Pagination as AntdPagination, Table } from 'antd'
import { format } from 'date-fns'

import Button from '~/components/Button'
import MBTIQuestionForm from '~/components/MBTIQuestionForm'
import { GetAllMBTIQuestionsReqData, getAllMBTIQuestions } from '~/apis/mbtiQuestions.apis'
import { routes } from '~/config'
import { MBTIDimension } from '~/constants/enums'
import { MBTI_DIMENSIONS } from '~/constants/interfaceData'
import { useQueryParams } from '~/hooks'
import { Pagination } from '~/types/commons.types'
import { MBTIQuestion, MBTIQuestionTableType } from '~/types/mbtiQuestions.types'

const LIMIT = 10

function AdminPersonalityTest() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { page, search_question } = useQueryParams()

    const [mbtiQuestions, setMbtiQuestions] = useState<MBTIQuestionTableType[]>([])
    const [pagination, setPagination] = useState<Pagination>({ page: Number(page) || 1, total_pages: 0 })
    const [searchQuestion, setSearchQuestion] = useState<string>(search_question || '')
    const [mode, setMode] = useState<'create' | 'update' | 'delete'>('create')
    const [currentMbtiQuestion, setCurrentMbtiQuestion] = useState<MBTIQuestion | null>(null)
    const [isOpenForm, setIsOpenForm] = useState<boolean>(false)

    const getAllMBTIQuestionsQueryFn = async ({ question, page, limit }: GetAllMBTIQuestionsReqData) => {
        const response = await getAllMBTIQuestions({ question, page, limit })
        const { result } = response.data

        setMbtiQuestions(
            (result?.mbti_questions as MBTIQuestion[]).map((mbti_question, index) => ({
                key: mbti_question._id,
                index: (page - 1) * LIMIT + index + 1,
                question: mbti_question.question,
                dimension: mbti_question.dimension,
                created_at: format(mbti_question.created_at, 'dd-MM-yyyy'),
                action: mbti_question
            }))
        )
        setPagination({
            page: result?.page as number,
            total_pages: result?.total_pages as number
        })
        navigate(`${routes.adminPersonalityTests}?page=${page}${question ? `&search_question=${question}` : ''}`)

        return response
    }

    const { isFetching } = useQuery({
        queryKey: ['allMBTIQuestions', { page: pagination.page, limit: LIMIT }],
        queryFn: () =>
            getAllMBTIQuestionsQueryFn({
                question: searchQuestion || undefined,
                page: pagination.page,
                limit: LIMIT
            })
    })

    const handleSearchMBTIQuestions = (page: number = 1) => {
        queryClient.fetchQuery({
            queryKey: ['allMBTIQuestions', { page, limit: LIMIT }],
            queryFn: () =>
                getAllMBTIQuestionsQueryFn({
                    question: searchQuestion || undefined,
                    page,
                    limit: LIMIT
                })
        })
    }

    const handleOpenModal = (mode: 'create' | 'update' | 'delete', mbti_question?: MBTIQuestion) => {
        setMode(mode)
        setCurrentMbtiQuestion(mode === 'create' ? null : mbti_question || null)
        setIsOpenForm(true)
    }

    return (
        <>
            <div className='flex w-max rounded-lg bg-white p-4'>
                <form
                    className='flex items-center gap-4'
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSearchMBTIQuestions()
                    }}
                >
                    <input
                        placeholder='Tìm kiếm theo câu hỏi...'
                        spellCheck={false}
                        className='h-10 w-80 rounded-md border border-solid border-[#ddd] px-4 py-2 text-sm transition-all [&:focus]:border-[#3c50e0]'
                        value={searchQuestion}
                        onChange={(e) => setSearchQuestion(e.target.value)}
                    />

                    <Button
                        type='submit'
                        className='!h-9 !w-auto !bg-[#3c50e0] hover:!bg-[#3c50e0]/90 [&>span]:!text-white'
                    >
                        Áp dụng
                    </Button>
                </form>
            </div>

            <div className='mt-4 rounded-lg bg-white p-4'>
                <div className='flex items-center justify-between'>
                    <h4 className='text-lg font-semibold text-black'>Danh sách câu hỏi kiến tạo</h4>

                    <Button
                        icon={
                            <svg
                                className='h-5 w-5 text-[#3c50e0]'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <g>
                                    <path
                                        d='M6 12H12M12 12H18M12 12V18M12 12V6'
                                        stroke='currentColor'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </g>
                            </svg>
                        }
                        className='!h-9 !w-auto !border !border-solid !border-[#3c50e0] !bg-[#3c50e0]/10 hover:!bg-[#3c50e0]/20 [&>span]:!text-[#3c50e0]'
                        onClick={() => handleOpenModal('create')}
                    >
                        Tạo câu hỏi
                    </Button>
                </div>

                <Table
                    dataSource={mbtiQuestions}
                    columns={[
                        {
                            title: 'STT',
                            dataIndex: 'index',
                            key: 'index'
                        },
                        {
                            title: 'Câu hỏi',
                            dataIndex: 'question',
                            key: 'question'
                        },
                        {
                            title: 'Chiều tính cách',
                            dataIndex: 'dimension',
                            key: 'dimension',
                            render: (dimension: MBTIDimension) => (
                                <>
                                    <div className='mx-auto w-max'>{dimension}</div>
                                    <div className='mx-auto w-max'>{MBTI_DIMENSIONS[dimension]}</div>
                                </>
                            )
                        },
                        {
                            title: 'Ngày tạo',
                            dataIndex: 'created_at',
                            key: 'created_at',
                            render: (date: string) => <div className='mx-auto w-max'>{date}</div>
                        },
                        {
                            title: 'Hành động',
                            dataIndex: 'action',
                            key: 'action',
                            render: (mbti_question: MBTIQuestion) => (
                                <div className='flex items-center justify-center'>
                                    <Button
                                        className='!h-8 !w-max !border !border-solid !border-[#3c50e0] !bg-[#3c50e0]/10 !px-3 hover:!bg-[#3c50e0]/20 [&>span]:!text-[13px] [&>span]:!text-[#3c50e0]'
                                        onClick={() => handleOpenModal('update', mbti_question)}
                                    >
                                        Xem / Chỉnh sửa
                                    </Button>

                                    <Button
                                        className='!ml-4 !h-8 !w-max !border !border-solid !border-[#f44336] !bg-[#f44336]/10 !px-3 hover:!bg-[#f44336]/20 [&>span]:!text-[13px] [&>span]:!text-[#f44336]'
                                        onClick={() => handleOpenModal('delete', mbti_question)}
                                    >
                                        Xoá
                                    </Button>
                                </div>
                            )
                        }
                    ]}
                    size='middle'
                    pagination={{ position: ['none'] }}
                    loading={isFetching}
                    className='mt-4 [&_td]:!text-center [&_th]:!bg-[#f7f9fc] [&_th]:!text-center'
                />

                <MBTIQuestionForm
                    limit={LIMIT}
                    mode={mode}
                    isOpenForm={isOpenForm}
                    onCloseForm={() => setIsOpenForm(false)}
                    currentMbtiQuestion={currentMbtiQuestion}
                    mbtiQuestions={mbtiQuestions}
                    setMbtiQuestions={setMbtiQuestions}
                    handleRefreshTable={() => handleSearchMBTIQuestions(pagination.page)}
                />

                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: '#3c50e0',
                            colorBgContainer: '#3c50e01a',
                            colorBgTextHover: '#3c50e01a'
                        }
                    }}
                >
                    <AntdPagination
                        total={pagination.total_pages * LIMIT}
                        pageSize={LIMIT}
                        current={pagination.page}
                        showSizeChanger={false}
                        hideOnSinglePage
                        className='mt-4 flex justify-center'
                        onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                    />
                </ConfigProvider>
            </div>
        </>
    )
}

export default AdminPersonalityTest
