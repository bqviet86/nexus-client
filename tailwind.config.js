/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
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
        }
    },
    darkMode: 'class',
    plugins: [require('@savvywombat/tailwindcss-grid-areas')]
}
