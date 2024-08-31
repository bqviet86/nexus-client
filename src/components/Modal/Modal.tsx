import { Modal as AntdModal } from 'antd'
import { ModalProps } from 'antd/lib/modal'
import { isMobile } from 'react-device-detect'

function Modal({ dating = false, ...props }: ModalProps & { dating?: boolean }) {
    return (
        <AntdModal
            centered
            closeIcon={
                <svg
                    className='h-full w-full'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                >
                    <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z' />
                </svg>
            }
            {...(dating ? { wrapClassName: 'mx-auto h-screen aspect-[9/16] max-w-full' } : {})}
            okButtonProps={{
                className: `dark:shadow-[0_2px_0_rgb(0,0,0,0.1)] ${
                    dating ? 'bg-teal-500 hover:!bg-teal-500/80' : 'bg-[#007bff] hover:!bg-[#2997ff]'
                }`
            }}
            cancelButtonProps={{
                className: dating
                    ? 'border-[#e4e6eb] hover:!text-teal-500 hover:!border-teal-500'
                    : 'border-[#d9d9d9] hover:!text-[#2997ff] hover:!border-[#2997ff]'
            }}
            {...props}
            className={`[&_.ant-modal-close]:right-3 [&_.ant-modal-close]:top-3 [&_.ant-modal-close]:h-[26px] [&_.ant-modal-close]:w-[26px] [&_.ant-modal-close]:hover:bg-transparent [&_.ant-modal-content]:p-2 [&_.ant-modal-header]:mb-3 [&_.ant-modal-header]:mt-1 [&_.ant-modal-header]:text-center [&_.ant-modal-title]:text-xl ${
                dating
                    ? '!w-[calc(100%-32px)]'
                    : 'sm:[&_.ant-modal-close]:right-[18px] sm:[&_.ant-modal-close]:top-[18px] sm:[&_.ant-modal-close]:h-6 sm:[&_.ant-modal-close]:w-6 sm:[&_.ant-modal-content]:p-4 sm:[&_.ant-modal-header]:mb-4 sm:[&_.ant-modal-header]:mt-0'
            } ${props.className || ''}`}
            afterOpenChange={(visible) =>
                document.documentElement.classList.toggle('overflow-y-hidden', visible && isMobile)
            }
        >
            <div className='border-t border-solid border-black/20 dark:border-white/20'>{props.children}</div>
        </AntdModal>
    )
}

export default Modal
