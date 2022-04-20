import { Switch, useTheme } from '@nextui-org/react'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useTheme as useNextTheme } from 'next-themes'
import { useRouter } from 'next/router'
import SearchBar from './../../search/SearchBar';
import UserMenu from './../menu/UserMenu';
import NotificationBell from './../../notifications/NotificationBell';
import NewActionMenu from './../menu/NewActionMenu';
import { useAppContext } from '../../../context/state';
import { BiSearch } from 'react-icons/bi'
import HeaderNav from './HeaderNav';


const Header = () => {
    const { setTheme } = useNextTheme();
    const { isDark, type } = useTheme();
    const router = useRouter()
    const {state, setState} = useAppContext();
    const [showSearchBar, setShowSearchBar] = useState(false)

    return (
        <div className={`z-40 flex flex-col md:flex-row md:items-center justify-between w-full h-full relative py-2 ${state.scrollY > 0 ? `panel-flat-${type}`: null}`}>
            <div className="hidden z-20 md:flex w-full md:w-1/4 pl-4">
                <SearchBar />
            </div>
            <div className="z-10 flex items-center w-full justify-between md:justify-end mt-2 md:mt-0 px-4">
                <div className="pl-4 md:hidden">
                    Menu
                </div>
                <div className="flex items-center justify-end">
                    <div className="flex md:hidden mr-4 cursor-pointer" onClick={() => setShowSearchBar(!showSearchBar)}>
                        <BiSearch />
                    </div>
                    <div className="mr-2">
                        <NewActionMenu />
                    </div>
                    <div className="mx-4">
                        <NotificationBell />
                    </div>
                    <div className="ml-2">
                        <UserMenu />
                    </div>
                </div>
            </div>
            {
                showSearchBar ? 
                    <div className={`z-20 md:flex w-full panel-theme-${type} px-4 py-2`}>
                        <SearchBar />
                    </div>
                :null
            }
            
        </div>
    )
}

export default Header