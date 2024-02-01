/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            keyframes: {
                fadeIn: {
                    '0%': {
                        opacity: 0,
                        visibility: 'hidden'
                    },
                    '100%': {
                        opacity: 1,
                        visibility: 'visible'
                    }
                }
            },
            animation: {
                fadeIn: 'fadeIn 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
            },
            gridTemplateColumns: {
                medias: 'repeat(6, 1fr)'
            },
            gridTemplateRows: {
                medias: 'repeat(6, 1fr)'
            },
            gridTemplateAreas: {
                'medias-1': [
                    'media-1 media-1 media-1 media-1 media-1 media-1',
                    'media-1 media-1 media-1 media-1 media-1 media-1',
                    'media-1 media-1 media-1 media-1 media-1 media-1',
                    'media-1 media-1 media-1 media-1 media-1 media-1',
                    'media-1 media-1 media-1 media-1 media-1 media-1',
                    'media-1 media-1 media-1 media-1 media-1 media-1'
                ],
                'medias-2': [
                    'media-1 media-1 media-1 media-1 media-1 media-1',
                    'media-1 media-1 media-1 media-1 media-1 media-1',
                    'media-1 media-1 media-1 media-1 media-1 media-1',
                    'media-2 media-2 media-2 media-2 media-2 media-2',
                    'media-2 media-2 media-2 media-2 media-2 media-2',
                    'media-2 media-2 media-2 media-2 media-2 media-2'
                ],
                'medias-3': [
                    'media-1 media-1 media-1 media-1 media-1 media-1',
                    'media-1 media-1 media-1 media-1 media-1 media-1',
                    'media-1 media-1 media-1 media-1 media-1 media-1',
                    'media-1 media-1 media-1 media-1 media-1 media-1',
                    'media-2 media-2 media-2 media-3 media-3 media-3',
                    'media-2 media-2 media-2 media-3 media-3 media-3'
                ],
                'medias-4': [
                    'media-1 media-1 media-1 media-1 media-1 media-1',
                    'media-1 media-1 media-1 media-1 media-1 media-1',
                    'media-1 media-1 media-1 media-1 media-1 media-1',
                    'media-1 media-1 media-1 media-1 media-1 media-1',
                    'media-2 media-2 media-3 media-3 media-4 media-4',
                    'media-2 media-2 media-3 media-3 media-4 media-4'
                ],
                'medias-5': [
                    'media-1 media-1 media-1 media-3 media-3 media-3',
                    'media-1 media-1 media-1 media-3 media-3 media-3',
                    'media-1 media-1 media-1 media-4 media-4 media-4',
                    'media-2 media-2 media-2 media-4 media-4 media-4',
                    'media-2 media-2 media-2 media-5 media-5 media-5',
                    'media-2 media-2 media-2 media-5 media-5 media-5'
                ]
            }
        },
        screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            'lg-xl': '1200px',
            xl: '1280px',
            '2xl': '1536px'
        }
    },
    darkMode: 'class',
    plugins: [require('@savvywombat/tailwindcss-grid-areas')]
}
