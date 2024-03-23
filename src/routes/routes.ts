import { routes as routesConfig } from '~/config'
import DefaultLayout, { DatingLayout, DatingNoHeaderFooterLayout, FullScreenLayout } from '~/layouts'

import Home from '~/pages/Home'
import Welcome from '~/pages/Welcome'
import Login from '~/pages/Login'
import Register from '~/pages/Register'
import Chat from '~/pages/Chat'
import Profile from '~/pages/Profile'
import UpdateProfile from '~/pages/UpdateProfile'
import PostDetail from '~/pages/PostDetail'
import HashTag from '~/pages/HashTag'
import Dating from '~/pages/Dating'
import DatingCallHistory from '~/pages/DatingCallHistory'
import DatingChat from '~/pages/DatingChat'
import DatingNotification from '~/pages/DatingNotification'
import DatingProfile from '~/pages/DatingProfile'
import DatingUpdateProfile from '~/pages/DatingUpdateProfile'
import DatingPersonalityTest from '~/pages/DatingPersonalityTest'

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
    children?: Omit<Route, 'layout'>[]
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
        layout: FullScreenLayout,
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
    },
    {
        path: routesConfig.dating,
        component: Dating,
        layout: DatingLayout,
        protected: true,
        children: [
            {
                path: routesConfig.datingCallHistory,
                component: DatingCallHistory,
                protected: true
            },
            {
                path: routesConfig.datingChat,
                component: DatingChat,
                protected: true
            },
            {
                path: routesConfig.datingNotification,
                component: DatingNotification,
                protected: true
            },
            {
                path: routesConfig.datingProfile,
                component: DatingProfile,
                protected: true
            }
        ]
    },
    {
        path: routesConfig.datingUpdateProfile,
        component: DatingUpdateProfile,
        layout: DatingNoHeaderFooterLayout,
        protected: true
    },
    {
        path: routesConfig.datingPersonalityTest,
        component: DatingPersonalityTest,
        layout: DatingNoHeaderFooterLayout,
        protected: true
    }
]

export default routes
