import { useContext, useEffect, useRef, useState } from 'react'
import { MediaProviderInstance } from '@vidstack/react'

import { AppContext } from '~/contexts/appContext'

type UseVideoPlayerProps = {
    videoProviderRef: React.RefObject<MediaProviderInstance>
    options?: IntersectionObserverInit
}

function useVideoPlayer({
    videoProviderRef,
    options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    }
}: UseVideoPlayerProps) {
    const { onViewVideos, setOnViewVideos, playingVideo, setPlayingVideo, isUserPaused, setIsUserPaused } =
        useContext(AppContext)
    const [isOnView, setIsOnView] = useState<boolean>(false)

    const prevPlayingVideo = useRef<HTMLVideoElement | null>(null)

    useEffect(() => {
        const video = videoProviderRef.current?.el?.children[0] as HTMLVideoElement | undefined

        if (video) {
            const observer = new IntersectionObserver((entries) => setIsOnView(entries[0].isIntersecting), options)

            observer.observe(video)

            return () => observer.unobserve(video)
        }
    }, [videoProviderRef])

    const pauseVideo = (video: HTMLVideoElement) => {
        if (!video.paused) {
            video.pause()
            setIsUserPaused(false)
        }
    }

    useEffect(() => {
        const video = videoProviderRef.current?.el?.children[0] as HTMLVideoElement | undefined

        if (video) {
            const onPlayVideo = () => {
                onViewVideos.forEach((vid) => {
                    if (vid !== video) {
                        pauseVideo(vid)
                    }
                })
                setPlayingVideo(video)
            }
            const onPauseVideo = () => {
                if (isUserPaused) {
                    setPlayingVideo(null)
                }
                setIsUserPaused(true)
            }
            const onEndedVideo = () => {
                setPlayingVideo(null)
            }

            video.addEventListener('play', onPlayVideo)
            video.addEventListener('pause', onPauseVideo)
            video.addEventListener('ended', onEndedVideo)

            return () => {
                video.removeEventListener('play', onPlayVideo)
                video.removeEventListener('pause', onPauseVideo)
                video.removeEventListener('ended', onEndedVideo)
            }
        }
    }, [videoProviderRef, onViewVideos, isUserPaused])

    useEffect(() => {
        const video = videoProviderRef.current?.el?.children[0] as HTMLVideoElement | undefined

        if (video) {
            if (isOnView) {
                const playVideo = () => {
                    video
                        .play()
                        .then(() => {
                            setOnViewVideos((prevOnViewVideos) =>
                                !prevOnViewVideos.includes(video) ? [...prevOnViewVideos, video] : prevOnViewVideos
                            )
                        })
                        .catch(() => {})
                }

                video.addEventListener('loadeddata', playVideo)
                playVideo()

                return () => video.removeEventListener('loadeddata', playVideo)
            } else {
                pauseVideo(video)
                setOnViewVideos((prevOnViewVideos) => prevOnViewVideos.filter((vid) => vid !== video))
            }
        }
    }, [isOnView])

    useEffect(() => {
        const lastOnViewVideo = onViewVideos[onViewVideos.length - 1]
        const video = videoProviderRef.current?.el?.children[0] as HTMLVideoElement | undefined

        if (lastOnViewVideo) {
            if (lastOnViewVideo === video) {
                onViewVideos.forEach((vid) => {
                    if (vid !== lastOnViewVideo) {
                        pauseVideo(vid)
                    }
                })
            } else {
                lastOnViewVideo.play()
            }

            setPlayingVideo(lastOnViewVideo)
        } else {
            setPlayingVideo(null)
        }
    }, [onViewVideos])

    useEffect(() => {
        if (prevPlayingVideo.current) {
            pauseVideo(prevPlayingVideo.current)
        }

        prevPlayingVideo.current = playingVideo
    }, [playingVideo])
}

export default useVideoPlayer
