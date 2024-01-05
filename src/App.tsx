import { Fragment, useContext } from 'react'
import { BrowserRouter as Router, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { Toaster } from 'react-hot-toast'

import Wrapper from './Wrapper'
import { routes as routesConfig, theme } from './config'
import { UserRole } from './constants/enums'
import { AppContext } from './contexts/appContext'
import routes, { Route as RouteType } from './routes'

function App() {
    const { user, darkMode } = useContext(AppContext)

    const renderRoutes = (routes: RouteType[]) => {
        return routes.map((route, index) => {
            const isParent = !!route.children && route.children.length > 0
            const Layout = route.layout || Fragment
            const Page = route.component

            let element = (
                <Layout>
                    <Page />
                </Layout>
            )

            // Nếu đã đăng nhập mà truy cập vào các trang không cần thiết như login, register, ...
            if (route.unnecessary && user) {
                if (user.role === UserRole.Admin) {
                    // element = <Navigate to={routesConfig.adminUser} state={{ unnecessary: true }} /> // Fix sau
                } else {
                    element = <Navigate to={routesConfig.home} state={{ unnecessary: true }} />
                }
            }

            // Nếu chưa đăng nhập mà truy cập vào các trang đuợc bảo vệ như account, dating, ...
            if (route.protected && !user) {
                element = <Navigate to={routesConfig.welcome} state={{ protected: true }} />
            }

            // Khi truy cập vào trang chỉ dành cho admin
            if (route.onlyAdmin) {
                if (!user) {
                    // element = <Navigate to={routesConfig.adminLogin} state={{ onlyAdmin: true }} /> // Fix sau
                } else if (user.role !== UserRole.Admin) {
                    element = <Navigate to={routesConfig.home} state={{ onlyAdmin: true }} />
                }
            }

            return (
                <Route key={index} path={route.path} element={element}>
                    {isParent && renderRoutes(route.children as RouteType[])}
                </Route>
            )
        })
    }

    return (
        <ConfigProvider theme={darkMode ? theme.dark : theme.light}>
            <Router>
                <Toaster position='top-right' />
                <Wrapper>{renderRoutes(routes)}</Wrapper>
            </Router>
        </ConfigProvider>
    )
}

export default App
