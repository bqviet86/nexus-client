function DatingNoHeaderFooterLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className='h-screen w-screen bg-[#0f0f0f]'>
            <div className='relative m-auto aspect-[9/16] h-screen max-w-full overflow-hidden bg-[#2e2b2e] text-[#e4e6eb]'>
                <div className='h-full overflow-y-auto overflow-x-hidden p-4 [&::-webkit-scrollbar-track]:!bg-transparent'>
                    {children}
                </div>
            </div>
        </main>
    )
}

export default DatingNoHeaderFooterLayout
