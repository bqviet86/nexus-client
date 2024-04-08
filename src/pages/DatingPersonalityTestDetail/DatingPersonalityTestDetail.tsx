import { Fragment, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ConfigProvider, Radio } from 'antd'
import { shuffle } from 'lodash'
import { nanoid } from 'nanoid'

import Button from '~/components/Button'
import Loading from '~/components/Loading'
import { UpdateAnswerMBTITestRequest, completeMBTITest, getMBTITest, updateAnswerMBTITest } from '~/apis/mbtiTests.apis'
import { routes } from '~/config'
import { MBTITestStatus, MBTIType, MBTIValue } from '~/constants/enums'
import { MBTI_TYPES } from '~/constants/interfaceData'
import DatingHeader from '~/layouts/components/DatingHeader'
import { MBTITest } from '~/types/mbtiTests.types'
import { MBTIOption } from '~/types/mbtiQuestions.types'

const TOTAL_QUESTIONS = 36

function DatingPersonalityTestDetail() {
    const { test_id } = useParams()
    const navigate = useNavigate()

    const [mbtiTest, setMbtiTest] = useState<MBTITest | null>(null)
    const [currentQuestion, setCurrentQuestion] = useState<number | null>(0)
    const [value, setValue] = useState<MBTIValue | ''>('')
    const [isFetchingUpdateAnswer, setIsFetchingUpdateAnswer] = useState<boolean>(false)

    const testOptionsRef = useRef<MBTIOption[]>([])

    useQuery({
        queryKey: ['mbti-test', test_id as string],
        queryFn: async () => {
            const response = await getMBTITest(test_id as string)
            const result = response.data.result as MBTITest

            setMbtiTest(result)
            setCurrentQuestion(result.current_question)

            if (result.current_question) {
                testOptionsRef.current = shuffle(result.answers[result.current_question - 1].question.options)
            }

            return result
        }
    })

    const { mutateAsync: mutateUpdateAnswerMBTITest } = useMutation({
        mutationFn: (payload: UpdateAnswerMBTITestRequest) => updateAnswerMBTITest(payload)
    })

    const handleChooseAnswer = async ({ question_id, answer }: { question_id: string; answer: MBTIValue }) => {
        setValue(answer)
        setIsFetchingUpdateAnswer(true)

        await mutateUpdateAnswerMBTITest({
            mbti_test_id: (mbtiTest as MBTITest)._id,
            question_id,
            answer
        })

        const nextQuestion = (currentQuestion as number) + 1

        setTimeout(() => {
            if (nextQuestion <= TOTAL_QUESTIONS) {
                testOptionsRef.current = shuffle((mbtiTest as MBTITest).answers[nextQuestion - 1].question.options)
            }

            setCurrentQuestion(nextQuestion)
            setValue('')
            setIsFetchingUpdateAnswer(false)
        }, 500)
    }

    const { mutate: mutateCompleteMBTITest } = useMutation({
        mutationFn: (mbti_test_id: string) => completeMBTITest(mbti_test_id)
    })

    const handleCompleteMBTITest = () => {
        mutateCompleteMBTITest((mbtiTest as MBTITest)._id, {
            onSuccess: () => navigate(routes.datingPersonalityTest)
        })
    }

    return mbtiTest && currentQuestion !== 0 ? (
        mbtiTest.status === MBTITestStatus.Completed ? (
            // Show result
            <>
                <DatingHeader backBtn />

                <div className='-mx-4 mt-10 h-[calc(100%-40px)] overflow-y-auto overflow-x-hidden pl-4 pr-2 pt-4 [&::-webkit-scrollbar-track]:!bg-transparent'>
                    <div className='mt-5 flex flex-col gap-2'>
                        <h2 className='text-center text-2xl font-semibold text-teal-500'>Trắc nghiệm tính cách</h2>
                        <p className='text-center text-sm'>
                            Dựa vào kết quả trắc nghiệm, bạn thuộc vào kiểu tính cách{' '}
                            <Link
                                to={MBTI_TYPES[mbtiTest.mbti_type as MBTIType].path}
                                target='_blank'
                                className='text-teal-500'
                            >
                                {MBTI_TYPES[mbtiTest.mbti_type as MBTIType].title} - {mbtiTest.mbti_type}
                            </Link>
                        </p>
                    </div>

                    <div className='mt-5 flex flex-col gap-4'>
                        {mbtiTest.answers.map(({ question, answer }, index) => (
                            <div key={nanoid()} className='rounded-lg bg-[#363336] px-4 py-3'>
                                <div className='font-medium'>{`${index + 1}. ${question.question}`}</div>

                                <div className='mt-3'>
                                    {shuffle(question.options).map(({ option, dimension_value }) => (
                                        <div
                                            key={nanoid()}
                                            className={`flex min-h-9 items-center justify-center rounded-full border border-solid px-4 py-1 text-center [&+&]:mt-3 ${
                                                dimension_value === answer
                                                    ? 'border-teal-500 font-medium text-teal-500'
                                                    : 'border-[#e4e6eb]'
                                            }`}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        ) : (
            <>
                <div className='absolute inset-x-0 top-0 mx-4 my-[26px]'>
                    <div className='box-content h-1 overflow-hidden rounded-full bg-[#e4e6eb]'>
                        <div
                            className='h-full w-0 bg-[#07e1ff] transition-all'
                            style={{
                                width: `${
                                    ((currentQuestion ? currentQuestion - 1 : TOTAL_QUESTIONS) / TOTAL_QUESTIONS) * 100
                                }%`
                            }}
                        />
                    </div>
                    <p className='mt-1 text-center text-[13px] leading-5'>
                        {currentQuestion && currentQuestion <= TOTAL_QUESTIONS && `Câu ${currentQuestion} - `}Đã hoàn
                        thành {currentQuestion ? currentQuestion - 1 : TOTAL_QUESTIONS}/{TOTAL_QUESTIONS} câu
                    </p>
                </div>

                <div className='flex h-full flex-col items-center justify-center gap-4 pt-16'>
                    {currentQuestion !== null && currentQuestion <= TOTAL_QUESTIONS ? (
                        // Show questions
                        <>
                            <h2 className='text-center text-2xl font-semibold text-teal-500'>
                                {mbtiTest.answers[currentQuestion - 1].question.question}
                            </h2>

                            <ConfigProvider
                                theme={{
                                    token: { colorPrimary: '#07e1ff', colorTextBase: '#e4e6eb' },
                                    components: {
                                        Radio: {
                                            colorBgBase: '#2e2b2e',
                                            colorBorder: '#e4e6eb'
                                        }
                                    }
                                }}
                            >
                                <Radio.Group
                                    optionType='button'
                                    size='large'
                                    className='px-4'
                                    value={value}
                                    onChange={(e) =>
                                        handleChooseAnswer({
                                            question_id: mbtiTest.answers[currentQuestion - 1].question._id,
                                            answer: e.target.value
                                        })
                                    }
                                >
                                    {testOptionsRef.current.map(({ option, dimension_value }) => (
                                        <Radio.Button
                                            key={nanoid()}
                                            value={dimension_value}
                                            className='!flex !h-auto !min-h-10 !w-full !items-center !justify-center !rounded-full !border !bg-transparent !py-1 !text-center !leading-6 before:!hidden hover:!border-[#07e1ff] [&+label]:!mt-4'
                                        >
                                            {option}
                                        </Radio.Button>
                                    ))}
                                </Radio.Group>
                            </ConfigProvider>
                        </>
                    ) : (
                        // Show complete button
                        <>
                            <h2 className='text-center text-2xl font-semibold text-teal-500'>
                                Bạn đã hoàn thành toàn bộ câu hỏi trắc nghiệm
                            </h2>

                            <p className='text-center text-sm'>
                                Hãy nhấn vào nút "Hoàn thành" để hệ thống tính toán kết quả và cung cấp cho bạn
                            </p>

                            <Button
                                className='!w-auto !bg-teal-500 hover:!bg-teal-500/80 [&>span]:!text-[#fff]'
                                onClick={handleCompleteMBTITest}
                            >
                                Hoàn thành
                            </Button>
                        </>
                    )}
                </div>

                {isFetchingUpdateAnswer && (
                    <Loading
                        loaderSize={40}
                        loaderClassName='!text-[#07e1ff]'
                        className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'
                    />
                )}
            </>
        )
    ) : (
        <Fragment />
    )
}

export default DatingPersonalityTestDetail
