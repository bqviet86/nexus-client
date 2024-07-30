import { Fragment, useContext, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { DatePicker, Radio } from 'antd'
import toast from 'react-hot-toast'
import { pick } from 'lodash'
import dayjs from 'dayjs'

import Button from '~/components/Button'
import Loading from '~/components/Loading'
import { UpdateMyProfileReqData, getMe, updateMyAvatar, updateMyProfile } from '~/apis/users.apis'
import images from '~/assets/images'
import { envConfig } from '~/config'
import { Sex } from '~/constants/enums'
import { AppContext } from '~/contexts/appContext'
import { User } from '~/types/users.types'
import { Media } from '~/types/medias.types'
import { isAxiosUnprocessableEntityError } from '~/utils/check'
import { handleUnprocessableEntityError } from '~/utils/handle'

type UpdateProfileResError = Partial<Record<keyof UpdateMyProfileReqData, string>>

function UpdateProfile() {
    const { setUser } = useContext(AppContext)
    const [profile, setProfile] = useState<User | null>(null)
    const [formData, setFormData] = useState<UpdateMyProfileReqData | null>(null)
    const [formError, setFormError] = useState<UpdateProfileResError>({})

    const { isFetching } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await getMe()
            const result = response.data.result as User

            setProfile(result)
            setFormData(pick(result, ['name', 'email', 'date_of_birth', 'sex', 'phone_number']))

            return result
        }
    })

    const { mutate: mutateUpdateAvatar } = useMutation({
        mutationFn: (data: FormData) => updateMyAvatar(data)
    })

    const handleUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file) return

        const formData = new FormData()

        formData.append('image', file)

        mutateUpdateAvatar(formData, {
            onSuccess: (response) => {
                const result = response.data.result as Media
                const newAvatar = result.url.split('/').slice(-1)[0]

                toast.success('Cập nhật ảnh đại diện thành công!')
                setUser((prev) => ({ ...(prev as User), avatar: newAvatar }))
                setProfile((prev) => ({ ...(prev as User), avatar: newAvatar }))
            }
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData((prev) => ({ ...prev, [name]: value }))
        setFormError((prev) => ({ ...prev, [name]: '' }))
    }

    const { mutate: mutateUpdateMyProfile } = useMutation({
        mutationFn: (data: UpdateMyProfileReqData) => updateMyProfile(data)
    })

    const handleUpdateMyProfile = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!formData) return

        mutateUpdateMyProfile(formData, {
            onSuccess: (response) => {
                const result = response.data.result as User

                toast.success('Cập nhật thông tin cá nhân thành công!')
                setUser(result)
                setProfile(result)
            },
            onError: (error) => {
                if (isAxiosUnprocessableEntityError<UpdateProfileResError>(error)) {
                    const errorObjRes = handleUnprocessableEntityError<UpdateProfileResError>(error)
                    setFormError(errorObjRes)
                }
            }
        })
    }

    return profile && formData ? (
        <div className='flex min-h-[calc(100vh-60px)] flex-col items-center justify-center px-2 py-4 lg:flex-row lg:gap-4'>
            <div className='flex flex-col items-center gap-1 pb-10 pt-4 lg:w-1/3'>
                <div className='group relative h-40 w-40 overflow-hidden rounded-full'>
                    <img
                        src={profile.avatar ? `${envConfig.imageUrlPrefix}/${profile.avatar}` : images.avatar}
                        alt='avatar'
                        className='h-full w-full object-cover'
                    />

                    <div className='invisible absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-full bg-white/30 opacity-0 transition-all group-hover:visible group-hover:opacity-100 dark:bg-black/30'>
                        <svg
                            className='h-10 w-10 text-black/70 transition-all'
                            stroke='currentColor'
                            fill='currentColor'
                            strokeWidth='0'
                            viewBox='0 0 1024 1024'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path d='M864 260H728l-32.4-90.8a32.07 32.07 0 0 0-30.2-21.2H358.6c-13.5 0-25.6 8.5-30.1 21.2L296 260H160c-44.2 0-80 35.8-80 80v456c0 44.2 35.8 80 80 80h704c44.2 0 80-35.8 80-80V340c0-44.2-35.8-80-80-80zM512 716c-88.4 0-160-71.6-160-160s71.6-160 160-160 160 71.6 160 160-71.6 160-160 160zm-96-160a96 96 0 1 0 192 0 96 96 0 1 0-192 0z'></path>
                        </svg>

                        <label htmlFor='upload-avatar' className='absolute inset-0 cursor-pointer rounded-full' />
                        <input
                            id='upload-avatar'
                            type='file'
                            accept='image/*'
                            className='invisible block h-0 w-0'
                            onChange={handleUploadAvatar}
                        />
                    </div>
                </div>

                <h2 className='mt-5 line-clamp-1 text-3xl font-semibold text-[#050505] dark:text-[#e4e6eb]'>
                    {profile.name}
                </h2>

                <p className='line-clamp-1 text-xl dark:text-[#e4e6eb]'>({profile.email})</p>
            </div>

            <div className='w-[500px] max-w-full rounded-lg bg-[#d7dae0] p-5 lg:mx-auto lg:w-[600px] dark:bg-[#242526]'>
                <h3 className='my-4 text-center text-2xl font-semibold dark:text-[#e4e6eb]'>Cập nhật trang cá nhân</h3>

                <form className='[&>div:not(:first-child)]:mt-5' onSubmit={handleUpdateMyProfile}>
                    <div className='flex flex-col'>
                        <label htmlFor='name' className='pb-1 pl-2 text-sm font-semibold dark:text-[#e4e6eb]'>
                            Họ và tên
                        </label>
                        <input
                            id='name'
                            name='name'
                            placeholder='Tên của bạn'
                            spellCheck={false}
                            className='focus:ring-primary-500 h-10 rounded-md border border-gray-300 p-2 text-[15px] focus:border-transparent focus:outline-none focus:ring-2 dark:bg-[#4e4f50]/70 dark:text-[#e4e6eb] dark:focus:ring-[#9b7cee]'
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {formError.name && (
                            <div className='mt-1 pl-2 text-[13px] text-red-500 lg:pl-3'>{formError.name}</div>
                        )}
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor='email' className='pb-2 pl-2 text-sm font-semibold dark:text-[#e4e6eb]'>
                            Email
                        </label>
                        <input
                            id='email'
                            name='email'
                            placeholder='Email của bạn'
                            spellCheck={false}
                            className='focus:ring-primary-500 h-10 rounded-md border border-gray-300 p-2 text-[15px] focus:border-transparent focus:outline-none focus:ring-2 dark:bg-[#4e4f50]/70 dark:text-[#e4e6eb] dark:focus:ring-[#9b7cee]'
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {formError.email && (
                            <div className='mt-1 pl-2 text-[13px] text-red-500 lg:pl-3'>{formError.email}</div>
                        )}
                    </div>

                    <div className='flex justify-between gap-4'>
                        <div className='flex flex-col'>
                            <label htmlFor='sex' className='pb-2 pl-2 text-sm font-semibold dark:text-[#e4e6eb]'>
                                Giới tính
                            </label>
                            <Radio.Group
                                value={formData.sex}
                                onChange={(e) => setFormData((prev) => ({ ...prev, sex: e.target.value }))}
                                className='flex flex-1 items-center'
                            >
                                <Radio value={Sex.Male} className='lg:text-base'>
                                    Nam
                                </Radio>
                                <Radio value={Sex.Female} className='lg:text-base'>
                                    Nữ
                                </Radio>
                            </Radio.Group>
                        </div>

                        <div className='flex flex-[1] flex-col'>
                            <div className='pb-2 pl-2 text-sm font-semibold dark:text-[#e4e6eb]'>Ngày sinh</div>
                            <DatePicker
                                allowClear={false}
                                showToday={false}
                                format='DD-MM-YYYY'
                                placeholder='Ngày sinh của bạn'
                                value={dayjs(formData.date_of_birth)}
                                onChange={(value: any) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        date_of_birth: new Date(value.$d as string).toISOString()
                                    }))
                                }
                                className='h-10 w-full rounded-lg border border-solid border-[#ddd] bg-white px-2 py-1 text-[14px] !shadow-none transition-all lg:h-11 lg:px-3 lg:py-2 lg:text-base dark:border-white/70 dark:bg-[#4e4f50]/70 dark:text-[#e4e6eb] dark:hover:border-[#9b7cee] [&>*>input::placeholder]:!text-[#9ca3af] [&>*>input]:!text-[14px] [&>*>input]:!text-[#333] lg:[&>*>input]:!text-base dark:[&>*>input]:!text-white/70'
                            />
                            {formError.date_of_birth && (
                                <div className='mt-1 pl-2 text-[13px] text-red-500 lg:pl-3'>
                                    {formError.date_of_birth}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor='phone_number' className='pb-2 pl-2 text-sm font-semibold dark:text-[#e4e6eb]'>
                            Số điện thoại
                        </label>
                        <input
                            id='phone_number'
                            name='phone_number'
                            placeholder='Số điện thoại của bạn'
                            spellCheck={false}
                            className='focus:ring-primary-500 h-10 rounded-md border border-gray-300 p-2 text-[15px] focus:border-transparent focus:outline-none focus:ring-2 dark:bg-[#4e4f50]/70 dark:text-[#e4e6eb] dark:focus:ring-[#9b7cee]'
                            value={formData.phone_number}
                            onChange={handleChange}
                        />
                        {formError.phone_number && (
                            <div className='mt-1 pl-2 text-[13px] text-red-500 lg:pl-3'>{formError.phone_number}</div>
                        )}
                    </div>

                    <Button
                        type='submit'
                        className='!mx-auto !mt-5 !bg-gradient-to-r !from-cyan-500 !to-blue-500 [&>span]:!text-white'
                    >
                        Cập nhật
                    </Button>
                </form>
            </div>
        </div>
    ) : isFetching ? (
        <Loading loaderSize={40} className='flex h-[calc(100vh-60px)] w-full items-center justify-center' />
    ) : (
        <Fragment />
    )
}

export default UpdateProfile
