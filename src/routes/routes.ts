import { routes as routesConfig } from '~/config'
import DefaultLayout from '~/layouts'

import Home from '~/pages/Home'
import Welcome from '~/pages/Welcome'
import Login from '~/pages/Login'
import Register from '~/pages/Register'

// Thêm unnecessary: true để báo là route này khi đã đăng nhập thì không cần truy cập nữa
// Thêm protected: true để báo là route này cần phải đăng nhập mới được truy cập
// Thêm onlyAdmin: true để báo là route này chỉ có admin mới được truy cập
// Children: [] chứa các route con của nó

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
        path: routesConfig.welcome,
        component: Welcome,
        layout: DefaultLayout,
        unnecessary: true
    },
    {
        path: routesConfig.home,
        component: Home,
        layout: DefaultLayout,
        protected: true
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
    }
]

export default routes
