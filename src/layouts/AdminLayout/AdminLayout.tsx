import AdminSidebar from '../components/AdminSidebar'
import AdminHeader from '../components/AdminHeader'

function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex'>
            <AdminSidebar />

            <div className='flex-[1]'>
                <AdminHeader />
                <div className='mx-auto max-w-screen-2xl p-4'>{children}</div>
            </div>
        </div>
    )
}

export default AdminLayout
