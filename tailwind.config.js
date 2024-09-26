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
                'vertical-medias-1': 'repeat(2, 1fr)',
                'vertical-medias-2': 'repeat(4, 1fr)',
                'vertical-medias-3': 'repeat(6, 1fr)',
                'vertical-medias-4': 'repeat(6, 1fr)',
                'vertical-medias-5': 'repeat(6, 1fr)',

                'vertical-balance-medias-3': 'repeat(4, 1fr)',

                'horizontal-medias-1': 'repeat(2, 1fr)',
                'horizontal-medias-2': 'repeat(2, 1fr)',
                'horizontal-medias-3': 'repeat(4, 1fr)',
                'horizontal-medias-4': 'repeat(6, 1fr)',
                'horizontal-medias-5': 'repeat(5, 1fr)',

                'horizontal-balance-medias-3': 'repeat(4, 1fr)'
            },
            gridTemplateRows: {
                'vertical-medias-1': 'repeat(2, 1fr)',
                'vertical-medias-2': 'repeat(2, 1fr)',
                'vertical-medias-3': 'repeat(4, 1fr)',
                'vertical-medias-4': 'repeat(6, 1fr)',
                'vertical-medias-5': 'repeat(5, 1fr)',

                'vertical-balance-medias-3': 'repeat(4, 1fr)',

                'horizontal-medias-1': 'repeat(2, 1fr)',
                'horizontal-medias-2': 'repeat(4, 1fr)',
                'horizontal-medias-3': 'repeat(6, 1fr)',
                'horizontal-medias-4': 'repeat(6, 1fr)',
                'horizontal-medias-5': 'repeat(6, 1fr)',

                'horizontal-balance-medias-3': 'repeat(4, 1fr)'
            },
            gridTemplateAreas: {
                'vertical-medias-1': ['m-1 m-1', 'm-1 m-1'],
                'vertical-medias-2': ['m-1 m-1 m-2 m-2', 'm-1 m-1 m-2 m-2'],
                'vertical-medias-3': [
                    'm-1 m-1 m-1 m-1 m-2 m-2',
                    'm-1 m-1 m-1 m-1 m-2 m-2',
                    'm-1 m-1 m-1 m-1 m-3 m-3',
                    'm-1 m-1 m-1 m-1 m-3 m-3'
                ],
                'vertical-medias-4': [
                    'm-1 m-1 m-1 m-1 m-2 m-2',
                    'm-1 m-1 m-1 m-1 m-2 m-2',
                    'm-1 m-1 m-1 m-1 m-3 m-3',
                    'm-1 m-1 m-1 m-1 m-3 m-3',
                    'm-1 m-1 m-1 m-1 m-4 m-4',
                    'm-1 m-1 m-1 m-1 m-4 m-4'
                ],
                'vertical-medias-5': [
                    'm-1 m-1 m-1 m-2 m-2 m-2',
                    'm-1 m-1 m-1 m-2 m-2 m-2',
                    'm-1 m-1 m-1 m-2 m-2 m-2',
                    'm-3 m-3 m-4 m-4 m-5 m-5',
                    'm-3 m-3 m-4 m-4 m-5 m-5'
                ],

                'vertical-balance-medias-3': [
                    'm-1 m-1 m-2 m-2',
                    'm-1 m-1 m-2 m-2',
                    'm-1 m-1 m-3 m-3',
                    'm-1 m-1 m-3 m-3'
                ],

                'horizontal-medias-1': ['m-1 m-1', 'm-1 m-1'],
                'horizontal-medias-2': ['m-1 m-1', 'm-1 m-1', 'm-2 m-2', 'm-2 m-2'],
                'horizontal-medias-3': [
                    'm-1 m-1 m-1 m-1',
                    'm-1 m-1 m-1 m-1',
                    'm-1 m-1 m-1 m-1',
                    'm-1 m-1 m-1 m-1',
                    'm-2 m-2 m-3 m-3',
                    'm-2 m-2 m-3 m-3'
                ],
                'horizontal-medias-4': [
                    'm-1 m-1 m-1 m-1 m-1 m-1',
                    'm-1 m-1 m-1 m-1 m-1 m-1',
                    'm-1 m-1 m-1 m-1 m-1 m-1',
                    'm-1 m-1 m-1 m-1 m-1 m-1',
                    'm-2 m-2 m-3 m-3 m-4 m-4',
                    'm-2 m-2 m-3 m-3 m-4 m-4'
                ],
                'horizontal-medias-5': [
                    'm-1 m-1 m-1 m-3 m-3',
                    'm-1 m-1 m-1 m-3 m-3',
                    'm-1 m-1 m-1 m-4 m-4',
                    'm-2 m-2 m-2 m-4 m-4',
                    'm-2 m-2 m-2 m-5 m-5',
                    'm-2 m-2 m-2 m-5 m-5'
                ],

                'horizontal-balance-medias-3': [
                    'm-1 m-1 m-1 m-1',
                    'm-1 m-1 m-1 m-1',
                    'm-2 m-2 m-3 m-3',
                    'm-2 m-2 m-3 m-3'
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
