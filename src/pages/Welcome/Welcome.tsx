import { useNavigate } from 'react-router-dom'

import images from '~/assets/images'
import { routes } from '~/config'

function Welcome() {
    const navigate = useNavigate()

    return (
        <div className='fixed inset-x-0 h-[calc(100vh-60px)]'>
            <img
                src={images.cloud_space}
                alt='cloud_space'
                className='absolute left-0 top-0 h-full w-full object-cover transition-all dark:opacity-0'
            />
            <img
                src={images.space}
                alt='space'
                className='absolute left-0 top-0 h-full w-full object-cover opacity-0 transition-all dark:opacity-[1]'
            />

            <div className='absolute left-0 top-1/2 z-30 flex h-[80%] max-w-[400px] -translate-y-1/2 flex-col justify-between p-2 sm:h-[90%] sm:max-w-[460px] sm:pl-10 md:max-w-[500px] md:pl-16'>
                <div>
                    <h2 className='text-[40px] font-medium transition-all sm:text-[60px] md:text-[80px] dark:text-[#7dd3fc]'>
                        Nexus
                    </h2>
                    <p className='text-[20px] font-light italic text-pink-600 sm:text-[32px] md:text-[40px]'>
                        Chào mừng bạn đến với Nexus
                    </p>
                </div>

                <div>
                    <h4 className='my-1 text-xl font-medium transition-all sm:my-2 sm:text-[24px] md:my-3 md:text-[32px] dark:text-[#e4e6eb]'>
                        Lorem
                    </h4>
                    <p className='text-[13px] transition-all sm:text-base md:text-[18px] dark:text-[#e4e6eb]'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius sit, laudantium cupiditate esse
                        animi ab ex, iure eveniet provident facilis, similique dignissimos fuga. Nam ex at ipsum quae
                        placeat voluptates.
                    </p>

                    <div className='mt-5 flex'>
                        <button
                            className='rounded-xl bg-gradient-to-bl from-[#07a787] to-[#2979ff] px-2.5 py-2 font-medium transition-all hover:text-white sm:px-4 sm:py-2 sm:text-[18px] dark:text-[#e4e6eb]'
                            onClick={() => navigate(routes.login)}
                        >
                            Đăng nhập
                        </button>
                        <button
                            className='ml-2.5 rounded-xl bg-gradient-to-bl from-[#07a787] to-[#2979ff] px-2.5 py-2 font-medium transition-all hover:text-white sm:ml-4 sm:px-4 sm:py-2 sm:text-[18px] dark:text-[#e4e6eb]'
                            onClick={() => navigate(routes.register)}
                        >
                            Đăng ký
                        </button>
                    </div>
                </div>
            </div>

            <div className='fixed inset-y-0 right-0'>
                <img src={images.spaceship} alt='spaceship' className='h-full w-full object-contain' />
            </div>
        </div>
    )
}

export default Welcome
