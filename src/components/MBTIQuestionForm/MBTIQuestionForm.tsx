import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { ConfigProvider, Radio } from 'antd'
import { nanoid } from 'nanoid'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

import Modal from '~/components/Modal'
import Button from '~/components/Button'
import Loading from '~/components/Loading'
import {
    CreateMBTIQuestionReqData,
    UpdateMBTIQuestionReqData,
    createMBTIQuestion,
    deleteMBTIQuestion,
    updateMBTIQuestion
} from '~/apis/mbtiQuestions.apis'
import { MBTIDimension, MBTIValue } from '~/constants/enums'
import { MBTIOption, MBTIQuestion, MBTIQuestionTableType } from '~/types/mbtiQuestions.types'
import { stringEnumToArray } from '~/utils/handle'

type MBTIQuestionFormProps = {
    limit: number
    mode: 'create' | 'update' | 'delete'
    isOpenForm: boolean
    onCloseForm: () => void
    currentMbtiQuestion: MBTIQuestion | null
    mbtiQuestions: MBTIQuestionTableType[]
    setMbtiQuestions: React.Dispatch<React.SetStateAction<MBTIQuestionTableType[]>>
    handleRefreshTable: () => void
}

function MBTIQuestionForm({
    limit,
    mode,
    isOpenForm,
    onCloseForm,
    currentMbtiQuestion,
    mbtiQuestions,
    setMbtiQuestions,
    handleRefreshTable
}: MBTIQuestionFormProps) {
    const [question, setQuestion] = useState<string>('')
    const [dimension, setDimension] = useState<MBTIDimension>(MBTIDimension.EI)
    const [options, setOptions] = useState<MBTIOption[]>([])
    const [isDisabledSubmit, setIsDisabledSubmit] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        if (isOpenForm) {
            setQuestion(currentMbtiQuestion?.question || '')
            setDimension(currentMbtiQuestion?.dimension || MBTIDimension.EI)
            setOptions(
                currentMbtiQuestion?.options ||
                    (mode === 'create'
                        ? (MBTIDimension.EI.split('-') as MBTIValue[]).map((dimension_value) => ({
                              option: '',
                              dimension_value
                          }))
                        : [])
            )
        }
    }, [isOpenForm])

    useEffect(() => {
        if (['create', 'update'].includes(mode)) {
            setIsDisabledSubmit(!question.length || options.some(({ option }) => !option.length))
        }
    }, [mode, question, options])

    const { mutateAsync: mutateCreateMBTIQuestion } = useMutation({
        mutationFn: (data: CreateMBTIQuestionReqData) => createMBTIQuestion(data),
        onSuccess: (response) => {
            const result = response.data.result as MBTIQuestion

            toast.success('Tạo câu hỏi thành công!', { position: 'top-right' })
            if (mbtiQuestions.length < limit) {
                setMbtiQuestions((prev) => [
                    ...prev,
                    {
                        key: result._id,
                        index: prev[prev.length - 1].index + 1,
                        question: result.question,
                        dimension: result.dimension,
                        created_at: format(result.created_at, 'dd-MM-yyyy'),
                        action: result
                    }
                ])
            }
        }
    })

    const { mutateAsync: mutateUpdateMBTIQuestion } = useMutation({
        mutationFn: (data: UpdateMBTIQuestionReqData) => updateMBTIQuestion(data),
        onSuccess: (response) => {
            const result = response.data.result as MBTIQuestion

            toast.success('Cập nhật câu hỏi thành công!', { position: 'top-right' })
            setMbtiQuestions((prev) =>
                prev.map((question) => {
                    if (question.key === result._id) {
                        return {
                            ...question,
                            question: result.question,
                            dimension: result.dimension,
                            action: result
                        }
                    }

                    return question
                })
            )
        }
    })

    const { mutateAsync: mutateDeleteMBTIQuestion } = useMutation({
        mutationFn: (mbti_question_id: string) => deleteMBTIQuestion(mbti_question_id),
        onSuccess: () => {
            toast.success('Xoá câu hỏi thành công!', { position: 'top-right' })
            handleRefreshTable()
        }
    })

    const handleSubmit = async () => {
        setIsLoading(true)

        if (mode === 'create') {
            await mutateCreateMBTIQuestion({ question, dimension, options })
        } else if (mode === 'update') {
            await mutateUpdateMBTIQuestion({
                mbti_question_id: (currentMbtiQuestion as MBTIQuestion)._id,
                question,
                dimension,
                options
            })
        } else {
            await mutateDeleteMBTIQuestion((currentMbtiQuestion as MBTIQuestion)._id)
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
                    {mode === 'update' && currentMbtiQuestion && (
                        <>
                            <div className='flex gap-2 [&+&]:mt-4'>
                                <h5 className='font-semibold'>ID:</h5>
                                <span>{currentMbtiQuestion._id}</span>
                            </div>

                            <div className='flex gap-2 [&+&]:mt-4'>
                                <h5 className='font-semibold'>Ngày tạo:</h5>
                                <span>{format(currentMbtiQuestion.created_at, 'dd-MM-yyyy')}</span>
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

                    <div className='flex flex-col gap-1 [&+&]:mt-4'>
                        <h5 className='font-semibold'>Chiều tính cách:</h5>

                        <ConfigProvider theme={{ token: { colorPrimary: '#3c50e0' } }}>
                            <Radio.Group
                                value={dimension}
                                onChange={(e) => {
                                    setDimension(e.target.value)
                                    setOptions((prev) =>
                                        prev.map((o, i) => ({ ...o, dimension_value: e.target.value.split('-')[i] }))
                                    )
                                }}
                            >
                                {stringEnumToArray(MBTIDimension).map((d) => (
                                    <Radio key={d} value={d}>
                                        {d}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </ConfigProvider>
                    </div>

                    {options.map(({ option, dimension_value }, index) => (
                        <div key={index} className='flex flex-col gap-1 [&+&]:mt-4'>
                            <h5 className='font-semibold'>Câu trả lời #{index + 1}:</h5>

                            <div className='flex items-center gap-2'>
                                <Button className='!h-9 !w-9 !border !border-solid !border-[#007bff] !bg-[#007bff]/10 !px-0 hover:!bg-[#007bff]/20 [&>span]:!text-[#007bff]'>
                                    {dimension_value}
                                </Button>

                                <input
                                    placeholder='Nhập câu trả lời...'
                                    spellCheck={false}
                                    className='h-10 flex-[1] rounded-md border border-solid border-[#ddd] px-4 py-2 text-sm transition-all [&:focus]:border-[#007bff]'
                                    value={option}
                                    onChange={(e) =>
                                        setOptions((prev) =>
                                            prev.map((o, i) => (i === index ? { ...o, option: e.target.value } : o))
                                        )
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {mode === 'delete' && (
                <div className='mt-3 text-center text-base'>
                    Bạn có chắc chắn muốn xoá câu hỏi{' '}
                    <span className='font-semibold'>"{currentMbtiQuestion?.question}"</span> không?
                </div>
            )}
        </Modal>
    )
}

export default MBTIQuestionForm
