import { routes as routesConfig } from '~/config'
import DefaultLayout from '~/layouts'

import Home from '~/pages/Home'
import Welcome from '~/pages/Welcome'
import Login from '~/pages/Login'
import Register from '~/pages/Register'
import Chat from '~/pages/Chat'
import Profile from '~/pages/Profile'
import UpdateProfile from '~/pages/UpdateProfile'
import PostDetail from '~/pages/PostDetail'
import HashTag from '~/pages/HashTag'

// Thêm unnecessary: true để báo là route này khi đã đăng nhập thì không cần truy cập nữa
// Thêm protected: true để báo là route này cần phải đăng nhập mới được truy cập
// Thêm onlyAdmin: true để báo là route này chỉ có admin mới được truy cập
// Children: [] chứa các route con

export type Route = {
    path: string
    component: () => JSX.Element
    layout: ({ children }: { children: React.ReactNode }) => JSX.Element
    unnecessary?: boolean
    protected?: boolean
    onlyAdmin?: boolean
    children?: Route[]
}

const routes: Route[] = [
    {
        path: routesConfig.home,
        component: Home,
        layout: DefaultLayout,
        protected: true
    },
    {
        path: routesConfig.welcome,
        component: Welcome,
        layout: DefaultLayout,
        unnecessary: true
    },
    {
        path: routesConfig.login,
        component: Login,
        layout: DefaultLayout,
        unnecessary: true
    },
    {
        path: routesConfig.register,
        component: Register,
        layout: DefaultLayout,
        unnecessary: true
    },
    {
        path: routesConfig.chat,
        component: Chat,
        layout: DefaultLayout,
        protected: true
    },
    {
        path: routesConfig.profile,
        component: Profile,
        layout: DefaultLayout,
        protected: true
    },
    {
        path: routesConfig.updateProfile,
        component: UpdateProfile,
        layout: DefaultLayout,
        protected: true
    },
    {
        path: routesConfig.postDetail,
        component: PostDetail,
        layout: DefaultLayout,
        protected: true
    },
    {
        path: routesConfig.hashtag,
        component: HashTag,
        layout: DefaultLayout,
        protected: true
    }
]

export default routes
