import { Fragment, useContext, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ApexOptions } from 'apexcharts'
import ReactApexChart from 'react-apexcharts'
import { Table } from 'antd'

import { getAllStats } from '~/apis/users.apis'
import { AppContext } from '~/contexts/appContext'
import { Stats } from '~/types/users.types'

const options: ApexOptions = {
    chart: {
        toolbar: {
            show: false
        }
    },
    colors: ['#3c50e0'],
    plotOptions: {
        bar: {
            horizontal: false,
            borderRadius: 4,
            columnWidth: '50%',
            borderRadiusApplication: 'end',
            borderRadiusWhenStacked: 'last'
        }
    },
    dataLabels: {
        enabled: false
    },
    xaxis: {
        categories: [
            '06/2023',
            '07/2023',
            '08/2023',
            '09/2023',
            '10/2023',
            '11/2023',
            '12/2023',
            '01/2024',
            '02/2024',
            '03/2024',
            '04/2024',
            '05/2024'
        ]
    }
}

function AdminStat() {
    const { socket } = useContext(AppContext)
    const [cardData, setCardData] = useState<{ title: string; data: string; icon: JSX.Element }[]>([])
    const [topPersonalityData, setTopPersonalityData] = useState<
        {
            key: string
            mbti_type: string
            amount: number
        }[]
    >([])
    const [topConstruciveQuestionData, setTopConstruciveQuestionData] = useState<
        {
            key: string
            question: string
            option_amount: number
            amount: number
        }[]
    >([])
    const [topReviewTextData, setTopReviewTextData] = useState<
        {
            key: string
            review_text: string
            amount: number
        }[]
    >([])

    const { data } = useQuery({
        queryKey: ['stats'],
        queryFn: async () => {
            const response = await getAllStats()
            const result = response.data.result as Stats

            setCardData([
                {
                    title: 'Người dùng trực tuyến',
                    data: `${result.onl_amount} người`,
                    icon: (
                        <svg
                            className='h-5 w-5 text-[#3c50e0]'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z'
                            />
                        </svg>
                    )
                },
                {
                    title: 'Số lượng bài viết',
                    data: `${result.posts_amount} bài viết`,
                    icon: (
                        <svg
                            className='h-5 w-5 text-[#3c50e0]'
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <g>
                                <path
                                    d='M5 11.5C5 9.61438 5 8.67157 5.58579 8.08579C6.17157 7.5 7.11438 7.5 9 7.5H15C16.8856 7.5 17.8284 7.5 18.4142 8.08579C19 8.67157 19 9.61438 19 11.5V12.5C19 14.3856 19 15.3284 18.4142 15.9142C17.8284 16.5 16.8856 16.5 15 16.5H9C7.11438 16.5 6.17157 16.5 5.58579 15.9142C5 15.3284 5 14.3856 5 12.5V11.5Z'
                                    stroke='currentColor'
                                    strokeWidth='1.5'
                                />
                                <path
                                    d='M19 2V2.5C19 3.88071 17.8807 5 16.5 5H7.5C6.11929 5 5 3.88071 5 2.5V2'
                                    stroke='currentColor'
                                    strokeWidth='1.5'
                                    strokeLinecap='round'
                                />
                                <path
                                    d='M19 22V21.5C19 20.1193 17.8807 19 16.5 19H7.5C6.11929 19 5 20.1193 5 21.5V22'
                                    stroke='currentColor'
                                    strokeWidth='1.5'
                                    strokeLinecap='round'
                                />
                            </g>
                        </svg>
                    )
                },
                {
                    title: 'Người dùng đang trong cuộc gọi',
                    data: `${result.calling_amount} người`,
                    icon: (
                        <svg
                            className='h-5 w-5 text-[#3c50e0]'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <g>
                                <path d='M9.691,7.437A3.11,3.11,0,0,0,9.04,3.994L6.955,1.909A3.066,3.066,0,0,0,4.3,1.035,3.1,3.1,0,0,0,2,2.672a8.578,8.578,0,0,0-.727,6.186c1.329,5.28,8.585,12.536,13.865,13.865a8.932,8.932,0,0,0,2.18.274,8.546,8.546,0,0,0,4.006-1,3.108,3.108,0,0,0,.763-4.951L20.006,14.96a3.114,3.114,0,0,0-3.444-.651,4.859,4.859,0,0,0-1.471.987c-.511.511-2.391-.23-4.275-2.112S8.193,9.421,8.7,8.909A4.851,4.851,0,0,0,9.691,7.437ZM9.4,14.6c2.294,2.292,5.378,3.836,7.1,2.112a2.9,2.9,0,0,1,.873-.575,1.1,1.1,0,0,1,1.214.239l2.085,2.085a1.088,1.088,0,0,1,.31.941,1.113,1.113,0,0,1-.591.827,6.518,6.518,0,0,1-4.766.556C11.089,19.64,4.36,12.911,3.217,8.37A6.523,6.523,0,0,1,3.773,3.6,1.113,1.113,0,0,1,4.6,3.013,1.056,1.056,0,0,1,4.768,3a1.087,1.087,0,0,1,.773.323L7.626,5.408a1.1,1.1,0,0,1,.239,1.213A2.9,2.9,0,0,1,7.29,7.5C5.566,9.219,7.109,12.3,9.4,14.6Zm11.021-3.027a6,6,0,0,0-7.994-7.994,1,1,0,1,1-.858-1.806A8,8,0,0,1,22.229,12.429a1,1,0,0,1-1.806-.858Zm-4.009-1.157a2,2,0,0,0,0-2.828,2.047,2.047,0,0,0-2.828,0,1,1,0,0,1-1.414-1.414,4.093,4.093,0,0,1,5.656,0,4,4,0,0,1,0,5.656,1,1,0,0,1-1.414-1.414Z' />
                            </g>
                        </svg>
                    )
                },
                {
                    title: 'Tỷ lệ đánh giá trung bình',
                    data: `${result.avg_start_rating}/5 ⭐`,
                    icon: (
                        <svg
                            className='h-5 w-5 text-[#3c50e0]'
                            fill='currentColor'
                            viewBox='0 0 52 52'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <g>
                                <path d='M27.4133467,3.10133815 L32.0133467,18.1013381 C32.2133467,18.7013381 32.8133467,19.0013381 33.4133467,19.0013381 L48.4133467,19.0013381 C49.9133467,19.0013381 50.5133467,21.0013381 49.3133467,21.9013381 L37.1133467,30.9013381 C36.6133467,31.3013381 36.4133467,32.0013381 36.6133467,32.6013381 L42.4133467,48.0013381 C42.8133467,49.4013381 41.3133467,50.6013381 40.1133467,49.7013381 L27.0133467,39.9013381 C26.5133467,39.5013381 25.8133467,39.5013381 25.2133467,39.9013381 L12.0133467,49.7013381 C10.8133467,50.6013381 9.21334668,49.4013381 9.71334668,48.0013381 L15.3133467,32.6013381 C15.5133467,32.0013381 15.3133467,31.3013381 14.8133467,30.9013381 L2.61334668,21.9013381 C1.41334668,21.0013381 2.11334668,19.0013381 3.51334668,19.0013381 L18.5133467,19.0013381 C19.2133467,19.0013381 19.7133467,18.8013381 19.9133467,18.1013381 L24.6133467,3.00133815 C25.0133467,1.60133815 27.0133467,1.70133815 27.4133467,3.10133815 Z M26.0133467,12.8023264 C26,14.1700393 26,33.5426636 26,34.4953918 C26.1865845,34.6476135 28.9331193,36.6890643 34.2396046,40.6197441 C34.9394191,41.144605 35.8141872,40.4447905 35.5809157,39.6283403 L35.5809157,39.6283403 L32.3085327,31.0201416 C31.9597778,30.2501831 32.3085327,29.7487793 32.7398682,29.4849854 L32.7398682,29.4849854 L39.6048489,24.6961622 C40.3046634,24.1713013 39.9547562,23.0049438 39.0799881,23.0049438 L39.0799881,23.0049438 L31.0206299,23.0049438 C30.6707226,23.0049438 29.7518921,22.8880615 29.5025635,21.9888306 L29.5025635,21.9888306 L26.8332347,13.4436151 C26.7175852,13.0388421 26.3602784,12.8204102 26.0133467,12.8023264 Z' />
                            </g>
                        </svg>
                    )
                }
            ])
            setTopPersonalityData(result.top_mbti_types.map((item) => ({ ...item, key: item.mbti_type })))
            setTopConstruciveQuestionData(
                result.top_constructive_questions.map((item) => ({
                    key: item._id,
                    question: item.question,
                    option_amount: item.options.length,
                    amount: item.amount
                }))
            )
            setTopReviewTextData(result.top_review_texts.map((item) => ({ ...item, key: item.review_text })))

            return result
        },
        gcTime: 0,
        enabled: !!socket && socket.connected
    })

    return data ? (
        <>
            <div className='flex gap-4'>
                {cardData.map(({ title, data, icon }, index) => (
                    <div
                        key={index}
                        className='flex flex-[1] items-center justify-between gap-2 rounded-lg bg-white p-4'
                    >
                        <div className='flex flex-[1] flex-col gap-2 text-[15px]'>
                            <span className='text-[#64748b]'>{title}</span>
                            <span className='font-medium text-[#333]'>{data}</span>
                        </div>

                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#eff2f7]'>
                            {icon}
                        </div>
                    </div>
                ))}
            </div>

            <div className='mt-4 grid grid-cols-12 gap-4'>
                <div className='col-span-8 rounded-lg bg-white p-4'>
                    <h4 className='text-lg font-semibold text-black'>
                        Biểu đồ số lượng cuộc gọi theo tháng (dạng cột)
                    </h4>

                    <ReactApexChart
                        options={options}
                        type='bar'
                        series={[
                            {
                                name: 'Số lượng cuộc gọi',
                                data: [30, 40, 25, 50, 47, 23, 75, 55, 42, 62, 45, 30]
                            }
                        ]}
                        height={360}
                        className='!mt-4 !h-[360px] !min-h-[360px]'
                    />
                </div>

                <div className='col-span-4 rounded-lg bg-white p-4'>
                    <h4 className='text-lg font-semibold text-black'>
                        Biểu đồ số lượng cuộc gọi theo tháng (dạng đường)
                    </h4>

                    <ReactApexChart
                        options={options}
                        type='area'
                        series={[
                            {
                                name: 'Số lượng cuộc gọi',
                                data: [30, 40, 25, 50, 47, 23, 75, 55, 42, 62, 45, 30]
                            }
                        ]}
                        height={360}
                        className='!mt-4 !h-[360px] !min-h-[360px]'
                    />
                </div>
            </div>

            <div className='mt-4 grid grid-cols-12 gap-4'>
                <div className='col-span-3 max-h-[400px] overflow-y-auto overflow-x-hidden rounded-lg bg-white p-4 [&::-webkit-scrollbar-track]:!bg-transparent'>
                    <h4 className='text-lg font-semibold text-black'>Top tính cách phổ biến nhất</h4>
                    <Table
                        dataSource={topPersonalityData}
                        columns={[
                            {
                                title: 'Loại MBTI',
                                dataIndex: 'mbti_type',
                                key: 'mbti_type'
                            },
                            {
                                title: 'Số lượng',
                                dataIndex: 'amount',
                                key: 'amount'
                            }
                        ]}
                        size='small'
                        pagination={{ position: ['none'] }}
                        className='mt-4 [&_td]:!text-center [&_th]:!bg-[#f7f9fc] [&_th]:!text-center'
                    />
                </div>

                <div className='col-span-6 max-h-[400px] overflow-y-auto overflow-x-hidden rounded-lg bg-white p-4 [&::-webkit-scrollbar-track]:!bg-transparent'>
                    <h4 className='text-lg font-semibold text-black'>Top câu hỏi kiến tạo được trả lời nhiều nhất</h4>
                    <Table
                        dataSource={topConstruciveQuestionData}
                        columns={[
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
                                dataIndex: 'amount',
                                key: 'amount'
                            }
                        ]}
                        size='small'
                        pagination={{ position: ['none'] }}
                        className='mt-4 [&_td]:!text-center [&_th]:!bg-[#f7f9fc] [&_th]:!text-center'
                    />
                </div>

                <div className='col-span-3 max-h-[400px] overflow-y-auto overflow-x-hidden rounded-lg bg-white p-4 [&::-webkit-scrollbar-track]:!bg-transparent'>
                    <h4 className='text-lg font-semibold text-black'>Top từ khoá được đánh giá nhiều nhất</h4>
                    <Table
                        dataSource={topReviewTextData}
                        columns={[
                            {
                                title: 'Từ khoá',
                                dataIndex: 'review_text',
                                key: 'review_text'
                            },
                            {
                                title: 'Lượt đánh giá',
                                dataIndex: 'amount',
                                key: 'amount'
                            }
                        ]}
                        size='small'
                        pagination={{ position: ['none'] }}
                        className='mt-4 [&_td]:!text-center [&_th]:!bg-[#f7f9fc] [&_th]:!text-center'
                    />
                </div>
            </div>
        </>
    ) : (
        <Fragment />
    )
}

export default AdminStat
