import { ThemeConfig } from 'antd'

const lightThemeConfig: ThemeConfig = {
    token: {
        fontFamily: 'Poppins, IBM Plex Sans, sans-serif',
        colorPrimary: '#007bff',
        colorTextBase: '#333'
    }
}

const darkThemeConfig: ThemeConfig = {
    token: {
        fontFamily: 'Poppins, IBM Plex Sans, sans-serif',
        colorPrimary: '#9b7cee',
        colorBgBase: '#272829',
        colorTextBase: '#e4e6eb'
    },
    components: {
        Radio: {
            colorBgBase: '#e4e6eb',
            algorithm: true
        },
        DatePicker: {
            colorTextDisabled: '#9ca3afb3',
            algorithm: true
        }
    }
}

const theme: Record<'light' | 'dark', ThemeConfig> = {
    light: lightThemeConfig,
    dark: darkThemeConfig
}

export default theme
