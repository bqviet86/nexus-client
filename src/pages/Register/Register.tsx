import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DatePicker, Radio, RadioChangeEvent } from 'antd'
import { useMutation } from '@tanstack/react-query'

import InputWithLabelAndError from '~/components/InputWithLabelAndError'
import { RegisterReqData, registerUser } from '~/apis/users.apis'
import images from '~/assets/images'
import { routes } from '~/config'
import { Sex } from '~/constants/enums'
import { AppContext } from '~/contexts/appContext'
import { AuthResponse } from '~/types/users.types'
import { isAxiosUnprocessableEntityError } from '~/utils/check'
import { handleUnprocessableEntityError } from '~/utils/handle'
import { setTokenToLS, setUserToLS } from '~/utils/localStorage'

type RegisterResError = {
    [K in keyof RegisterReqData]: string | null
}

const initialFormData: RegisterReqData = {
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    date_of_birth: '',
    sex: Sex.Male,
    phone_number: ''
}

function Register() {
    const navigate = useNavigate()

    const { setUser } = useContext(AppContext)
    const [formData, setFormData] = useState<RegisterReqData>(initialFormData)
    const [formError, setFormError] = useState<RegisterResError>(initialFormData)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData((prev) => ({ ...prev, [name]: value }))
        setFormError((prev) => ({ ...prev, [name]: '' }))
    }

    const handleChangeSex = (e: RadioChangeEvent) => {
        setFormData((prev) => ({ ...prev, sex: e.target.value }))
    }

    const handleChangeDateOfBirth = (value: any) => {
        const date = new Date(value.$d as string)
        setFormData((prev) => ({ ...prev, date_of_birth: date.toISOString() }))
    }

    const { mutate: mutateRegister } = useMutation({
        mutationFn: (data: RegisterReqData) => registerUser(data)
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        mutateRegister(formData, {
            onSuccess: (resData) => {
                const result = resData.data.result as AuthResponse

                setUser(result.user)
                setUserToLS(result.user)
                setTokenToLS(result.token)
                navigate(routes.home)
            },
            onError: (error) => {
                if (isAxiosUnprocessableEntityError<RegisterResError>(error)) {
                    const errorObjRes = handleUnprocessableEntityError<RegisterResError>(error)
                    setFormError(errorObjRes)
                }
            }
        })
    }

    return (
        <div className='fixed inset-x-0 h-[calc(100vh-60px)] select-none bg-white'>
            <img
                src={images.sky}
                alt='space'
                className='absolute left-0 top-0 h-full w-full object-cover transition-all dark:opacity-0'
            />
            <img
                src={images.cloud_under}
                alt='space'
                className='absolute bottom-0 left-0 min-h-[100px] w-full object-cover transition-all lg:-bottom-[68px] dark:opacity-0'
            />
            <img
                src={images.space}
                alt='space'
                className='absolute left-0 top-0 h-full w-full object-cover opacity-0 transition-all dark:opacity-[1]'
            />

            <div className='absolute inset-0 flex items-center justify-center p-2 md:right-1/3'>
                <form
                    className='flex max-h-full max-w-full flex-col rounded-3xl bg-[#dee4f6] py-4 transition-all md:py-5 lg:py-[30px] dark:bg-[#3a3a3a]/80'
                    onSubmit={handleSubmit}
                >
                    <h3 className='mb-5 px-4 text-center text-[24px] font-semibold text-[#654dab] transition-all md:mb-7 md:px-10 lg:px-[60px] lg:text-[32px] dark:text-[#9b7cee]'>
                        Đăng ký
                    </h3>

                    <div className='overflow-y-auto'>
                        <div className='mx-4 flex w-[480px] max-w-[calc(100%-32px)] items-start gap-4 md:mx-10 md:max-w-[calc(100%-80px)] lg:mx-[60px] lg:max-w-[calc(100%-120px)]'>
                            <InputWithLabelAndError
                                title='Họ và tên'
                                error={formError.name}
                                wrapperClassName='!mx-0 !md:mx-0 !lg:mx-0'
                                name='name'
                                placeholder='Nguyễn Văn A'
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <InputWithLabelAndError
                                title='Email'
                                error={formError.email}
                                wrapperClassName='!mx-0 !md:mx-0 !lg:mx-0'
                                name='email'
                                placeholder='abc@gmail.com'
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='mx-4 flex w-[480px] max-w-[calc(100%-32px)] items-start gap-4 md:mx-10 md:max-w-[calc(100%-80px)] lg:mx-[60px] lg:max-w-[calc(100%-120px)]'>
                            <InputWithLabelAndError
                                title='Mật khẩu'
                                error={formError.password}
                                wrapperClassName='!mx-0 !md:mx-0 !lg:mx-0'
                                type='password'
                                name='password'
                                placeholder='Mật khẩu'
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <InputWithLabelAndError
                                title='Xác nhận mật khẩu'
                                error={formError.confirm_password}
                                wrapperClassName='!mx-0 !md:mx-0 !lg:mx-0'
                                type='password'
                                name='confirm_password'
                                placeholder='Xác nhận mật khẩu'
                                value={formData.confirm_password}
                                onChange={handleChange}
                            />
                        </div>

                        <InputWithLabelAndError
                            title='Số điện thoại'
                            error={formError.phone_number}
                            wrapperClassName='!w-[480px]'
                            name='phone_number'
                            placeholder='0123456789'
                            value={formData.phone_number}
                            onChange={handleChange}
                        />

                        <div className='mx-4 mt-4 flex w-[480px] max-w-[calc(100%-32px)] gap-4 md:mx-10 md:mt-6 md:max-w-[calc(100%-80px)] lg:mx-[60px] lg:max-w-[calc(100%-120px)]'>
                            <div className='flex flex-col'>
                                <h4 className='mb-1 text-[14px] font-medium leading-[14px] transition-all lg:mb-2 lg:text-base lg:leading-4 dark:text-white/70'>
                                    Giới tính
                                </h4>
                                <Radio.Group
                                    value={formData.sex}
                                    onChange={handleChangeSex}
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
                            <div className='flex-1'>
                                <h4 className='mb-1 text-[14px] font-medium leading-[14px] transition-all lg:mb-2 lg:text-base lg:leading-4 dark:text-white/70'>
                                    Ngày sinh
                                </h4>
                                <DatePicker
                                    showToday={false}
                                    format='DD-MM-YYYY'
                                    placeholder='Chọn ngày sinh'
                                    onChange={handleChangeDateOfBirth}
                                    className='h-10 w-full rounded-lg border border-solid border-[#ddd] bg-white px-2 py-1 text-[14px] !shadow-none transition-all lg:h-11 lg:px-3 lg:py-2 lg:text-base dark:border-white/70 dark:bg-[#242526]/70 dark:hover:border-[#9b7cee] [&>*>input::placeholder]:!text-[#9ca3af] [&>*>input]:!text-[14px] [&>*>input]:!text-[#333] lg:[&>*>input]:!text-base dark:[&>*>input]:!text-white/70'
                                />
                                {formError.date_of_birth && (
                                    <div className='mt-1 pl-2 text-[13px] text-red-500 lg:pl-3'>
                                        {formError.date_of_birth}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='mx-4 mt-4 w-[480px] max-w-[calc(100%-32px)] md:mx-10 md:mt-6 md:max-w-[calc(100%-80px)] lg:mx-[60px] lg:max-w-[calc(100%-120px)]'>
                            <button
                                type='submit'
                                className='flex h-10 w-full max-w-full items-center justify-center rounded-lg bg-[#654dab] text-[14px] font-medium text-white transition-all hover:bg-[#654dab]/90 lg:h-11 lg:text-base dark:bg-[#9b7cee] dark:hover:bg-[#9b7cee]/90'
                            >
                                Đăng ký
                            </button>
                        </div>

                        <p className='mt-4 flex flex-wrap items-center justify-center px-4 text-[13px] md:mt-6 md:px-10 md:text-[14px] lg:px-[60px]'>
                            <span className='text-center transition-all dark:text-white/70'>Bạn đã có tài khoản?</span>
                            <Link
                                to={routes.login}
                                className='ml-1 text-center font-medium text-[#654dab] transition-all dark:text-[#9b7cee]'
                            >
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>
                </form>
            </div>

            <div className='absolute inset-y-0 right-0 hidden w-1/3 items-center justify-center md:flex'>
                <img src={images.alien} alt='space' className='h-full w-full object-contain' />
            </div>
        </div>
    )
}

export default Register
