import { memo, useCallback, useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import { Image as AntdImage } from 'antd'
import { MediaPlayer, MediaProvider, MediaProviderInstance } from '@vidstack/react'
import { PlyrControl, PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr'
import ColorThief from 'colorthief'
import { differenceBy } from 'lodash'

import Button from '~/components/Button'
import Loading from '~/components/Loading'
import { envConfig } from '~/config'
import { MediaLayout, MediaTypes } from '~/constants/enums'
import {
    MEDIAS_GRID_AREA,
    MEDIAS_GRID_TEMPLATE_HORIZONTAL,
    MEDIAS_GRID_TEMPLATE_HORIZONTAL_BALANCED,
    MEDIAS_GRID_TEMPLATE_VERTICAL,
    MEDIAS_GRID_TEMPLATE_VERTICAL_BALANCED,
    MEDIAS_MAX_LENGTH
} from '~/constants/interfaceData'
import { useVideoPlayer } from '~/hooks'
import { Media, MediaWithFile, MediaWithSize } from '~/types/medias.types'
import '@vidstack/react/player/styles/base.css'
import '@vidstack/react/player/styles/plyr/theme.css'

type MediasGridProps = {
    mode?: 'edit' | 'display'
    medias: Media[]
    setMedias?: React.Dispatch<React.SetStateAction<(Media | MediaWithFile)[]>>
    handleUploadFile?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

type MediasGridLayout = 'vertical' | 'horizontal' | 'vertical-balanced' | 'horizontal-balanced'

const defaultFunc = () => {}

function MediasGrid({
    mode = 'edit',
    medias,
    setMedias = defaultFunc,
    handleUploadFile = defaultFunc
}: MediasGridProps) {
    const mediasLength = medias.length

    const [mediaList, setMediaList] = useState<MediaWithSize[]>([])
    const [gridLayout, setGridLayout] = useState<MediasGridLayout>('vertical')
    const [gridAspectRatio, setGridAspectRatio] = useState<string>('')
    const [isMobile, setIsMobile] = useState<boolean>(false)
    const [bgColor, setBgColor] = useState<string>('black')
    const [mediaProviderRefState, setMediaProviderRefState] = useState<React.RefObject<MediaProviderInstance>>({
        current: null
    })

    const mediasGridRef = useRef<HTMLDivElement>(null)
    const mediaProviderRef = useRef<MediaProviderInstance>(null)

    if (mode === 'display' && mediasLength === 1 && medias[0].type === MediaTypes.Video) {
        useVideoPlayer({
            videoProviderRef: mediaProviderRefState,
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

    const checkRatioIsBalanced = (ratio: number, [min, max]: [number, number] = [0.8, 1.2]): boolean => {
        return min <= ratio && ratio <= max
    }

    const handleSetGridLayout = (mediaWithSizes: MediaWithSize[]): MediasGridLayout => {
        const mediasLength = mediaWithSizes.length
        const verticalLength = mediaWithSizes.filter(({ layout }) => layout === MediaLayout.Vertical).length
        const horizontalLength = mediasLength - verticalLength

        switch (mediasLength) {
            case 1:
            case 5:
                return horizontalLength > verticalLength ? 'horizontal' : 'vertical'
            case 2:
                return horizontalLength > verticalLength &&
                    !mediaWithSizes.every(({ aspectRatio }) => checkRatioIsBalanced(aspectRatio))
                    ? 'horizontal'
                    : 'vertical'
            case 3: {
                const { aspectRatio: firstRatio, layout: firstLayout } = mediaWithSizes[0]
                const mediasRest = mediaWithSizes.slice(1)

                if (
                    !checkRatioIsBalanced(firstRatio) &&
                    mediasRest.some(({ aspectRatio, layout }) => aspectRatio === 1 || layout !== firstLayout)
                ) {
                    return `${firstLayout}-balanced`
                }

                return firstLayout
            }
            case 4:
                return mediaWithSizes[0].layout
            default:
                return 'vertical'
        }
    }

    const handleSetGridAspectRatio = (mediaWithSizes: MediaWithSize[]): string => {
        const mediasLength = mediaWithSizes.length

        if (mediasLength === 1) {
            const { type, aspectRatio } = mediaWithSizes[0]

            if (aspectRatio < 3 / 4) return type === MediaTypes.Image ? 'aspect-[3/4]' : 'aspect-[4/3]'

            if (aspectRatio > 3) return 'aspect-[3]'

            return ''
        }

        if (mediasLength === 2) {
            const { aspectRatio: ratio1, layout: layout1 } = mediaWithSizes[0]
            const { aspectRatio: ratio2, layout: layout2 } = mediaWithSizes[1]

            if (ratio1 > 3 && ratio2 > 3) return 'aspect-[3/2]'

            const isRatio1Balanced = checkRatioIsBalanced(ratio1)
            const isRatio2Balanced = checkRatioIsBalanced(ratio2)

            if (
                layout1 !== layout2 ||
                (isRatio1Balanced && isRatio2Balanced) ||
                (layout1 === MediaLayout.Vertical && (isRatio1Balanced || isRatio2Balanced))
            )
                return 'aspect-[2]'
        }

        return 'aspect-[1]'
    }

    useEffect(() => {
        if (medias.length <= mediaList.length) return

        const mediaListTemp: MediaWithSize[] = [...mediaList]
        const addedMedias = differenceBy(medias, mediaList, 'url')
        const mediaInstances: (HTMLImageElement | HTMLVideoElement)[] = []
        const hlsInstances: Hls[] = []

        const handleLoadMedia = ({
            currentMedia,
            currentMediaInstance
        }: {
            currentMedia: Media
            currentMediaInstance: HTMLImageElement | HTMLVideoElement
        }) => {
            const width =
                currentMediaInstance instanceof HTMLImageElement
                    ? currentMediaInstance.width
                    : currentMediaInstance.videoWidth
            const height =
                currentMediaInstance instanceof HTMLImageElement
                    ? currentMediaInstance.height
                    : currentMediaInstance.videoHeight
            const aspectRatio = Number((width / height).toFixed(2))

            mediaListTemp.push({
                ...currentMedia,
                width,
                height,
                aspectRatio,
                layout: width > height ? MediaLayout.Horizontal : MediaLayout.Vertical
            })

            if (mediaListTemp.length === medias.length) {
                const newMediaList = medias.map(
                    (media) => mediaListTemp.find((mediaWithSize) => mediaWithSize.url === media.url) as MediaWithSize
                )

                setMediaList(newMediaList)
                setGridLayout(handleSetGridLayout(newMediaList))
                setGridAspectRatio(handleSetGridAspectRatio(newMediaList))
            }
        }

        for (const media of medias) {
            if (!addedMedias.includes(media)) continue

            const { url, type } = media

            if (type === MediaTypes.Image) {
                const image = new Image()

                mediaInstances.push(image)
                image.src =
                    url.includes('blob:') || url.includes(`${envConfig.imageUrlPrefix}`)
                        ? url
                        : `${envConfig.imageUrlPrefix}/${url}`
                image.onload = () => {
                    handleLoadMedia({
                        currentMedia: media,
                        currentMediaInstance: image
                    })
                }

                continue
            }

            const video = document.createElement('video')

            mediaInstances.push(video)

            if (Hls.isSupported() && url.endsWith('.m3u8')) {
                const hls = new Hls()

                hlsInstances.push(hls)
                hls.loadSource(`${envConfig.videoUrlPrefix}/${url}`)
                hls.attachMedia(video)
            } else {
                video.src = `${url}#t=0.1`
            }

            video.onloadedmetadata = () => {
                handleLoadMedia({
                    currentMedia: media,
                    currentMediaInstance: video
                })
            }
        }

        return () => {
            mediaInstances.forEach((mediaInstance) => {
                mediaInstance.onload = null
                mediaInstance.onloadedmetadata = null
            })
            hlsInstances.forEach((hlsInstance) => hlsInstance.destroy())
        }
    }, [medias])

    const handleRemoveMedia = (index: number) => {
        setMedias(differenceBy(medias, [medias[index]], 'url'))

        const newMediaList = differenceBy(mediaList, [mediaList[index]])

        setMediaList(newMediaList)
        setGridLayout(handleSetGridLayout(newMediaList))
        setGridAspectRatio(handleSetGridAspectRatio(newMediaList))
    }

    const getGridLayoutClassName = useCallback((): string => {
        switch (gridLayout) {
            case 'vertical':
                return MEDIAS_GRID_TEMPLATE_VERTICAL[mediasLength]
            case 'horizontal':
                return MEDIAS_GRID_TEMPLATE_HORIZONTAL[mediasLength]
            case 'vertical-balanced':
                return MEDIAS_GRID_TEMPLATE_VERTICAL_BALANCED[mediasLength]
            case 'horizontal-balanced':
                return MEDIAS_GRID_TEMPLATE_HORIZONTAL_BALANCED[mediasLength]
        }
    }, [gridLayout, mediasLength])

    useEffect(() => {
        if (
            mode === 'display' &&
            mediasLength === 1 &&
            medias[0].type === MediaTypes.Video &&
            mediaList.length &&
            mediaProviderRef.current
        )
            setMediaProviderRefState(mediaProviderRef)
    }, [mediaList])

    useEffect(() => {
        if (mode === 'edit' && mediaList.length) {
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
    }, [mediaList])

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
            {mediaList.length ? (
                <div
                    ref={mediasGridRef}
                    className={`relative grid gap-0.5 overflow-hidden rounded-lg ${getGridLayoutClassName()}${
                        gridAspectRatio && ' ' + gridAspectRatio
                    }${mode === 'edit' ? ' w-[500px] max-w-full' : ''}`}
                >
                    {mediaList.map((media, index) => {
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
                                            media.url.includes('blob:') ||
                                            media.url.includes(`${envConfig.imageUrlPrefix}`)
                                                ? media.url
                                                : `${envConfig.imageUrlPrefix}/${media.url}`
                                        }
                                        alt={`image-${index + 1}`}
                                        wrapperClassName='h-full w-full'
                                        className={`m-auto !h-full max-w-full object-cover ${
                                            mediasLength === 1 && media.aspectRatio < 2 ? '!w-[500px]' : '!w-full'
                                        }`}
                                        preview
                                    />
                                ) : media.url.endsWith('.m3u8') ? (
                                    <MediaPlayer
                                        muted
                                        playsInline
                                        src={`${envConfig.videoUrlPrefix}/${media.url}`}
                                        className='h-full'
                                    >
                                        <MediaProvider ref={mediaProviderRef} className='[&>video]:h-full' />
                                        <PlyrLayout
                                            icons={plyrLayoutIcons}
                                            className='min-w-full [&>[class*="controls"]>[class*="volume"]]:max-w-max [&>[class*="controls"]]:pt-2.5'
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
            ) : (
                <Loading className='h-full w-full py-2' loaderClassName='!text-[#65676b] dark:!text-[#e4e6eb]' />
            )}

            {mode === 'edit' && mediasLength < MEDIAS_MAX_LENGTH && (
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
                    className='relative mt-1.5 w-[500px] max-w-full !bg-[#e4e6e9] hover:!bg-[#cdced1] dark:!bg-[#212223] dark:hover:!bg-[#4e4f50]'
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
