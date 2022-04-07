import { Switch, useTheme } from '@nextui-org/react'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useTheme as useNextTheme } from 'next-themes'
import { useRouter } from 'next/router'
import SearchBar from './../../search/SearchBar';
import UserMenu from './../menu/UserMenu';
import NotificationBell from './../../notifications/NotificationBell';
import NewActionMenu from './../menu/NewActionMenu';


const Header = () => {
    const { setTheme } = useNextTheme();
    const { isDark, type } = useTheme();
    const router = useRouter()

    return (
        <div className={`z-40 flex flex-col md:flex-row md:items-center justify-between w-full h-full relative py-2 px-4  panel-flat-${type}`}>
            <div className="z-20flex w-full md:w-1/4">
                <SearchBar />
            </div>
            <div className="z-10 flex items-center w-full justify-between md:justify-end mt-2 md:mt-0">
                <div className="pl-4 md:hidden">
                    Menu
                </div>
                <div className="flex justify-end">
                    <div className="mr-2">
                        <UserMenu />
                    </div>
                    <div className="mr-2">
                        <NotificationBell />
                    </div>
                    <div className="">
                        <NewActionMenu />
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Header