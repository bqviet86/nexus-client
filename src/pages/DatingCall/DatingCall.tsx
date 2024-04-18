import { Fragment, useContext, useEffect, useRef, useState } from 'react'
import Peer, { Instance as PeerInstance, SignalData } from 'simple-peer'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import global from 'global'
import process from 'process'

import Loading from '~/components/Loading'
import Button from '~/components/Button'
import DatingProfileCard from '~/components/DatingProfileCard'
import DatingConstructiveGame from '~/components/DatingConstructiveGame'
import DatingCallReview from '~/components/DatingCallReview'
import { getDatingCriteria } from '~/apis/datingCriterias.apis'
import { CreateConstructiveResultReqData, createConstructiveResult } from '~/apis/constructiveResults.apis'
import { CreateDatingCallReqData, createDatingCall } from '~/apis/datingCalls.apis'
import { routes } from '~/config'
import { Sex } from '~/constants/enums'
import { AppContext } from '~/contexts/appContext'
import { useSocket } from '~/hooks'
import { DatingProfile, DatingProfileDetail } from '~/types/datingUsers.types'
import { User } from '~/types/users.types'
import { ConstructiveResult } from '~/types/constructiveResults.types'
import { DatingCall as DatingCallType } from '~/types/datingCalls.types'
import { formatDuration } from '~/utils/handle'

global.process = process

function DatingCall() {
    const { instance: socket, emit } = useSocket()

    const { user, datingProfile, stream, setStream } = useContext(AppContext)
    const [callStatus, setCallStatus] = useState<'finding' | 'calling' | 'leaved' | 'ended'>('finding')
    const [callTo, setCallTo] = useState<string>('')
    const [callFrom, setCallFrom] = useState<string>('')
    const [myProfile, setMyProfile] = useState<DatingProfileDetail | null>(null)
    const [userProfile, setUserProfile] = useState<DatingProfileDetail | null>(null)
    const [toSignal, setToSignal] = useState<SignalData | null>(null)
    const [fromSignal, setFromSignal] = useState<SignalData | null>(null)
    const [findingDuration, setFindingDuration] = useState<number>(0)
    const [callingDuration, setCallingDuration] = useState<number>(0)
    const [constructiveResult, setConstructiveResult] = useState<ConstructiveResult | null>(null)
    const [constructiveAnswer, setConstructiveAnswer] = useState<string>('')
    const [isShowConstructiveGame, setIsShowConstructiveGame] = useState<boolean>(false)
    const [isCompletedConstructiveGame, setIsCompletedConstructiveGame] = useState<boolean>(false)
    const [datingCallId, setDatingCallId] = useState<string>('')

    const connectionRef = useRef<PeerInstance | null>(null)
    const findingIntervalId = useRef<NodeJS.Timeout | null>(null)
    const callingIntervalId = useRef<NodeJS.Timeout | null>(null)
    const isRequestConstructiveGame = useRef<boolean>(false)

    const { data: datingCriteria } = useQuery({
        queryKey: ['dating-criteria'],
        queryFn: async () => {
            const response = await getDatingCriteria()
            return response.data.result
        }
    })

    useEffect(() => {
        if (!stream) {
            navigator.mediaDevices
                .getUserMedia({
                    audio: true
                })
                .then((currentStream) => setStream(currentStream))
        } else {
            const myAudioElement = document.getElementById('my_audio') as HTMLAudioElement

            myAudioElement.srcObject = stream
            findingIntervalId.current = setInterval(() => setFindingDuration((prevDuration) => prevDuration + 1), 1000)
        }
    }, [stream])

    const { mutateAsync: mutateCreateConstructiveResult } = useMutation({
        mutationFn: (data: CreateConstructiveResultReqData) => createConstructiveResult(data)
    })

    const { mutateAsync: mutateCreateDatingCall } = useMutation({
        mutationFn: (data: CreateDatingCallReqData) => createDatingCall(data)
    })

    useEffect(() => {
        if (socket && socket.connected) {
            const onCallUserQueueEmpty = () => {
                toast('Hiện không có người nào đang thực hiện cuộc gọi. Cùng chờ thêm chút nữa nhé!', {
                    position: 'bottom-center'
                })
            }

            const onFindCallUser = ({
                my_profile,
                user_profile
            }: {
                my_profile: DatingProfileDetail
                user_profile: DatingProfileDetail
            }) => {
                setCallTo(user_profile.user_id)
                setMyProfile(my_profile)
                setUserProfile(user_profile)
            }

            const onCallTimeout = () => {
                toast.promise(
                    new Promise<void>((resolve) => {
                        setTimeout(() => {
                            resolve()
                            window.location.href = routes.dating
                        }, 3000)
                    }),
                    {
                        loading: 'Đã hết thời gian tìm kiếm. Hãy thử lại sau!',
                        success: 'Bạn đã rời khỏi cuộc gọi.',
                        error: ''
                    },
                    {
                        position: 'bottom-center'
                    }
                )
            }

            const onCallUser = ({
                user_from,
                signalData
            }: {
                user_from: DatingProfileDetail
                signalData: SignalData
            }) => {
                setCallFrom(user_from.user_id)
                setUserProfile(user_from)
                setFromSignal(signalData)
            }

            const onCallAccepted = (signal: SignalData) => {
                setToSignal(signal)
            }

            const onRejectConstructiveGame = () => {
                isRequestConstructiveGame.current = false
                toast('Đối phương đã từ chối tham gia, bạn có thể thử lại sao', {
                    position: 'bottom-center'
                })
            }

            const onAcceptConstructiveGame = (constructive_result: ConstructiveResult) => {
                setConstructiveResult(constructive_result)
                setConstructiveAnswer(constructive_result.first_user.answers[0].question.options[0])
                setIsShowConstructiveGame(true)
            }

            const onCompleteConstructiveGame = (constructive_result: ConstructiveResult) => {
                setConstructiveResult(constructive_result)
                setIsCompletedConstructiveGame(true)
            }

            const onLeaveCall = () => {
                setCallStatus('leaved')
            }

            const onCreateDatingCall = (dating_call: DatingCallType) => {
                setCallingDuration(dating_call.duration)
                setDatingCallId(dating_call._id)
            }

            socket.on('call_user_queue_empty', onCallUserQueueEmpty)
            socket.on('find_call_user', onFindCallUser)
            socket.on('call_timeout', onCallTimeout)
            socket.on('call_user', onCallUser)
            socket.on('call_accepted', onCallAccepted)
            socket.on('reject_constructive_game', onRejectConstructiveGame)
            socket.on('accept_constructive_game', onAcceptConstructiveGame)
            socket.on('complete_constructive_game', onCompleteConstructiveGame)
            socket.on('leave_call', onLeaveCall)
            socket.on('create_dating_call', onCreateDatingCall)

            return () => {
                socket.off('call_user_queue_empty', onCallUserQueueEmpty)
                socket.off('find_call_user', onFindCallUser)
                socket.off('call_timeout', onCallTimeout)
                socket.off('call_user', onCallUser)
                socket.off('call_accepted', onCallAccepted)
                socket.off('reject_constructive_game', onRejectConstructiveGame)
                socket.off('accept_constructive_game', onAcceptConstructiveGame)
                socket.off('complete_constructive_game', onCompleteConstructiveGame)
                socket.off('leave_call', onLeaveCall)
                socket.off('create_dating_call', onCreateDatingCall)
            }
        }
    }, [socket])

    useEffect(() => {
        if (socket && socket.connected) {
            const onRequestConstructiveGame = () => {
                const handleRejectConstructiveGame = (toast_id: string) => {
                    isRequestConstructiveGame.current = false
                    emit('reject_constructive_game', (userProfile as DatingProfileDetail).user_id)
                    toast.dismiss(toast_id)
                }

                const handleAcceptConstructiveGame = async (toast_id: string) => {
                    const response = await mutateCreateConstructiveResult({
                        first_user_id: myProfile ? myProfile._id : (userProfile as DatingProfileDetail)._id,
                        second_user_id: myProfile
                            ? (userProfile as DatingProfileDetail)._id
                            : (datingProfile as DatingProfile)._id
                    })
                    const result = response.data.result as ConstructiveResult

                    emit('accept_constructive_game', {
                        calling_user_id: (userProfile as DatingProfileDetail).user_id,
                        constructive_result: result
                    })
                    setConstructiveResult(result)
                    setConstructiveAnswer(result.first_user.answers[0].question.options[0])
                    setIsShowConstructiveGame(true)
                    toast.dismiss(toast_id)
                }

                isRequestConstructiveGame.current = true
                toast(
                    (toastInstance) => (
                        <div className='flex flex-col'>
                            <h2 className='text-center text-lg font-semibold text-teal-500'>Câu hỏi kiến tạo</h2>
                            <p className='text-center text-sm'>
                                Đối phương muốn cùng bạn tham gia trả lời câu hỏi kiến tạo. Bạn có muốn tham gia?
                            </p>
                            <div className='mt-1 flex gap-1 border-t border-solid border-[#6a6a6a] transition-all'>
                                <button
                                    className='mt-1 h-9 flex-[1] rounded-lg bg-[#51515f]/10 text-[15px] text-teal-500 hover:bg-[#51515f]/20 hover:text-teal-600'
                                    onClick={() => handleRejectConstructiveGame(toastInstance.id)}
                                >
                                    Không tham gia
                                </button>
                                <button
                                    className='mt-1 h-9 flex-[1] rounded-lg bg-[#51515f]/10 text-[15px] font-semibold text-teal-500 transition-all hover:bg-[#51515f]/20 hover:text-teal-600'
                                    onClick={() => handleAcceptConstructiveGame(toastInstance.id)}
                                >
                                    Đồng ý
                                </button>
                            </div>
                        </div>
                    ),
                    {
                        position: 'bottom-center',
                        duration: Infinity
                    }
                )
            }

            const onEndCall = async () => {
                if (myProfile) {
                    const response = await mutateCreateDatingCall({
                        first_user_id: myProfile._id,
                        second_user_id: (userProfile as DatingProfileDetail)._id,
                        ...(constructiveResult ? { constructive_result_id: constructiveResult._id } : {}),
                        duration: callingDuration
                    })

                    emit('create_dating_call', {
                        my_id: myProfile.user_id,
                        user_id: (userProfile as DatingProfileDetail).user_id,
                        dating_call: response.data.result as DatingCallType
                    })
                }
                setCallStatus('ended')
            }

            socket.on('request_constructive_game', onRequestConstructiveGame)
            socket.on('end_call', onEndCall)

            return () => {
                socket.off('request_constructive_game', onRequestConstructiveGame)
                socket.off('end_call', onEndCall)
            }
        }
    }, [socket, myProfile, userProfile, constructiveResult, callingDuration])

    // Call user
    useEffect(() => {
        if (socket && socket.connected && stream) {
            if (callTo) {
                const peer = new Peer({ initiator: true, trickle: false, stream })

                peer.on('signal', (data) => {
                    emit('call_user', { user_from: myProfile, user_to: callTo, signalData: data })
                })

                peer.on('stream', (currentStream) => {
                    const userAudioElement = document.getElementById('user_audio') as HTMLAudioElement

                    userAudioElement.srcObject = currentStream
                    callingIntervalId.current = setInterval(
                        () => setCallingDuration((prevDuration) => prevDuration + 1),
                        1000
                    )
                    setCallStatus('calling')
                })

                connectionRef.current = peer
                setCallTo('')
            }

            if (toSignal) {
                ;(connectionRef.current as PeerInstance).signal(toSignal)
                setToSignal(null)
            }
        }
    }, [socket, stream, callTo, toSignal])

    // Accept call
    useEffect(() => {
        if (socket && socket.connected && stream && callFrom && fromSignal) {
            const peer = new Peer({ initiator: false, trickle: false, stream })

            peer.on('signal', (data) => {
                emit('call_accepted', { user_to: callFrom, signalData: data })
            })

            peer.on('stream', (currentStream) => {
                const userAudioElement = document.getElementById('user_audio') as HTMLAudioElement

                userAudioElement.srcObject = currentStream
                callingIntervalId.current = setInterval(
                    () => setCallingDuration((prevDuration) => prevDuration + 1),
                    1000
                )
                setCallStatus('calling')
            })

            peer.signal(fromSignal)
            connectionRef.current = peer
            setCallFrom('')
            setFromSignal(null)
        }
    }, [socket, stream, callFrom, fromSignal])

    const handleRequestConstructiveGame = () => {
        if (!isRequestConstructiveGame.current) {
            isRequestConstructiveGame.current = true
            emit('request_constructive_game', (userProfile as DatingProfileDetail).user_id)
            toast('Đã gửi yêu cầu, hãy đợi đối phương phản hồi nhé!', {
                position: 'bottom-center'
            })
        }
    }

    useEffect(() => {
        if (callStatus === 'calling') {
            clearInterval(findingIntervalId.current as NodeJS.Timeout)
        }

        if (callStatus === 'leaved') {
            connectionRef.current?.destroy()
            window.location.href = routes.dating
        }

        if (callStatus === 'ended') {
            ;(connectionRef.current as PeerInstance).destroy()
            clearInterval(callingIntervalId.current as NodeJS.Timeout)
        }
    }, [callStatus])

    return stream ? (
        <div className='flex h-full flex-col overflow-hidden py-2'>
            {(callStatus === 'finding' || callStatus === 'calling') && (
                <>
                    <audio id='my_audio' playsInline autoPlay muted />
                    <audio id='user_audio' playsInline autoPlay />

                    <div
                        className={`flex w-[calc(200%+8px)] gap-2 transition-all${
                            isShowConstructiveGame ? ' -translate-x-[calc(50%+4px)]' : ''
                        }`}
                    >
                        <div className='w-[calc(50%-4px)]'>
                            <div className='mx-auto flex w-[300px] max-w-full items-center justify-center rounded-lg bg-[#3a3a44] px-4 py-2 text-center text-sm'>
                                {callStatus === 'calling' && userProfile ? (
                                    `Đang gọi cho ${userProfile.name}`
                                ) : (
                                    <>
                                        <div className='mr-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#3aafa9]' /> Sẳn
                                        sàng | Đang tìm cuộc gọi {formatDuration(findingDuration)}
                                    </>
                                )}
                            </div>

                            <div className='mb-2 mt-4 flex flex-col gap-3'>
                                {datingProfile && <DatingProfileCard datingProfile={datingProfile} mode='dark' />}

                                <p
                                    className='cursor-pointer rounded-lg bg-[#3a3a44] px-4 py-2 text-center text-sm'
                                    {...(callStatus === 'calling'
                                        ? {
                                              onClick: constructiveResult
                                                  ? () => setIsShowConstructiveGame(true)
                                                  : handleRequestConstructiveGame
                                          }
                                        : {})}
                                >
                                    {callStatus === 'finding'
                                        ? 'Hãy chờ hệ thống kết nối bạn với người phù hợp. Đừng quên kiểm tra kết nối mạng và bật loa nhé!'
                                        : constructiveResult?.compatibility
                                          ? `Bạn và đối phương hợp nhau đến ${constructiveResult.compatibility}%. Nhấp để xem lại toàn bộ câu trả lời`
                                          : 'Bạn không biết nói gì? Hãy bắt đầu ngay trò chơi kiến tạo tại đây!'}
                                </p>

                                {callStatus === 'calling' && userProfile ? (
                                    <DatingProfileCard datingProfile={userProfile} mode='dark' />
                                ) : (
                                    <Loading className='flex h-10 items-center justify-center' />
                                )}
                            </div>
                        </div>

                        <DatingConstructiveGame
                            isShowConstructiveGame={isShowConstructiveGame}
                            setIsShowConstructiveGame={setIsShowConstructiveGame}
                            isCompletedConstructiveGame={isCompletedConstructiveGame}
                            myProfile={myProfile}
                            userProfile={userProfile}
                            constructiveResult={constructiveResult}
                            constructiveAnswer={constructiveAnswer}
                            setConstructiveAnswer={setConstructiveAnswer}
                        />
                    </div>

                    {callStatus === 'finding' && datingCriteria && (
                        <div className='relative mt-2 text-sm before:absolute before:bottom-[calc(100%+8px)] before:left-1/2 before:h-px before:w-3/4 before:-translate-x-1/2 before:bg-[#5a5a5a] before:content-[""] [&>div+div]:mt-2'>
                            <h2 className='mb-2 text-center text-base font-semibold'>Tiêu chí tìm kiếm</h2>

                            <div className='flex gap-2'>
                                <p className='flex-[1]'>
                                    Giới tính:{' '}
                                    <span className='font-medium'>
                                        {datingCriteria.sex === Sex.Male ? 'Nam' : 'Nữ'}
                                    </span>
                                </p>
                                <p className='flex-[1]'>
                                    Ngôn ngữ: <span className='font-medium'>{datingCriteria.language}</span>
                                </p>
                            </div>

                            <div className='flex gap-2'>
                                <p className='flex-[1]'>
                                    Độ tuổi:{' '}
                                    <span className='font-medium'>
                                        {datingCriteria.age_range[0]} - {datingCriteria.age_range[1]} tuổi
                                    </span>
                                </p>
                                <p className='flex-[1]'>
                                    Chiều cao:{' '}
                                    <span className='font-medium'>
                                        {datingCriteria.height_range[0]} - {datingCriteria.height_range[1]} cm
                                    </span>
                                </p>
                            </div>

                            <div className='flex gap-2'>
                                <p className='flex-[1]'>
                                    Quê quán: <span className='font-medium'>{datingCriteria.hometown}</span>
                                </p>
                            </div>
                        </div>
                    )}

                    <div className='mt-2 flex flex-[1] flex-col items-center justify-center gap-2'>
                        {callStatus === 'calling' && (
                            <div className='text-center text-2xl font-semibold leading-6'>
                                {formatDuration(callingDuration)}
                            </div>
                        )}

                        <Button
                            className='!h-12 !w-12 !rounded-full !bg-red-500 !p-0 hover:!bg-red-500/80 [&>span]:!text-[#fff]'
                            onClick={() =>
                                callStatus === 'finding'
                                    ? emit('leave_call', { user_id: (user as User)._id })
                                    : callingDuration > 0 && emit('end_call', { user_id: (user as User)._id })
                            }
                        >
                            {callStatus === 'finding' ? (
                                <svg
                                    className='h-6 w-6 text-white'
                                    viewBox='0 0 24 24'
                                    fill='currentColor'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <g>
                                        <path d='M2.00589 4.54166C1.905 3.11236 3.11531 2 4.54522 2H7.60606C8.34006 2 9.00207 2.44226 9.28438 3.1212L10.5643 6.19946C10.8761 6.94932 10.6548 7.81544 10.0218 8.32292L9.22394 8.96254C8.86788 9.24798 8.74683 9.74018 8.95794 10.1448C10.0429 12.2241 11.6464 13.9888 13.5964 15.2667C14.008 15.5364 14.5517 15.4291 14.8588 15.0445L15.6902 14.003C16.1966 13.3687 17.0609 13.147 17.8092 13.4594L20.8811 14.742C21.5587 15.0249 22 15.6883 22 16.4238V19.5C22 20.9329 20.8489 22.0955 19.4226 21.9941C10.3021 21.3452 2.65247 13.7017 2.00589 4.54166Z' />
                                    </g>
                                </svg>
                            ) : (
                                <svg
                                    className='-mb-0.5 -ml-0.5 h-6 w-6 text-white'
                                    viewBox='0 0 24 24'
                                    fill='currentColor'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <g>
                                        <path d='M20.2322 5.18192L19.8787 5.53548L20.2322 5.88903L23.0607 8.71747C23.2559 8.91273 23.2559 9.22931 23.0607 9.42457L22.3536 10.1317C22.1583 10.3269 21.8417 10.3269 21.6465 10.1317L18.818 7.30324L18.4645 6.94969L18.1109 7.30324L15.2825 10.1317C15.0872 10.3269 14.7706 10.3269 14.5754 10.1317L13.8683 9.42457C13.673 9.22931 13.673 8.91273 13.8683 8.71747L16.6967 5.88903L17.0503 5.53548L16.6967 5.18192L13.8683 2.35351L13.5147 2.70706L13.8683 2.35351C13.673 2.15824 13.673 1.84166 13.8683 1.6464L13.5147 1.29285L13.8683 1.6464L14.5754 0.939293C14.7707 0.744031 15.0872 0.744031 15.2825 0.939293L18.1109 3.76771L18.4645 4.12126L18.818 3.76771L21.6464 0.939293C21.8417 0.744031 22.1583 0.744031 22.3536 0.939294L23.0607 1.6464C23.2559 1.84166 23.2559 2.15824 23.0607 2.35351L20.2322 5.18192ZM21.5 16.9866H21.4589V17.4866V19.4498C21.4589 20.6431 20.5469 21.5728 19.4581 21.4953C10.5862 20.8641 3.13372 13.4185 2.50464 4.50642C2.42741 3.4123 3.35719 2.49997 4.54522 2.49997H7.60606C8.13761 2.49997 8.61776 2.82026 8.8227 3.31314L10.1027 6.3914C10.3291 6.93599 10.1682 7.56472 9.70908 7.93277L8.9112 8.57239C8.38251 8.99622 8.18513 9.74453 8.51466 10.376C9.63934 12.5314 11.3012 14.3604 13.3223 15.6848C13.9662 16.1067 14.794 15.927 15.2495 15.3564L16.0809 14.315C16.4482 13.8549 17.0746 13.6945 17.6166 13.9208L20.6885 15.2034C21.1794 15.4084 21.5 15.8895 21.5 16.4238V16.9866Z' />
                                    </g>
                                </svg>
                            )}
                        </Button>
                    </div>
                </>
            )}

            {callStatus === 'ended' && datingCallId && (
                <DatingCallReview
                    callingDuration={callingDuration}
                    myId={(datingProfile as DatingProfile)._id}
                    userRatedId={(userProfile as DatingProfileDetail)._id}
                    datingCallId={datingCallId}
                />
            )}
        </div>
    ) : (
        <Fragment />
    )
}

export default DatingCall
