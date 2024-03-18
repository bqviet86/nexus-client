import Header from '../components/Header'

function FullScreenLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className='mt-[60px] box-content min-h-[calc(100vh-60px)] px-2'>{children}</main>
        </>
    )
}

export default FullScreenLayout
