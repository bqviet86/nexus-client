import CreatePost from '~/components/CreatePost'
import PostList from '~/components/PostList'
import FriendRequest from '~/components/FriendRequest'
import FriendSuggestion from '~/components/FriendSuggestion'

function Home() {
    return (
        <div className='-mx-2.5 flex justify-center py-5'>
            <div className='flex max-w-full items-start md:w-[840px] lg-xl:w-full'>
                <div className='sticky top-20 mx-2.5 hidden h-[500px] w-[calc(25%-20px)] rounded-lg bg-white transition-all lg-xl:block dark:bg-[#242526]'></div>

                <div className='mx-2.5 flex w-[600px] flex-col gap-5 md:w-[calc(100%-300px-20px)] lg-xl:w-[calc(50%-20px)]'>
                    <CreatePost />
                    <PostList />
                </div>

                <div className='sticky top-20 mx-2.5 hidden h-[calc(100vh-100px)] w-[calc(300px-20px)] gap-5 md:flex md:flex-col lg-xl:w-[calc(25%-20px)]'>
                    <FriendRequest />
                    <FriendSuggestion />
                </div>
            </div>
        </div>
    )
}

export default Home
