import { Fragment, useContext } from 'react'
import { BrowserRouter as Router, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Wrapper from './Wrapper'
import { routes as routesConfig } from './config'
import { UserRole } from './constants/enums'
import { AppContext } from './contexts/appContext'
import routes, { Route as RouteType } from './routes'

function App() {
    const { user } = useContext(AppContext)

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
                    element = <Navigate to={routesConfig.adminUser} state={{ unnecessary: true }} />
                } else {
                    element = <Navigate to={routesConfig.home} state={{ unnecessary: true }} />
                }
            }

            // Nếu chưa đăng nhập mà truy cập vào các trang đuợc bảo vệ như account, dating, ...
            if (route.protected && !user) {
                element = <Navigate to={routesConfig.login} state={{ protected: true }} />
            }

            // Khi truy cập vào trang chỉ dành cho admin
            if (route.onlyAdmin) {
                if (!user) {
                    element = <Navigate to={routesConfig.adminLogin} state={{ onlyAdmin: true }} />
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
        <>
            <Toaster
                position='bottom-right'
                toastOptions={{
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff'
                    }
                }}
            />
            <Router>
                <Wrapper>{renderRoutes(routes)}</Wrapper>
            </Router>
        </>
    )
}

export default App
