import DatingHeader from '../components/DatingHeader'

type DatingNoFooterLayoutProps = {
    backBtn?: boolean
    linkLogo?: boolean
    children: React.ReactNode
}

function DatingNoFooterLayout({ backBtn = true, linkLogo = true, children }: DatingNoFooterLayoutProps) {
    return (
        <main className='h-screen w-screen bg-[#0f0f0f]'>
            <div className='relative m-auto aspect-[9/16] h-screen max-w-full overflow-hidden bg-[#2e2b2e] text-[#e4e6eb]'>
                <DatingHeader backBtn={backBtn} linkLogo={linkLogo} />

                <div className='mt-14 h-[calc(100%-56px)] overflow-y-auto overflow-x-hidden px-4 py-2 [&::-webkit-scrollbar-track]:!bg-transparent'>
                    {children}
                </div>
            </div>
        </main>
    )
}

export default DatingNoFooterLayout
