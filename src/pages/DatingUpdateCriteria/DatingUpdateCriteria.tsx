import { Fragment, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ConfigProvider, Radio, Slider } from 'antd'
import toast from 'react-hot-toast'

import Modal from '~/components/Modal'
import HometownList from '~/components/HometownList'
import LanguageList from '~/components/LanguageList'
import Button from '~/components/Button'
import { UpdateDatingCriteriaReqBody, getDatingCriteria, updateDatingCriteria } from '~/apis/datingCriterias.apis'
import { Language, Sex } from '~/constants/enums'
import { DatingCriteria } from '~/types/datingCriterias.types'

function DatingUpdateCriteria() {
    const [datingCriteria, setDatingCriteria] = useState<DatingCriteria>()
    const [isOpenSexModal, setIsOpenSexModal] = useState<boolean>(false)
    const [isOpenAgeRangeModal, setIsOpenAgeRangeModal] = useState<boolean>(false)
    const [isOpenHeightRangeModal, setIsOpenHeightRangeModal] = useState<boolean>(false)
    const [isOpenHometownList, setIsOpenHometownList] = useState<boolean>(false)
    const [isOpenLanguageList, setIsOpenLanguageList] = useState<boolean>(false)

    useQuery({
        queryKey: ['dating-criteria'],
        queryFn: async () => {
            const response = await getDatingCriteria()
            const result = response.data.result as DatingCriteria

            setDatingCriteria(result)

            return result
        }
    })

    const { mutate: mutateUpdateDatingCriteria } = useMutation({
        mutationFn: (body: UpdateDatingCriteriaReqBody) => updateDatingCriteria(body)
    })

    const handleUpdateDatingCriteria = () => {
        mutateUpdateDatingCriteria(datingCriteria as DatingCriteria, {
            onSuccess: () =>
                toast.success('Cập nhật tiêu chí hẹn hò thành công', {
                    position: 'top-center'
                }),
            onError: (error) => console.log(error)
        })
    }

    return datingCriteria ? (
        <div className='flex min-h-full flex-col justify-center'>
            <h2 className='mt-5 text-center text-2xl font-semibold text-teal-500'>Cập nhật tiêu chí hẹn hò</h2>

            <div className='mt-10 text-sm [&>div+div]:mt-2'>
                <div className='flex gap-2'>
                    <p className='flex-[1]'>
                        Giới tính: <span className='font-medium'>{datingCriteria.sex === Sex.Male ? 'Nam' : 'Nữ'}</span>
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

            <div className='mt-10'>
                <h4>Lựa chọn tiêu chí</h4>

                <div className='mt-2 flex flex-col gap-2'>
                    <div
                        className='flex cursor-pointer items-center justify-between rounded-lg bg-[#4c4a4c] p-2'
                        onClick={() => setIsOpenSexModal(true)}
                    >
                        <div className='text-sm'>Giới tính</div>

                        <div className='flex items-center gap-1 text-sm'>
                            <span>{datingCriteria.sex === Sex.Male ? 'Nam' : 'Nữ'}</span>
                            <svg
                                className='h-4 w-4'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    fillRule='evenodd'
                                    d='M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z'
                                    clipRule='evenodd'
                                />
                            </svg>
                        </div>
                    </div>

                    <div
                        className='flex cursor-pointer items-center justify-between rounded-lg bg-[#4c4a4c] p-2'
                        onClick={() => setIsOpenAgeRangeModal(true)}
                    >
                        <div className='text-sm'>Độ tuổi</div>

                        <div className='flex items-center gap-1 text-sm'>
                            <span>
                                {datingCriteria.age_range[0]} - {datingCriteria.age_range[1]} tuổi
                            </span>
                            <svg
                                className='h-4 w-4'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    fillRule='evenodd'
                                    d='M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z'
                                    clipRule='evenodd'
                                />
                            </svg>
                        </div>
                    </div>

                    <div
                        className='flex cursor-pointer items-center justify-between rounded-lg bg-[#4c4a4c] p-2'
                        onClick={() => setIsOpenHeightRangeModal(true)}
                    >
                        <div className='text-sm'>Chiều cao</div>

                        <div className='flex items-center gap-1 text-sm'>
                            <span>
                                {datingCriteria.height_range[0]} - {datingCriteria.height_range[1]} cm
                            </span>
                            <svg
                                className='h-4 w-4'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    fillRule='evenodd'
                                    d='M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z'
                                    clipRule='evenodd'
                                />
                            </svg>
                        </div>
                    </div>

                    <div
                        className='flex cursor-pointer items-center justify-between rounded-lg bg-[#4c4a4c] p-2'
                        onClick={() => setIsOpenHometownList(true)}
                    >
                        <div className='text-sm'>Quê quán</div>

                        <div className='flex items-center gap-1 text-sm'>
                            <span>{datingCriteria.hometown}</span>
                            <svg
                                className='h-4 w-4'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    fillRule='evenodd'
                                    d='M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z'
                                    clipRule='evenodd'
                                />
                            </svg>
                        </div>
                    </div>

                    <div
                        className='flex cursor-pointer items-center justify-between rounded-lg bg-[#4c4a4c] p-2'
                        onClick={() => setIsOpenLanguageList(true)}
                    >
                        <div className='text-sm'>Ngôn ngữ</div>

                        <div className='flex items-center gap-1 text-sm'>
                            <span>{datingCriteria.language}</span>
                            <svg
                                className='h-4 w-4'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    fillRule='evenodd'
                                    d='M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z'
                                    clipRule='evenodd'
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <Modal
                    dating
                    title='Chọn giới tính'
                    open={isOpenSexModal}
                    onCancel={() => setIsOpenSexModal(false)}
                    footer={null}
                >
                    <ConfigProvider theme={{ token: { colorPrimary: '#07e1ff' } }}>
                        <Radio.Group
                            value={datingCriteria.sex}
                            onChange={(e) =>
                                setDatingCriteria((prev) => ({ ...prev, sex: e.target.value }) as DatingCriteria)
                            }
                            className='mb-2 mt-4 flex justify-center'
                        >
                            <Radio value={Sex.Male} className='lg:text-base'>
                                Nam
                            </Radio>
                            <Radio value={Sex.Female} className='lg:text-base'>
                                Nữ
                            </Radio>
                        </Radio.Group>
                    </ConfigProvider>
                </Modal>

                <Modal
                    dating
                    title='Chọn độ tuổi'
                    open={isOpenAgeRangeModal}
                    onCancel={() => setIsOpenAgeRangeModal(false)}
                    footer={null}
                >
                    <ConfigProvider
                        theme={{
                            token: { colorPrimary: '#07e1ff', colorBgBase: '#e4e6eb' },
                            components: {
                                Slider: { handleColor: '#07e1ff' }
                            }
                        }}
                    >
                        <p className='mx-auto mt-2 p-1 text-center text-sm text-[#e4e6eb]/80'>
                            {datingCriteria.age_range[0]} tuổi - {datingCriteria.age_range[1]} tuổi
                        </p>
                        <Slider
                            range
                            min={18}
                            max={65}
                            defaultValue={datingCriteria.age_range}
                            tooltip={{ placement: 'bottom', formatter: (value) => `${value} tuổi` }}
                            onChange={(value) =>
                                setDatingCriteria((prev) => ({ ...prev, age_range: value }) as DatingCriteria)
                            }
                        />
                    </ConfigProvider>
                </Modal>

                <Modal
                    dating
                    title='Chọn chiều cao'
                    open={isOpenHeightRangeModal}
                    onCancel={() => setIsOpenHeightRangeModal(false)}
                    footer={null}
                >
                    <ConfigProvider
                        theme={{
                            token: { colorPrimary: '#07e1ff', colorBgBase: '#e4e6eb' },
                            components: {
                                Slider: { handleColor: '#07e1ff' }
                            }
                        }}
                    >
                        <p className='mx-auto mt-2 p-1 text-center text-sm text-[#e4e6eb]/80'>
                            {datingCriteria.height_range[0]} cm - {datingCriteria.height_range[1]} cm
                        </p>
                        <Slider
                            range
                            min={140}
                            max={220}
                            defaultValue={datingCriteria.height_range}
                            tooltip={{ placement: 'bottom', formatter: (value) => `${value} cm` }}
                            onChange={(value) =>
                                setDatingCriteria((prev) => ({ ...prev, height_range: value }) as DatingCriteria)
                            }
                        />
                    </ConfigProvider>
                </Modal>

                <HometownList
                    isOpen={isOpenHometownList}
                    onClose={() => setIsOpenHometownList(false)}
                    onSelectHometown={(hometown: string) =>
                        setDatingCriteria((prev) => ({ ...prev, hometown }) as DatingCriteria)
                    }
                />

                <LanguageList
                    isOpen={isOpenLanguageList}
                    onClose={() => setIsOpenLanguageList(false)}
                    onSelectLanguage={(language: Language) =>
                        setDatingCriteria((prev) => ({ ...prev, language }) as DatingCriteria)
                    }
                />
            </div>

            <Button
                className='mx-auto mb-5 mt-10 !w-auto !bg-teal-500 hover:!bg-teal-500/80 [&>span]:!text-[#fff]'
                onClick={handleUpdateDatingCriteria}
            >
                Cập nhật tiêu chí
            </Button>
        </div>
    ) : (
        <Fragment />
    )
}

export default DatingUpdateCriteria
