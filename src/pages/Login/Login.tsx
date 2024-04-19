import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import InputWithLabelAndError from '~/components/InputWithLabelAndError'
import { LoginReqData, loginUser } from '~/apis/users.apis'
import images from '~/assets/images'
import { routes } from '~/config'
import { UserRole } from '~/constants/enums'
import { AppContext } from '~/contexts/appContext'
import { AuthResponse } from '~/types/users.types'
import { ErrorResponse } from '~/types/response.types'
import { isAxiosForbiddenError, isAxiosUnprocessableEntityError } from '~/utils/check'
import { handleUnprocessableEntityError } from '~/utils/handle'
import { setTokenToLS, setUserToLS } from '~/utils/localStorage'

type LoginResError = {
    [K in keyof LoginReqData]: string | null
}

const initialFormData: LoginReqData = {
    email: '',
    password: ''
}

function Login() {
    const navigate = useNavigate()

    const { setUser, setToken } = useContext(AppContext)
    const [formData, setFormData] = useState<LoginReqData>(initialFormData)
    const [formError, setFormError] = useState<LoginResError>(initialFormData)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData((prev) => ({ ...prev, [name]: value }))
        setFormError((prev) => ({ ...prev, [name]: '' }))
    }

    const { mutate: mutateLogin } = useMutation({
        mutationFn: (data: LoginReqData) => loginUser(data)
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        mutateLogin(formData, {
            onSuccess: (resData) => {
                const result = resData.data.result as AuthResponse

                setUser(result.user)
                setUserToLS(result.user)
                setToken(result.token)
                setTokenToLS(result.token)

                if (result.user.role === UserRole.Admin) {
                    navigate(routes.adminStats)
                    return
                }

                navigate(routes.home)
            },
            onError: (error) => {
                if (isAxiosUnprocessableEntityError<LoginResError>(error)) {
                    const errorObjRes = handleUnprocessableEntityError<LoginResError>(error)
                    setFormError(errorObjRes)
                }

                if (isAxiosForbiddenError<ErrorResponse>(error)) {
                    toast(error.response?.data.message as string, { position: 'top-center' })
                }
            }
        })
    }

    return (
        <div className='fixed inset-x-0 h-[calc(100vh-60px)] select-none bg-[#5c7bd1]'>
            <img
                src={images.space}
                alt='space'
                className='h-full w-full object-cover opacity-0 transition-all dark:opacity-[1]'
            />

            <div className='fixed inset-y-0 left-0 hidden md:block'>
                <img
                    src={images.cloud}
                    alt='cloud'
                    className='h-full w-full -translate-x-[200px] translate-y-[80px] rotate-[10deg] object-cover opacity-70 lg:-translate-x-[60px] xl:translate-x-0 xl:translate-y-0 xl:rotate-0'
                />
                <img
                    src={images.rocket}
                    alt='rocket'
                    className='absolute left-0 top-1/2 w-[300px] -translate-y-[calc(50%-30px)] lg:left-[100px] lg:w-[340px] xl:left-[160px] xl:w-[380px]'
                />
            </div>

            <div className='absolute inset-0 flex items-center justify-center p-2 md:left-1/3'>
                <form
                    className='flex max-h-full max-w-full flex-col rounded-3xl bg-[#dee4f6] py-4 transition-all md:py-5 lg:py-[30px] dark:bg-[#3a3a3a]/80'
                    onSubmit={handleSubmit}
                >
                    <h3 className='mb-5 px-4 text-center text-[24px] font-semibold text-[#654dab] transition-all md:mb-7 md:px-10 lg:px-[60px] lg:text-[32px] dark:text-[#9b7cee]'>
                        Đăng nhập
                    </h3>

                    <div className='overflow-y-auto'>
                        <InputWithLabelAndError
                            title='Email'
                            error={formError.email}
                            name='email'
                            placeholder='abc@gmail.com'
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <InputWithLabelAndError
                            title='Mật khẩu'
                            error={formError.password}
                            type='password'
                            name='password'
                            placeholder='password'
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <div className='mx-4 mt-4 w-[400px] max-w-[calc(100%-32px)] md:mx-10 md:mt-6 md:max-w-[calc(100%-80px)] lg:mx-[60px] lg:max-w-[calc(100%-120px)]'>
                            <button
                                type='submit'
                                className='flex h-10 w-full max-w-full items-center justify-center rounded-lg bg-[#654dab] text-[14px] font-medium text-white transition-all hover:bg-[#654dab]/90 lg:h-11 lg:text-base dark:bg-[#9b7cee] dark:hover:bg-[#9b7cee]/90'
                            >
                                Đăng nhập
                            </button>
                        </div>

                        <p className='mt-4 flex flex-wrap items-center justify-center px-4 text-[13px] md:mt-6 md:px-10 md:text-[14px] lg:px-[60px]'>
                            <span className='text-center transition-all dark:text-white/70'>
                                Bạn chưa có tài khoản?
                            </span>
                            <Link
                                to={routes.register}
                                className='ml-1 text-center font-medium text-[#654dab] transition-all dark:text-[#9b7cee]'
                            >
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
