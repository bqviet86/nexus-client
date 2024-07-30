import { memo } from 'react'
import { Image } from 'antd'
import { nanoid } from 'nanoid'

import { envConfig } from '~/config'
import { Media } from '~/types/medias.types'

type ProfileImageListProps = {
    images: Media[]
}

function ProfileImageList({ images }: ProfileImageListProps) {
    return (
        <div className='rounded-lg bg-white p-3 transition-all sm:p-4 dark:bg-[#242526]'>
            <h3 className='text-xl font-semibold transition-all sm:text-2xl dark:text-[#e4e6eb]'>Ảnh</h3>

            <div className='mt-2'>
                {images.length ? (
                    <div className=' flex flex-wrap overflow-hidden rounded-lg [&_.ant-image:nth-child(3n+2)]:mx-1 [&_.ant-image:nth-child(n+4)]:mt-1'>
                        {images.map((image) => (
                            <Image
                                key={nanoid()}
                                src={`${envConfig.imageUrlPrefix}/${image.url}`}
                                alt={image.url}
                                wrapperClassName='w-[calc((100%-8px)/3)] aspect-[1]'
                                className='!h-full !w-full object-cover'
                                preview
                            />
                        ))}
                    </div>
                ) : (
                    <p className='text-center transition-all dark:text-[#e4e6eb]'>Không có ảnh nào</p>
                )}
            </div>
        </div>
    )
}

export default memo(ProfileImageList)
