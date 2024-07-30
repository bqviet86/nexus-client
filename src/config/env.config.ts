const envConfig = {
    apiUrl: import.meta.env.VITE_API_URL as string,

    imageUrlPrefix: import.meta.env.VITE_IMAGE_URL_PREFIX as string,
    videoUrlPrefix: import.meta.env.VITE_VIDEO_URL_PREFIX as string
}

export default envConfig
