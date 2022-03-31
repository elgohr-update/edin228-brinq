import { Button, Switch, useTheme } from '@nextui-org/react'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { AiOutlineDown } from 'react-icons/ai';
import { useTheme as useNextTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { BsPlusLg } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import { FaCog } from 'react-icons/fa';
import { RiFileUserFill } from 'react-icons/ri';
import HiddenBackdrop from '../../util/HiddenBackdrop';
import UserAvatar from '../../user/Avatar';
import LinkedMenuItem from './item/LinkedMenuItem';


const UserMenu = () => {
    const { setTheme } = useNextTheme();
    const { isDark, type } = useTheme();
    const [openMenu, setOpenMenu] = useState(false)
    const router = useRouter()

    const closeMenu = () => {
        setOpenMenu(false)
    }

    return (
        <div className="flex items-center justify-center w-full h-full relative">
            <div onClick={ () => setOpenMenu(!openMenu)}>
                <UserAvatar tooltip={false} isLink={false} />
            </div>
            {openMenu?<HiddenBackdrop onClick={() => closeMenu()} />:null}            
            <div className={openMenu?`z-50 transition-all duration-200 ease-out opacity-1 absolute top-[50px] right-[2px] min-h-20 max-h-60 min-w-[170px] max-w-[200px] rounded panel-theme-${type} ${type}-shadow`: 'absolute transition-all duration-200 ease-out opacity-0 top-[-37px]'}>
                <div className={`flex flex-col justify-between h-full ${openMenu?'opacity-1':'opacity-0'}`}>
                    <div className="flex flex-col w-full py-2 px-1 space-y-2">
                        <LinkedMenuItem href="/user/profile" icon={<RiFileUserFill />} label="Profile" />
                        <LinkedMenuItem href="/user/settings" icon={<FaCog />} label="Settings" />
                    </div>
                    <div className={`panel-flat-${type} p-1`}>
                        <LinkedMenuItem href="/user/signout" icon={<FiLogOut />} label="Sign Out" isColor color="error" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserMenu