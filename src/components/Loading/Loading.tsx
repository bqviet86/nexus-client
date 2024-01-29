import { memo } from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

type LoadingProps = {
    className?: string
    loaderClassName?: string
}

function Loading({ className, loaderClassName }: LoadingProps) {
    return (
        <Spin
            className={className}
            indicator={
                <LoadingOutlined
                    spin
                    className={`!text-[24px] text-[#1d76d6] transition-all dark:text-white ${loaderClassName || ''}`}
                />
            }
        />
    )
}

export default memo(Loading)
