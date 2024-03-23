import { useContext } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { DATING_FOOTER_ITEMS } from '~/constants/interfaceData'
import { AppContext } from '~/contexts/appContext'

function DatingFooter() {
    const { pathname } = useLocation()

    const { datingProfile } = useContext(AppContext)

    return (
        datingProfile && (
            <div className='absolute bottom-0 left-0 flex w-full justify-around rounded-t-2xl bg-[#242526] px-4 py-1'>
                {DATING_FOOTER_ITEMS.map((item, index) => {
                    const path = item.path.replace(':profile_id', datingProfile._id)
                    return (
                        <NavLink
                            key={index}
                            to={path}
                            className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full${
                                pathname === path ? ' bg-[#3a3b3c]' : ''
                            }`}
                        >
                            {pathname === path ? item.activeIcon : item.icon}
                        </NavLink>
                    )
                })}
            </div>
        )
    )
}

export default DatingFooter
