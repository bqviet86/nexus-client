import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ConfigProvider, Pagination as AntdPagination, Table } from 'antd'
import { format } from 'date-fns'

import Button from '~/components/Button'
import ConstructiveQuestionForm from '~/components/ConstructiveQuestionForm'
import { GetAllConstructiveQuestionsReqData, getAllConstructiveQuestions } from '~/apis/constructiveQuestions.apis'
import { routes } from '~/config'
import { useQueryParams } from '~/hooks'
import { Pagination } from '~/types/commons.types'
import { ConstructiveQuestion, ConstructiveQuestionTableType } from '~/types/constructiveQuestions.types'

const LIMIT = 10

function AdminConstructiveTest() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { page, search_question } = useQueryParams()

    const [constructiveQuestions, setConstructiveQuestions] = useState<ConstructiveQuestionTableType[]>([])
    const [pagination, setPagination] = useState<Pagination>({ page: Number(page) || 1, total_pages: 0 })
    const [searchQuestion, setSearchQuestion] = useState<string>(search_question || '')
    const [mode, setMode] = useState<'create' | 'update' | 'delete'>('create')
    const [currentConstructiveQuestion, setCurrentConstructiveQuestion] = useState<ConstructiveQuestion | null>(null)
    const [isOpenForm, setIsOpenForm] = useState<boolean>(false)

    const getAllConstructiveQuestionsQueryFn = async ({
        question,
        page,
        limit
    }: GetAllConstructiveQuestionsReqData) => {
        const response = await getAllConstructiveQuestions({ question, page, limit })
        const { result } = response.data

        setConstructiveQuestions(
            (result?.constructive_questions as ConstructiveQuestion[]).map((constructive_question, index) => ({
                key: constructive_question._id,
                index: (page - 1) * LIMIT + index + 1,
                question: constructive_question.question,
                option_amount: constructive_question.options.length,
                ask_count: constructive_question.ask_count,
                created_at: format(constructive_question.created_at, 'dd-MM-yyyy'),
                action: constructive_question
            }))
        )
        setPagination({
            page: result?.page as number,
            total_pages: result?.total_pages as number
        })
        navigate(`${routes.adminConstructiveTests}?page=${page}${question ? `&search_question=${question}` : ''}`)

        return response
    }

    const { isFetching } = useQuery({
        queryKey: ['allConstructiveQuestions', { page: pagination.page, limit: LIMIT }],
        queryFn: () =>
            getAllConstructiveQuestionsQueryFn({
                question: searchQuestion || undefined,
                page: pagination.page,
                limit: LIMIT
            })
    })

    const handleSearchConstructiveQuestions = (page: number = 1) => {
        queryClient.fetchQuery({
            queryKey: ['allConstructiveQuestions', { page, limit: LIMIT }],
            queryFn: () =>
                getAllConstructiveQuestionsQueryFn({
                    question: searchQuestion || undefined,
                    page,
                    limit: LIMIT
                })
        })
    }

    const handleOpenModal = (mode: 'create' | 'update' | 'delete', constructive_question?: ConstructiveQuestion) => {
        setMode(mode)
        setCurrentConstructiveQuestion(mode === 'create' ? null : constructive_question || null)
        setIsOpenForm(true)
    }

    return (
        <>
            <div className='flex w-max rounded-lg bg-white p-4'>
                <form
                    className='flex items-center gap-4'
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSearchConstructiveQuestions()
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
                    dataSource={constructiveQuestions}
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
                            title: 'Số câu trả lời',
                            dataIndex: 'option_amount',
                            key: 'option_amount'
                        },
                        {
                            title: 'Lượt hỏi',
                            dataIndex: 'ask_count',
                            key: 'ask_count'
                        },
                        {
                            title: 'Ngày tạo',
                            dataIndex: 'created_at',
                            key: 'created_at',
                            render: (date: string) => <div className='inline-block w-max'>{date}</div>
                        },
                        {
                            title: 'Hành động',
                            dataIndex: 'action',
                            key: 'action',
                            render: (constructive_question: ConstructiveQuestion) => (
                                <div className='flex items-center justify-center'>
                                    <Button
                                        className='!h-8 !w-max !border !border-solid !border-[#3c50e0] !bg-[#3c50e0]/10 !px-3 hover:!bg-[#3c50e0]/20 [&>span]:!text-[13px] [&>span]:!text-[#3c50e0]'
                                        onClick={() => handleOpenModal('update', constructive_question)}
                                    >
                                        Xem / Chỉnh sửa
                                    </Button>

                                    <Button
                                        className='!ml-4 !h-8 !w-max !border !border-solid !border-[#f44336] !bg-[#f44336]/10 !px-3 hover:!bg-[#f44336]/20 [&>span]:!text-[13px] [&>span]:!text-[#f44336]'
                                        onClick={() => handleOpenModal('delete', constructive_question)}
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

                <ConstructiveQuestionForm
                    limit={LIMIT}
                    mode={mode}
                    isOpenForm={isOpenForm}
                    onCloseForm={() => setIsOpenForm(false)}
                    currentConstructiveQuestion={currentConstructiveQuestion}
                    constructiveQuestions={constructiveQuestions}
                    setConstructiveQuestions={setConstructiveQuestions}
                    handleRefreshTable={() => handleSearchConstructiveQuestions(pagination.page)}
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
                        hideOnSinglePage
                        className='mt-4 flex justify-center'
                        onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                    />
                </ConfigProvider>
            </div>
        </>
    )
}

export default AdminConstructiveTest
