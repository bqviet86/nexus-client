import CreatePost from '~/components/CreatePost'
import FriendRequest from '~/components/FriendRequest'

function Home() {
    return (
        <div className='-mx-2.5 flex justify-center pt-5'>
            <div className='flex max-w-full items-start md:w-[840px] lg-xl:w-full'>
                <div className='sticky top-20 mx-2.5 hidden h-[500px] w-[calc(25%-20px)] rounded-lg bg-white transition-all lg-xl:block dark:bg-[#242526]'></div>

                <div className='mx-2.5 flex w-[600px] flex-col md:w-[calc(100%-300px-20px)] lg-xl:w-[calc(50%-20px)]'>
                    <CreatePost />
                </div>

                <div className='sticky top-20 mx-2.5 hidden w-[calc(300px-20px)] md:block lg-xl:w-[calc(25%-20px)]'>
                    <FriendRequest />
                </div>
            </div>
        </div>
    )
}

export default Home
