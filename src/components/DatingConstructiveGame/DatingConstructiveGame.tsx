import { useContext, useEffect, useState } from 'react'
import { ConfigProvider, Radio } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { min } from 'lodash'

import Button from '~/components/Button'
import { UpdateAnswerConstructiveResultReqData, updateAnswerConstructiveResult } from '~/apis/constructiveResults.apis'
import images from '~/assets/images'
import { AppContext } from '~/contexts/appContext'
import { ConstructiveResult } from '~/types/constructiveResults.types'
import { DatingProfile, DatingProfileDetail } from '~/types/datingUsers.types'

type DatingConstructiveGameProps = {
    isShowConstructiveGame: boolean
    setIsShowConstructiveGame: React.Dispatch<React.SetStateAction<boolean>>
    isCompletedConstructiveGame: boolean
    myProfile: DatingProfileDetail | null
    userProfile: DatingProfileDetail | null
    constructiveResult: ConstructiveResult | null
    constructiveAnswer: string
    setConstructiveAnswer: React.Dispatch<React.SetStateAction<string>>
}

const CONSTRUCTIVE_QUESTIONS_COUNT = 6

function DatingConstructiveGame({
    isShowConstructiveGame,
    setIsShowConstructiveGame,
    isCompletedConstructiveGame,
    myProfile,
    userProfile,
    constructiveResult,
    constructiveAnswer,
    setConstructiveAnswer
}: DatingConstructiveGameProps) {
    const { datingProfile } = useContext(AppContext)
    const [currentQuestion, setCurrentQuestion] = useState<number>(1)
    const [constructiveQuestionDuration, setConstructiveQuestionDuration] = useState<number>(15)

    const { mutate: mutateUpdateAnswerConstructiveResult } = useMutation({
        mutationFn: (data: UpdateAnswerConstructiveResultReqData) => updateAnswerConstructiveResult(data)
    })

    const handleAnswerConstructiveQuestion = ({
        question_id,
        answer
    }: Omit<UpdateAnswerConstructiveResultReqData, 'constructive_result_id'>) => {
        mutateUpdateAnswerConstructiveResult(
            {
                constructive_result_id: (constructiveResult as ConstructiveResult)._id,
                question_id,
                answer
            },
            {
                onSuccess: () => {
                    const nextQuestion = currentQuestion + 1

                    setConstructiveAnswer(
                        nextQuestion <= CONSTRUCTIVE_QUESTIONS_COUNT
                            ? (constructiveResult as ConstructiveResult).first_user.answers[nextQuestion - 1].question
                                  .options[0]
                            : ''
                    )
                    setCurrentQuestion(nextQuestion)
                    setConstructiveQuestionDuration(15)
                }
            }
        )
    }

    useEffect(() => {
        if (isShowConstructiveGame && currentQuestion <= CONSTRUCTIVE_QUESTIONS_COUNT) {
            const intervalId = setInterval(() => {
                setConstructiveQuestionDuration((prevDuration) => prevDuration - 1)
            }, 1000)

            return () => clearInterval(intervalId)
        }
    }, [isShowConstructiveGame, currentQuestion])

    useEffect(() => {
        if (constructiveResult && constructiveQuestionDuration === 0) {
            handleAnswerConstructiveQuestion({
                question_id: constructiveResult.first_user.answers[currentQuestion - 1].question._id,
                answer: constructiveAnswer
            })
        }
    }, [constructiveQuestionDuration])

    return (
        constructiveResult &&
        isShowConstructiveGame &&
        (isCompletedConstructiveGame ? (
            <div className='relative max-h-[500px] w-[calc(50%-4px)] overflow-y-auto overflow-x-hidden rounded-xl bg-[#242526] p-4 [&::-webkit-scrollbar-track]:!bg-transparent [&::-webkit-scrollbar]:!w-0'>
                <button
                    className='absolute right-4 top-4 text-sm underline'
                    onClick={() => setIsShowConstructiveGame(false)}
                >
                    thu gọn
                </button>

                <h2 className='mx-16 text-center text-lg font-semibold'>
                    Bạn & {(userProfile as DatingProfileDetail).name}
                </h2>

                <div className='relative mt-4 flex justify-center'>
                    <img
                        src={
                            (datingProfile as DatingProfile).avatar
                                ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${(datingProfile as DatingProfile).avatar}`
                                : images.avatar
                        }
                        alt={(datingProfile as DatingProfile).name}
                        className='z-10 h-20 w-20 translate-x-3 rounded-full'
                    />
                    <img
                        src={
                            (userProfile as DatingProfileDetail).avatar
                                ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${
                                      (userProfile as DatingProfileDetail).avatar
                                  }`
                                : images.avatar
                        }
                        alt={(userProfile as DatingProfileDetail).name}
                        className='h-20 w-20 -translate-x-3 rounded-full'
                    />
                    <div className='absolute left-1/2 top-full z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/3 items-center justify-center rounded-full bg-white'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-teal-500 text-sm text-white'>
                            {constructiveResult.compatibility}%
                        </div>
                    </div>
                </div>

                <div className='mt-14'>
                    {constructiveResult.first_user.answers.map(({ question }, index) => {
                        const myProperty = myProfile ? 'first_user' : 'second_user'
                        const userProperty = myProfile ? 'second_user' : 'first_user'
                        const myAnswer = constructiveResult[myProperty].answers[index].answer
                        const userAnswer = constructiveResult[userProperty].answers[index].answer
                        const isMatched = myAnswer === userAnswer

                        return (
                            <div key={question._id} className='rounded-xl bg-[#4c4a4c] p-4 [&+&]:mt-4'>
                                <h2 className='text-center text-base font-semibold'>{question.question}</h2>

                                <div className='mt-4 flex flex-col gap-2'>
                                    <div className='flex items-center'>
                                        <img
                                            src={
                                                (datingProfile as DatingProfile).avatar
                                                    ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${
                                                          (datingProfile as DatingProfile).avatar
                                                      }`
                                                    : images.avatar
                                            }
                                            alt={(datingProfile as DatingProfile).name}
                                            className='z-10 h-7 w-7 rounded-full'
                                        />
                                        {isMatched && (
                                            <img
                                                src={
                                                    (userProfile as DatingProfileDetail).avatar
                                                        ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${
                                                              (userProfile as DatingProfileDetail).avatar
                                                          }`
                                                        : images.avatar
                                                }
                                                alt={(userProfile as DatingProfileDetail).name}
                                                className='h-7 w-7 -translate-x-2 rounded-full'
                                            />
                                        )}
                                        <span className={`text-sm${isMatched ? '' : ' ml-2'}`}>{myAnswer}</span>
                                    </div>

                                    {!isMatched && (
                                        <div className='flex items-center'>
                                            <img
                                                src={
                                                    (userProfile as DatingProfileDetail).avatar
                                                        ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${
                                                              (userProfile as DatingProfileDetail).avatar
                                                          }`
                                                        : images.avatar
                                                }
                                                alt={(userProfile as DatingProfileDetail).name}
                                                className='h-7 w-7 rounded-full'
                                            />
                                            <span className='ml-2 text-sm'>{userAnswer}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        ) : (
            <div className='flex w-[calc(50%-4px)] flex-col gap-5'>
                <h2 className='mt-10 text-center text-2xl font-semibold text-teal-500'>Trò chơi kiến tạo</h2>

                <div className='rounded-lg bg-[#242526] p-4'>
                    <div className='flex justify-between text-sm'>
                        <span> Câu {min([currentQuestion, CONSTRUCTIVE_QUESTIONS_COUNT])}/6</span>
                        {currentQuestion <= CONSTRUCTIVE_QUESTIONS_COUNT && (
                            <span>Bạn còn {constructiveQuestionDuration} giây để trả lời</span>
                        )}
                    </div>

                    <h2 className='mt-4 text-center text-lg font-semibold'>
                        {currentQuestion <= CONSTRUCTIVE_QUESTIONS_COUNT
                            ? constructiveResult.first_user.answers[currentQuestion - 1].question.question
                            : 'Bạn đã hoàn thành tất cả các câu hỏi của trò chơi'}
                    </h2>

                    {currentQuestion <= CONSTRUCTIVE_QUESTIONS_COUNT ? (
                        <>
                            <ConfigProvider
                                theme={{
                                    token: {
                                        colorPrimary: '#07e1ff',
                                        colorTextBase: '#e4e6eb'
                                    }
                                }}
                            >
                                <Radio.Group
                                    size='large'
                                    className='mt-4 flex flex-col gap-3'
                                    value={constructiveAnswer}
                                    options={
                                        constructiveResult.first_user.answers[currentQuestion - 1].question.options
                                    }
                                    onChange={(e) => setConstructiveAnswer(e.target.value)}
                                />
                            </ConfigProvider>

                            <Button
                                className='!mx-auto !mt-4 !h-9 !w-auto !bg-teal-500 hover:!bg-teal-500/80 [&>span]:!text-[#fff]'
                                onClick={() =>
                                    handleAnswerConstructiveQuestion({
                                        question_id:
                                            constructiveResult.first_user.answers[currentQuestion - 1].question._id,
                                        answer: constructiveAnswer
                                    })
                                }
                            >
                                Trả lời
                            </Button>
                        </>
                    ) : (
                        <p className='mt-4 text-center text-sm'>
                            Cùng chờ giây lát để đối phương hoàn thành phần câu hỏi của mình nhé!
                        </p>
                    )}
                </div>
            </div>
        ))
    )
}

export default DatingConstructiveGame
