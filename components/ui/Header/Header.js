import { useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import SearchBar from './../../search/SearchBar';
import UserMenu from './../menu/UserMenu';
import NotificationBell from './../../notifications/NotificationBell';
import NewActionMenu from './../menu/NewActionMenu';
import { useAppContext, useAppHeaderContext } from '../../../context/state';
import { BiSearch } from 'react-icons/bi'
import MobileSidebar from '../Sidebar/MobileSidebar';


const Header = () => {
    const { type } = useTheme();
    const {state, setState} = useAppContext();
    const {appHeader, setAppHeader} = useAppHeaderContext();
    const [showSearchBar, setShowSearchBar] = useState(false)

    return (
        <div className={`z-40 flex flex-col lg:flex-row lg:items-center justify-between w-full h-full relative md:py-2 ${state.scrollY > 0 ? `panel-flat-${type}`: null}`}>
            {/* <div className="hidden z-20 lg:flex w-full lg:w-1/4 pl-4">
                <SearchBar />
            </div> */}
            <div className="hidden z-20 lg:flex w-full lg:w-1/4 pl-4">
                {appHeader.titleContent}
            </div>
            <div className="z-40 flex items-center justify-between lg:justify-end mt-2 lg:mt-0 px-4">
                <div className="lg:hidden z-30">
                    <MobileSidebar />
                </div>
                <div className="z-20 flex items-center justify-end">
                    {/* <div className="flex lg:hidden mr-4 cursor-pointer" onClick={() => setShowSearchBar(!showSearchBar)}>
                        <BiSearch />
                    </div> */}
                    <div className="mr-2">
                        <NewActionMenu />
                    </div>
                    <div className="ml-2">
                        <NotificationBell />
                    </div>
                    <div className="ml-2">
                        <UserMenu />
                    </div>
                </div>
            </div>
            <div className="flex lg:hidden z-20 w-full pl-4 py-4">
                {appHeader.titleContent}
            </div>
            {
                showSearchBar ? 
                    <div className={`z-20 lg:flex w-full panel-theme-${type} px-4 py-2`}>
                        <SearchBar />
                    </div>
                :null
            }
            
        </div>
    )
}

export default Header