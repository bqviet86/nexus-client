import { routes as routesConfig } from '~/config'
import DefaultLayout, {
    AdminLayout,
    DatingLayout,
    DatingNoFooterLayout,
    DatingNoHeaderFooterLayout,
    FullScreenLayout
} from '~/layouts'

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
import DatingCall from '~/pages/DatingCall'
import DatingCallHistory from '~/pages/DatingCallHistory'
import DatingChat from '~/pages/DatingChat'
import DatingChatDetail from '~/pages/DatingChatDetail'
import DatingNotification from '~/pages/DatingNotification'
import DatingProfile from '~/pages/DatingProfile'
import DatingUpdateProfile from '~/pages/DatingUpdateProfile'
import DatingUpdateCriteria from '~/pages/DatingUpdateCriteria'
import DatingPersonalityTest from '~/pages/DatingPersonalityTest'
import DatingPersonalityTestDetail from '~/pages/DatingPersonalityTestDetail'
import AdminStat from '~/pages/AdminStat'
import AdminUser from '~/pages/AdminUser'
import AdminConstructiveTest from '~/pages/AdminConstructiveTest'
import AdminPersonalityTest from '~/pages/AdminPersonalityTest'

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
        path: routesConfig.datingCall,
        component: DatingCall,
        layout: ({ children }) => (
            <DatingNoFooterLayout backBtn={false} linkLogo={false}>
                {children}
            </DatingNoFooterLayout>
        ),
        protected: true
    },
    {
        path: routesConfig.datingUpdateProfile,
        component: DatingUpdateProfile,
        layout: DatingNoFooterLayout,
        protected: true
    },
    {
        path: routesConfig.datingUpdateCriteria,
        component: DatingUpdateCriteria,
        layout: DatingNoFooterLayout,
        protected: true
    },
    {
        path: routesConfig.datingPersonalityTest,
        component: DatingPersonalityTest,
        layout: DatingNoFooterLayout,
        protected: true
    },
    {
        path: routesConfig.datingPersonalityTestDetail,
        component: DatingPersonalityTestDetail,
        layout: DatingNoHeaderFooterLayout,
        protected: true
    },
    {
        path: routesConfig.datingChatDetail,
        component: DatingChatDetail,
        layout: DatingNoFooterLayout,
        protected: true
    },

    // Admin
    {
        path: routesConfig.adminStats,
        component: AdminStat,
        layout: AdminLayout,
        onlyAdmin: true
    },
    {
        path: routesConfig.adminUsers,
        component: AdminUser,
        layout: AdminLayout,
        onlyAdmin: true
    },
    {
        path: routesConfig.adminConstructiveTests,
        component: AdminConstructiveTest,
        layout: AdminLayout,
        onlyAdmin: true
    },
    {
        path: routesConfig.adminPersonalityTests,
        component: AdminPersonalityTest,
        layout: AdminLayout,
        onlyAdmin: true
    }
]

export default routes
