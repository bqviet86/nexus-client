import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pagination as AntdPagination, ConfigProvider, Radio, Table } from 'antd'
import toast from 'react-hot-toast'
import { isBoolean, pick } from 'lodash'
import { format } from 'date-fns'

import Button from '~/components/Button'
import { GetAllUsersReqData, UpdateActiveStatusReqData, getAllUsers, updateActiveStatus } from '~/apis/users.apis'
import images from '~/assets/images'
import { routes } from '~/config'
import { Sex } from '~/constants/enums'
import { useQueryParams } from '~/hooks'
import { User, UserTableType } from '~/types/users.types'
import { Pagination } from '~/types/commons.types'

const LIMIT = 10

function AdminUser() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { page, search_name, is_active } = useQueryParams()

    const [users, setUsers] = useState<UserTableType[]>([])
    const [pagination, setPagination] = useState<Pagination>({ page: Number(page) || 1, total_pages: 0 })
    const [searchName, setSearchName] = useState<string>(search_name || '')
    const [isActive, setIsActive] = useState<boolean | undefined>(
        is_active === 'true' ? true : is_active === 'false' ? false : undefined
    )

    const getAllUsersQueryFn = async ({ name, is_active, page, limit }: GetAllUsersReqData) => {
        const response = await getAllUsers({ name, is_active, page, limit })
        const { result } = response.data

        setUsers(
            (result?.users as User[]).map((user) => ({
                ...pick(user, ['name', 'email']),
                date_of_birth: format(user.date_of_birth, 'dd-MM-yyyy'),
                key: user._id,
                sex: user.sex === Sex.Male ? 'Nam' : 'Nữ',
                avatar: pick(user, ['_id', 'name', 'avatar']),
                action: pick(user, ['_id', 'name', 'is_active'])
            }))
        )
        setPagination({
            page: result?.page as number,
            total_pages: result?.total_pages as number
        })
        navigate(
            `${routes.adminUsers}?page=${page}${name ? `&search_name=${name}` : ''}${
                isBoolean(is_active) ? `&is_active=${is_active}` : ''
            }`
        )

        return response
    }

    const { isFetching } = useQuery({
        queryKey: ['allUsers', { page: pagination.page, limit: LIMIT }],
        queryFn: () =>
            getAllUsersQueryFn({
                name: searchName || undefined,
                is_active: isActive,
                page: pagination.page,
                limit: LIMIT
            })
    })

    const handleSearchUsers = () => {
        queryClient.fetchQuery({
            queryKey: ['allUsers', { page: 1, limit: LIMIT }],
            queryFn: () =>
                getAllUsersQueryFn({
                    name: searchName || undefined,
                    is_active: isActive,
                    page: 1,
                    limit: LIMIT
                })
        })
    }

    const { mutate: mutateUpdateActiveStatus } = useMutation({
        mutationFn: (data: UpdateActiveStatusReqData) => updateActiveStatus(data)
    })

    const handleUpdateActiveStatus = ({ user_id, name, is_active }: UpdateActiveStatusReqData & { name: string }) => {
        mutateUpdateActiveStatus(
            { user_id, is_active },
            {
                onSuccess: () => {
                    setUsers((prev) =>
                        prev.map((user) =>
                            user.key === user_id ? { ...user, action: { ...user.action, is_active } } : user
                        )
                    )
                    toast(is_active ? `Người dùng ${name} đã được mở khoá thành công` : `Đã khoá người dùng ${name}`, {
                        position: 'top-right'
                    })
                }
            }
        )
    }

    return (
        <>
            <div className='flex w-max rounded-lg bg-white p-4'>
                <form
                    className='flex items-center gap-4'
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSearchUsers()
                    }}
                >
                    <input
                        placeholder='Tìm kiếm theo tên người dùng'
                        spellCheck={false}
                        className='h-10 w-80 rounded-md border border-solid border-[#ddd] px-4 py-2 text-sm transition-all [&:focus]:border-[#3c50e0]'
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />

                    <div className='flex flex-col gap-1'>
                        <div className='font-medium'>Trạng thái:</div>

                        <ConfigProvider theme={{ token: { colorPrimary: '#3c50e0' } }}>
                            <Radio.Group onChange={(e) => setIsActive(e.target.value)} value={isActive}>
                                <Radio
                                    value={true}
                                    onClick={() => setIsActive((prev) => (isBoolean(prev) ? undefined : true))}
                                >
                                    Hoạt động
                                </Radio>

                                <Radio
                                    value={false}
                                    onClick={() => setIsActive((prev) => (isBoolean(prev) ? undefined : false))}
                                >
                                    Đã khóa
                                </Radio>
                            </Radio.Group>
                        </ConfigProvider>
                    </div>

                    <Button
                        type='submit'
                        className='!h-9 !w-auto !bg-[#3c50e0] hover:!bg-[#3c50e0]/90 [&>span]:!text-white'
                    >
                        Áp dụng
                    </Button>
                </form>
            </div>

            <div className='mt-4 rounded-lg bg-white p-4'>
                <h4 className='text-lg font-semibold text-black'>Danh sách người dùng</h4>

                <Table
                    dataSource={users}
                    columns={[
                        {
                            title: 'Avatar',
                            dataIndex: 'avatar',
                            key: 'avatar',
                            render: ({ _id, name, avatar }: Pick<User, '_id' | 'name' | 'avatar'>) => (
                                <Link
                                    to={routes.profile.replace(':profile_id', _id)}
                                    target='_blank'
                                    className='mx-auto block h-9 w-9 overflow-hidden rounded-full'
                                >
                                    <img
                                        src={
                                            avatar
                                                ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${avatar}`
                                                : images.avatar
                                        }
                                        alt={name}
                                        className='h-full w-full object-cover'
                                    />
                                </Link>
                            )
                        },
                        {
                            title: 'Tên người dùng',
                            dataIndex: 'name',
                            key: 'name'
                        },
                        {
                            title: 'Email',
                            dataIndex: 'email',
                            key: 'email'
                        },
                        {
                            title: 'Giới tính',
                            dataIndex: 'sex',
                            key: 'sex'
                        },
                        {
                            title: 'Ngày sinh',
                            dataIndex: 'date_of_birth',
                            key: 'date_of_birth'
                        },
                        {
                            title: 'Hành động',
                            dataIndex: 'action',
                            key: 'action',
                            render: ({ _id: user_id, name, is_active }: Pick<User, '_id' | 'name' | 'is_active'>) => (
                                <Button
                                    className={`!mx-auto !h-8 !w-auto !border !border-solid !px-3 [&>span]:!text-[13px] ${
                                        is_active
                                            ? '!border-[#f44336] !bg-[#f44336]/10 hover:!bg-[#f44336]/20 [&>span]:!text-[#f44336]'
                                            : '!border-[#3c50e0] !bg-[#3c50e0]/10 hover:!bg-[#3c50e0]/20 [&>span]:!text-[#3c50e0]'
                                    }`}
                                    onClick={() => handleUpdateActiveStatus({ user_id, name, is_active: !is_active })}
                                >
                                    {is_active ? 'Khóa' : 'Mở khóa'}
                                </Button>
                            )
                        }
                    ]}
                    size='middle'
                    pagination={{ position: ['none'] }}
                    loading={isFetching}
                    className='mt-4 [&_td]:!text-center [&_th]:!bg-[#f7f9fc] [&_th]:!text-center'
                />

                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: '#3c50e0',
                            colorBgContainer: '#3c50e01a',
                            colorBgTextHover: '#3c50e01a'
                        }
                    }}
                >
                    <AntdPagination
                        total={pagination.total_pages * LIMIT}
                        pageSize={LIMIT}
                        current={pagination.page}
                        showSizeChanger={false}
                        hideOnSinglePage
                        className='mt-4 flex justify-center'
                        onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                    />
                </ConfigProvider>
            </div>
        </>
    )
}

export default AdminUser
