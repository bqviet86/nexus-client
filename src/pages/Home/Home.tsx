import CreatePost from '~/components/CreatePost'

function Home() {
    return (
        <div className='flex justify-center px-2 pt-5 lg:-mx-2.5'>
            <div className='mx-2.5 hidden h-[500px] w-[calc(25%-20px)] bg-white transition-all lg:block dark:bg-[#242526]'></div>
            <div className='flex h-[500px] w-[640px] flex-col lg:mx-2.5 lg:w-[calc(50%-20px)]'>
                <CreatePost />
            </div>
            <div className='mx-2.5 hidden h-[500px] w-[calc(25%-20px)] bg-white transition-all lg:block dark:bg-[#242526]'></div>
        </div>
    )
}

export default Home
