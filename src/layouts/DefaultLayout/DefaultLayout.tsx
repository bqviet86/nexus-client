import Footer from '../components/Footer'
import Header from '../components/Header'

function DefaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    )
}

export default DefaultLayout
