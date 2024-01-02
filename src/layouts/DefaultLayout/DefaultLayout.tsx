import Header from '../components/Header'

function DefaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className='mx-auto max-w-7xl'>{children}</main>
        </>
    )
}

export default DefaultLayout
