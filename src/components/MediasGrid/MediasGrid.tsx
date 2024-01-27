import { memo, useEffect, useRef } from 'react'
import { Image } from 'antd'

import Button from '~/components/Button'
import { MediaTypes } from '~/constants/enums'
import { MEDIAS_GRID_AREA, MEDIAS_GRID_TEMPLATE_AREAS, MEDIAS_MAX_LENGTH } from '~/constants/interfaceData'
import { MediaWithFile } from '~/types/medias.types'

type MediasGridProps = {
    medias: MediaWithFile[]
    setMedias: React.Dispatch<React.SetStateAction<MediaWithFile[]>>
    handleUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function MediasGrid({ medias, setMedias, handleUploadFile }: MediasGridProps) {
    const mediasLength = medias.length

    const mediasGridRef = useRef<HTMLDivElement>(null)

    const handleRemoveMedia = (index: number) => {
        setMedias((prevMedias) => {
            const newMedias = [...prevMedias]

            newMedias.splice(index, 1)
            return newMedias
        })
    }

    useEffect(() => {
        const handleFullScreenChange = () => {
            if (document.fullscreenElement) {
                document.fullscreenElement.setAttribute('style', 'object-fit: contain')
                return
            }

            const videoElements = mediasGridRef.current?.querySelectorAll('video')

            videoElements?.forEach((video) => {
                video.setAttribute('style', 'object-fit: cover')
            })
        }

        document.addEventListener('fullscreenchange', handleFullScreenChange)

        return () => document.removeEventListener('fullscreenchange', handleFullScreenChange)
    }, [])

    return (
        <>
            <div
                ref={mediasGridRef}
                className={`relative grid aspect-[1] grid-cols-medias grid-rows-medias gap-0.5 overflow-hidden rounded-lg ${MEDIAS_GRID_TEMPLATE_AREAS[mediasLength]}`}
            >
                {medias.map((media, index) => (
                    <div
                        key={index}
                        className={`relative flex items-center justify-center ${MEDIAS_GRID_AREA[index + 1]}`}
                    >
                        {media.type === MediaTypes.Image ? (
                            <Image
                                src={media.url}
                                alt={`image-${index + 1}`}
                                wrapperClassName='h-full w-full'
                                className='!h-full !w-full object-cover'
                                preview
                            />
                        ) : (
                            <video controls loop playsInline className='h-full w-full' style={{ objectFit: 'cover' }}>
                                <source src={`${media.url}#t=0.1`} type='video/mp4' />
                            </video>
                        )}

                        <div
                            className='absolute right-2 top-2 h-5 w-5 cursor-pointer'
                            onClick={() => handleRemoveMedia(index)}
                        >
                            <div className='h-full w-full rounded-full bg-[#eee]'>
                                <svg
                                    className='absolute text-[#7c7e80] transition-all hover:text-[#a7a5a5]'
                                    aria-hidden='true'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='currentColor'
                                    viewBox='0 0 20 20'
                                >
                                    <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z' />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {medias.length < MEDIAS_MAX_LENGTH && (
                <Button
                    icon={
                        <svg
                            className='h-[14px] w-[14px] text-[#65676b] dark:text-[#b0b3b8]'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='currentColor'
                            viewBox='0 0 20 18'
                        >
                            <path d='M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z' />
                        </svg>
                    }
                    className='relative mt-1.5 w-full !bg-[#e4e6e9] hover:!bg-[#cdced1] dark:!bg-[#212223] dark:hover:!bg-[#4e4f50]'
                >
                    Thêm ảnh/video
                    <label htmlFor='upload-file2' className='absolute inset-0 cursor-pointer' />
                    <input
                        id='upload-file2'
                        type='file'
                        multiple
                        accept='image/*, video/*'
                        className='invisible h-0 w-0'
                        onChange={handleUploadFile}
                    />
                </Button>
            )}
        </>
    )
}

export default memo(MediasGrid)
