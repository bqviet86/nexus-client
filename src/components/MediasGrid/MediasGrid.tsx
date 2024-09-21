import { memo, useEffect, useRef, useState } from 'react'
import { Image as AntdImage } from 'antd'
import { MediaPlayer, MediaProvider, MediaProviderInstance } from '@vidstack/react'
import { PlyrControl, PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr'
import ColorThief from 'colorthief'

import Button from '~/components/Button'
import { envConfig } from '~/config'
import { MediaTypes } from '~/constants/enums'
import { MEDIAS_GRID_AREA, MEDIAS_GRID_TEMPLATE_AREAS, MEDIAS_MAX_LENGTH } from '~/constants/interfaceData'
import { useVideoPlayer } from '~/hooks'
import { Media, MediaWithFile } from '~/types/medias.types'
import '@vidstack/react/player/styles/base.css'
import '@vidstack/react/player/styles/plyr/theme.css'

type MediasGridProps = {
    mode?: 'edit' | 'display'
    medias: Media[]
    setMedias?: React.Dispatch<React.SetStateAction<(Media | MediaWithFile)[]>>
    handleUploadFile?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const defaultFunc = () => {}

function MediasGrid({
    mode = 'edit',
    medias,
    setMedias = defaultFunc,
    handleUploadFile = defaultFunc
}: MediasGridProps) {
    const mediasLength = medias.length

    const [bgColor, setBgColor] = useState<string>('black')
    const [isMobile, setIsMobile] = useState<boolean>(false)

    const mediasGridRef = useRef<HTMLDivElement>(null)
    const mediaProviderRef = useRef<MediaProviderInstance>(null)

    if (mode === 'display' && mediasLength === 1 && medias[0].type === MediaTypes.Video) {
        useVideoPlayer({
            videoProviderRef: mediaProviderRef,
            options: { root: null, rootMargin: '-60px 0px 0px', threshold: 0.5 }
        })
    }

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768)
        }

        window.addEventListener('resize', checkMobile)
        checkMobile()

        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleRemoveMedia = (index: number) => {
        setMedias((prevMedias) => {
            const newMedias = [...prevMedias]

            newMedias.splice(index, 1)
            return newMedias
        })
    }

    useEffect(() => {
        if (mode === 'edit') {
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
        }
    }, [])

    useEffect(() => {
        if (mode === 'display' && mediasLength === 1 && medias[0].type === MediaTypes.Image) {
            const colorThief = new ColorThief()
            const image = new Image()

            image.src = `${envConfig.imageUrlPrefix}/${medias[0].url}`
            image.crossOrigin = 'Anonymous' // Ensure the image can be accessed without CORS issues
            image.onload = () => {
                const dominantColor = colorThief.getColor(image)
                dominantColor && setBgColor(`rgb(${dominantColor.join(',')})`)
            }

            return () => {
                image.onload = null
            }
        }
    }, [])

    return (
        <>
            <div
                ref={mediasGridRef}
                className={`relative grid grid-cols-medias grid-rows-medias gap-0.5 overflow-hidden ${
                    MEDIAS_GRID_TEMPLATE_AREAS[mediasLength]
                } ${mediasLength === 1 ? 'max-h-[500px]' : 'aspect-[1]'}${mode === 'edit' ? ' rounded-lg' : ''}`}
            >
                {medias.map((media, index) => {
                    const isVidSmall =
                        ([3, 4].includes(mediasLength) && index !== 0) || mediasLength === MEDIAS_MAX_LENGTH

                    return (
                        <div
                            key={index}
                            className={`relative flex items-center justify-center ${MEDIAS_GRID_AREA[index + 1]}`}
                            style={{ backgroundColor: bgColor }}
                        >
                            {media.type === MediaTypes.Image ? (
                                <AntdImage
                                    src={
                                        media.url.includes('blob:') || media.url.includes(`${envConfig.imageUrlPrefix}`)
                                            ? media.url
                                            : `${envConfig.imageUrlPrefix}/${media.url}`
                                    }
                                    alt={`image-${index + 1}`}
                                    wrapperClassName='h-full w-full'
                                    className={`!h-full !w-full ${
                                        mode === 'display' && mediasLength === 1 ? 'object-contain' : 'object-cover'
                                    }`}
                                    preview
                                />
                            ) : media.url.endsWith('.m3u8') ? (
                                <MediaPlayer muted playsInline src={`${envConfig.videoUrlPrefix}/${media.url}`}>
                                    <MediaProvider ref={mediaProviderRef} />
                                    <PlyrLayout
                                        icons={plyrLayoutIcons}
                                        className='min-w-full [&>[class*="controls"]>[class*="volume"]]:max-w-max'
                                        displayDuration
                                        controls={[
                                            'play-large',
                                            'play',
                                            'progress',
                                            ...(isVidSmall ? [] : (['current-time'] as PlyrControl[])),
                                            ...(isMobile !== isVidSmall
                                                ? (['mute'] as PlyrControl[])
                                                : isMobile
                                                  ? []
                                                  : (['mute+volume'] as PlyrControl[])),
                                            'settings',
                                            'fullscreen'
                                        ]}
                                    />
                                </MediaPlayer>
                            ) : (
                                <video
                                    controls
                                    loop
                                    playsInline
                                    className='h-full w-full'
                                    style={{ objectFit: 'cover' }}
                                >
                                    <source src={`${media.url}#t=0.1`} type='video/mp4' />
                                </video>
                            )}

                            {mode === 'edit' && (
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
                            )}
                        </div>
                    )
                })}
            </div>

            {mode === 'edit' && medias.length < MEDIAS_MAX_LENGTH && (
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
                    <label className='absolute inset-0 cursor-pointer'>
                        <input
                            type='file'
                            multiple
                            accept='image/*, video/*'
                            className='invisible h-0 w-0'
                            onChange={handleUploadFile}
                        />
                    </label>
                </Button>
            )}
        </>
    )
}

export default memo(MediasGrid)
