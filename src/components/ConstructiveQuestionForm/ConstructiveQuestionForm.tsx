import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

import Modal from '~/components/Modal'
import Button from '~/components/Button'
import Loading from '~/components/Loading'
import {
    CreateConstructiveQuestionReqData,
    UpdateConstructiveQuestionReqData,
    createConstructiveQuestion,
    deleteConstructiveQuestion,
    updateConstructiveQuestion
} from '~/apis/constructiveQuestions.apis'
import { ConstructiveQuestion, ConstructiveQuestionTableType } from '~/types/constructiveQuestions.types'

type ConstructiveQuestionFormProps = {
    limit: number
    mode: 'create' | 'update' | 'delete'
    isOpenForm: boolean
    onCloseForm: () => void
    currentConstructiveQuestion: ConstructiveQuestion | null
    constructiveQuestions: ConstructiveQuestionTableType[]
    setConstructiveQuestions: React.Dispatch<React.SetStateAction<ConstructiveQuestionTableType[]>>
    handleRefreshTable: () => void
}

const MIN_OPTION_AMOUNT = 2
const MAX_OPTION_AMOUNT = 6

function ConstructiveQuestionForm({
    limit,
    mode,
    isOpenForm,
    onCloseForm,
    currentConstructiveQuestion,
    constructiveQuestions,
    setConstructiveQuestions,
    handleRefreshTable
}: ConstructiveQuestionFormProps) {
    const [question, setQuestion] = useState<string>('')
    const [options, setOptions] = useState<string[]>([])
    const [isDisabledSubmit, setIsDisabledSubmit] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        if (isOpenForm) {
            setQuestion(currentConstructiveQuestion?.question || '')
            setOptions(
                currentConstructiveQuestion?.options ||
                    (mode === 'create' ? Array.from({ length: MIN_OPTION_AMOUNT }, () => '') : [])
            )
        }
    }, [isOpenForm])

    const { mutateAsync: mutateCreateConstructiveQuestion } = useMutation({
        mutationFn: (data: CreateConstructiveQuestionReqData) => createConstructiveQuestion(data),
        onSuccess: (response) => {
            const result = response.data.result as ConstructiveQuestion

            toast.success('Tạo câu hỏi thành công!', { position: 'top-right' })
            if (constructiveQuestions.length < limit) {
                setConstructiveQuestions((prev) => [
                    ...prev,
                    {
                        key: result._id,
                        index: prev[prev.length - 1].index + 1,
                        question: result.question,
                        option_amount: result.options.length,
                        ask_count: result.ask_count,
                        created_at: format(result.created_at, 'dd-MM-yyyy'),
                        action: result
                    }
                ])
            }
        }
    })

    const { mutateAsync: mutateUpdateConstructiveQuestion } = useMutation({
        mutationFn: (data: UpdateConstructiveQuestionReqData) => updateConstructiveQuestion(data),
        onSuccess: (response) => {
            const result = response.data.result as ConstructiveQuestion

            toast.success('Cập nhật câu hỏi thành công!', { position: 'top-right' })
            setConstructiveQuestions((prev) =>
                prev.map((question) => {
                    if (question.key === result._id) {
                        return {
                            ...question,
                            question: result.question,
                            option_amount: result.options.length,
                            ask_count: result.ask_count,
                            action: result
                        }
                    }

                    return question
                })
            )
        }
    })

    const { mutateAsync: mutateDeleteConstructiveQuestion } = useMutation({
        mutationFn: (constructive_question_id: string) => deleteConstructiveQuestion(constructive_question_id),
        onSuccess: () => {
            toast.success('Xoá câu hỏi thành công!', { position: 'top-right' })
            handleRefreshTable()
        }
    })

    useEffect(() => {
        if (['create', 'update'].includes(mode)) {
            setIsDisabledSubmit(!question.length || options.some((option) => !option.length))
        }
    }, [mode, question, options])

    const handleSubmit = async () => {
        setIsLoading(true)

        if (mode === 'create') {
            await mutateCreateConstructiveQuestion({ question, options })
        } else if (mode === 'update') {
            await mutateUpdateConstructiveQuestion({
                constructive_question_id: (currentConstructiveQuestion as ConstructiveQuestion)._id,
                question,
                options
            })
        } else {
            await mutateDeleteConstructiveQuestion((currentConstructiveQuestion as ConstructiveQuestion)._id)
        }

        onCloseForm()
        setIsLoading(false)
    }

    return (
        <Modal
            title={mode === 'create' ? 'Tạo câu hỏi' : mode === 'update' ? 'Cập nhật câu hỏi' : 'Xoá câu hỏi'}
            open={isOpenForm}
            onCancel={onCloseForm}
            {...(mode === 'delete'
                ? {
                      onOk: handleSubmit,
                      okText: 'Xoá',
                      cancelText: 'Huỷ'
                  }
                : {
                      footer: [
                          <Button
                              key={nanoid()}
                              disabled={isDisabledSubmit}
                              className={`!ml-0 !h-9 !w-full [&>span]:!text-white sm:[&>span]:!text-[15px] ${
                                  isDisabledSubmit ? '!bg-[#3982e4]' : '!bg-[#007bff] hover:!bg-[#007bff]/90'
                              }`}
                              onClick={handleSubmit}
                          >
                              {isLoading ? (
                                  <Loading loaderClassName='!text-white' loaderSize={20} />
                              ) : mode === 'create' ? (
                                  'Tạo'
                              ) : (
                                  'Cập nhật'
                              )}
                          </Button>
                      ]
                  })}
        >
            {(mode === 'create' || mode === 'update') && (
                <div className='-mx-2 mt-3 max-h-[400px] overflow-y-auto px-2 [&::-webkit-scrollbar-track]:!bg-transparent'>
                    {mode === 'update' && currentConstructiveQuestion && (
                        <>
                            <div className='flex gap-2 [&+&]:mt-4'>
                                <h5 className='font-semibold'>ID:</h5>
                                <span>{currentConstructiveQuestion._id}</span>
                            </div>

                            <div className='flex gap-2 [&+&]:mt-4'>
                                <h5 className='font-semibold'>Ngày tạo:</h5>
                                <span>{format(currentConstructiveQuestion.created_at, 'dd-MM-yyyy')}</span>
                            </div>
                        </>
                    )}

                    <div className='flex flex-col gap-1 [&+&]:mt-4'>
                        <h5 className='font-semibold'>Câu hỏi:</h5>
                        <input
                            placeholder='Nhập câu hỏi...'
                            spellCheck={false}
                            className='h-10 rounded-md border border-solid border-[#ddd] px-4 py-2 text-sm transition-all [&:focus]:border-[#007bff]'
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <p className='text-xs'>* Câu hỏi không được để trống và không được quá 255 ký tự.</p>
                    </div>

                    {options.map((option, index) => (
                        <div key={index} className='flex flex-col gap-1 [&+&]:mt-4'>
                            <h5 className='font-semibold'>Câu trả lời #{index + 1}:</h5>

                            <div className='flex items-center gap-2'>
                                <input
                                    placeholder='Nhập câu trả lời...'
                                    spellCheck={false}
                                    className='h-10 flex-[1] rounded-md border border-solid border-[#ddd] px-4 py-2 text-sm transition-all [&:focus]:border-[#007bff]'
                                    value={option}
                                    onChange={(e) =>
                                        setOptions((prev) => prev.map((o, i) => (i === index ? e.target.value : o)))
                                    }
                                />

                                {options.length > MIN_OPTION_AMOUNT && (
                                    <Button
                                        className='!h-9 !w-9 !border !border-solid !border-[#f44336] !bg-[#f44336]/10 !px-0 hover:!bg-[#f44336]/20'
                                        onClick={() => setOptions((prev) => prev.filter((_, i) => i !== index))}
                                    >
                                        <svg
                                            className='h-5 w-5 text-[#f44336]'
                                            aria-hidden='true'
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                stroke='currentColor'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z'
                                            />
                                        </svg>
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}

                    {options.length < MAX_OPTION_AMOUNT && (
                        <Button
                            icon={
                                <svg
                                    className='h-5 w-5 text-[#007bff]'
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
                            className='!mt-4 !h-9 !w-auto !border !border-solid !border-[#007bff] !bg-[#007bff]/10 !px-3 hover:!bg-[#007bff]/20 [&>span]:!text-[#007bff]'
                            onClick={() => setOptions((prev) => [...prev, ''])}
                        >
                            Thêm câu trả lời
                        </Button>
                    )}
                </div>
            )}

            {mode === 'delete' && (
                <>
                    <div className='mt-3 text-center text-base'>
                        Bạn có chắc chắn muốn xoá câu hỏi{' '}
                        <span className='font-semibold'>"{currentConstructiveQuestion?.question}"</span> không?
                    </div>
                </>
            )}
        </Modal>
    )
}

export default ConstructiveQuestionForm
