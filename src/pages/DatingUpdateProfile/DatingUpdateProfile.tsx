import { Fragment, useContext, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { pick } from 'lodash'

import Modal from '~/components/Modal'
import HeightList from '~/components/HeightList'
import HometownList from '~/components/HometownList'
import LanguageList from '~/components/LanguageList'
import Button from '~/components/Button'
import { UpdateDatingProfileReqBody, updateDatingProfile } from '~/apis/datingUsers.apis'
import { Language } from '~/constants/enums'
import { AppContext } from '~/contexts/appContext'
import { DatingProfile } from '~/types/datingUsers.types'

function DatingUpdateProfile() {
    const { datingProfile, setDatingProfile } = useContext(AppContext)
    const [profileData, setProfileData] = useState<Pick<DatingProfile, 'name' | 'height' | 'hometown' | 'language'>>(
        pick(datingProfile as DatingProfile, ['name', 'height', 'hometown', 'language'])
    )
    const [isOpenNameModal, setIsOpenNameModal] = useState<boolean>(false)
    const [isInvalidName, setIsInvalidName] = useState<boolean>(false)
    const [isOpenHeightList, setIsOpenHeightList] = useState<boolean>(false)
    const [isOpenProfileHometownList, setIsOpenProfileHometownList] = useState<boolean>(false)
    const [isOpenProfileLanguageList, setIsOpenProfileLanguageList] = useState<boolean>(false)

    const { mutate: mutateUpdateDatingProfile } = useMutation({
        mutationFn: (data: UpdateDatingProfileReqBody) => updateDatingProfile(data),
        onSuccess: (response) => setDatingProfile(response.data.result as DatingProfile)
    })

    return datingProfile ? (
        <div className='flex h-full flex-col justify-evenly py-2'>
            <h2 className='mt-5 text-center text-2xl font-semibold text-teal-500'>Cập nhật thông tin cá nhân</h2>

            <div className='mt-2 flex flex-col gap-2'>
                <div
                    className='flex cursor-pointer items-center justify-between rounded-lg bg-[#4c4a4c] p-2'
                    onClick={() => setIsOpenNameModal(true)}
                >
                    <div className='text-sm'>Tên</div>

                    <div className='flex items-center gap-1 text-sm'>
                        <span>{profileData.name}</span>
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
                    onClick={() => setIsOpenHeightList(true)}
                >
                    <div className='text-sm'>Chiều cao</div>

                    <div className='flex items-center gap-1 text-sm'>
                        <span>{profileData.height} cm</span>
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
                    onClick={() => setIsOpenProfileHometownList(true)}
                >
                    <div className='text-sm'>Quê quán</div>

                    <div className='flex items-center gap-1 text-sm'>
                        <span>{profileData.hometown}</span>
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
                    onClick={() => setIsOpenProfileLanguageList(true)}
                >
                    <div className='text-sm'>Ngôn ngữ</div>

                    <div className='flex items-center gap-1 text-sm'>
                        <span>{profileData.language}</span>
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

                <Modal
                    dating
                    title='Nhập tên của bạn'
                    open={isOpenNameModal}
                    onCancel={() => (profileData.name === '' ? setIsInvalidName(true) : setIsOpenNameModal(false))}
                    footer={null}
                >
                    <div className='my-2 max-h-[360px] overflow-y-auto [&::-webkit-scrollbar-track]:!bg-transparent'>
                        <input
                            placeholder='Nhập tên của bạn'
                            className='w-full rounded-lg bg-[#3a3b3c] px-4 py-2'
                            value={profileData.name}
                            onChange={(e) => {
                                setIsInvalidName(false)
                                setProfileData({ ...profileData, name: e.target.value })
                            }}
                        />
                        {isInvalidName && <p className='mt-1 px-4 text-xs text-red-500'>Tên không được để trống</p>}
                    </div>
                </Modal>

                <HeightList
                    isOpen={isOpenHeightList}
                    onClose={() => setIsOpenHeightList(false)}
                    onSelectHeight={(height: number) => setProfileData({ ...profileData, height })}
                />

                <HometownList
                    isOpen={isOpenProfileHometownList}
                    onClose={() => setIsOpenProfileHometownList(false)}
                    onSelectHometown={(hometown: string) => setProfileData({ ...profileData, hometown })}
                />

                <LanguageList
                    isOpen={isOpenProfileLanguageList}
                    onClose={() => setIsOpenProfileLanguageList(false)}
                    onSelectLanguage={(language: Language) => setProfileData({ ...profileData, language })}
                />
            </div>

            <Button
                className='mx-auto mb-5 mt-10 !w-auto !bg-teal-500 hover:!bg-teal-500/80 [&>span]:!text-[#fff]'
                onClick={() => mutateUpdateDatingProfile(profileData)}
            >
                Cập nhật
            </Button>
        </div>
    ) : (
        <Fragment />
    )
}

export default DatingUpdateProfile
