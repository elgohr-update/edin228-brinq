import { Image, Switch, useTheme } from '@nextui-org/react'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { AiFillHome, AiOutlineAlignLeft } from 'react-icons/ai';
import { IoMdListBox } from 'react-icons/io';
import { RiAdminFill } from 'react-icons/ri';
import { BsFillMoonFill, BsFillSunFill,BsFillCalendar2CheckFill } from 'react-icons/bs';
import { CgFileDocument } from 'react-icons/cg';
import { useTheme as useNextTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react';
import { useAppContext } from '../../../context/state';


const Sidebar = () => {
    const [expand,setExpand] = useState(false)
    const { setTheme } = useNextTheme();
    const { isDark, type } = useTheme();
    const { data: session } = useSession()
    const router = useRouter();
    const {state, setState} = useAppContext();
    

    const currentYear = () => {
        const date = new Date()
        return date.getFullYear()
    }
    const currentMonth = () => {
        const date = new Date()
        return date.getMonth() + 1
    }

    const isExpand = () => {
        if(expand){
            return `open`
        }
        return `closed`
    }
    const hoverSidebar = (status) => {
        const res = status === 'in' ? true : false
        setExpand(res)
    }
    const themeHover = () => {
        if (type === 'dark'){
            return ''
        }
        return ''
    }

    const isActive = (currentPage) => {
        if (router.pathname.includes(currentPage)){
            return 'active-path'
        }
        return ''
    }
    const isActiveIcon = (currentPage) => {
        if (router.pathname.includes(currentPage)){
            return 'active-icon'
        }
        return ''
    }

    return (
        <div className="z-50 flex flex-col w-full h-full relative">
            <div  className={`flex flex-col justify-between absolute h-full w-full panel-theme-${type} ${type}-shadow sidebar-${isExpand()}`} onMouseOver={() => hoverSidebar('in')} onMouseOut={() => hoverSidebar('out')}>
                <div className="flex flex-col w-full">
                    <div className={`flex items-center justify-center py-8 h-10 panel-theme-${type}`}>
                        <div className="flex items-center justify-center w-full relative transition duration-100 ease-out">
                            <div className={`${expand ? 'opacity-1 relative' : 'opacity-0 absolute'} transition flex scale-[0.7]`}>
                                <Image
                                    showSkeleton
                                    maxDelay={10000}
                                    width={200}
                                    height={50}  
                                    src="/brinq-logo-full-color.png"
                                    alt="Default Image"
                                />
                            </div>
                            <div className={`${expand ? 'opacity-0 absolute' : 'opacity-1 relative'} transition flex scale-[0.7]`}>
                                <Image
                                    showSkeleton
                                    maxDelay={10000}
                                    width={50}
                                    height={50}  
                                    src="/brinq-logo-q-color.png"
                                    alt="Default Image"
                                />    
                            </div>
                            
                        </div>  
                    </div>
                    <div className={`flex flex-col px-2`}>
                        <Link href="/dashboard">
                            <a className={`flex w-full py-2 hover:text-sky-500 transition duration-75 ease-out ${themeHover()}`}>
                                <div className={`text-xl p-3 ${isActive('/dashboard')}`}>
                                    <AiFillHome className={`${isActiveIcon('/dashboard')}`} />
                                </div>
                                <div className={`flex w-full sidebar-text-${isExpand()}`}>
                                    Home
                                </div> 
                            </a>
                        </Link>
                        <Link href="/crm">
                            <a className={`flex w-full py-2 hover:text-sky-500 transition duration-75 ease-out ${themeHover()}`}>
                                <div className={`text-xl p-3 icon-rotate ${isActive('/crm')}`}>
                                    <AiOutlineAlignLeft className={`${isActiveIcon('/crm')}`} />
                                </div>
                                <div className={`flex w-full sidebar-text-${isExpand()}`}>
                                    CRM
                                </div> 
                            </a>
                        </Link>
                        <Link href={`/renewals/${currentMonth()}/${currentYear()}`}>
                            <a className={`flex w-full py-2 hover:text-sky-500 transition duration-75 ease-out ${themeHover()}`}>
                                <div className={`text-xl p-3 ${isActive('/renewals')}`}>
                                    <BsFillCalendar2CheckFill className={`${isActiveIcon('/renewals')}`} />
                                </div>
                                <div className={`flex w-full sidebar-text-${isExpand()}`}>
                                    Renewals
                                </div> 
                            </a>
                        </Link>
                        <Link href={`/reports/${state?.reports?.default}`}>
                            <a className={`flex w-full py-2 hover:text-sky-500 transition duration-75 ease-out ${themeHover()}`}>
                                <div className={`text-xl p-3 ${isActive('/reports')}`}>
                                    <IoMdListBox className={`${isActiveIcon('/reports')}`} />
                                </div>
                                <div className={`flex w-full sidebar-text-${isExpand()}`}>
                                    Reports
                                </div> 
                            </a>
                        </Link>
                        <Link href={`/tools/proposals`}>
                            <a className={`flex w-full py-2 hover:text-sky-500 transition duration-75 ease-out ${themeHover()}`}>
                                <div className={`text-xl p-3 ${isActive('/proposals')}`}>
                                    <CgFileDocument className={`${isActiveIcon('/proposals')}`} />
                                </div>
                                <div className={`flex w-full sidebar-text-${isExpand()}`}>
                                    Proposals
                                </div> 
                            </a>
                        </Link>
                        {
                            session?.user?.admin ? 
                            <Link href="/admin">
                                <a className={`flex w-full py-2 hover:text-sky-500 transition duration-75 ease-out ${themeHover()}`}>
                                    <div className={`text-xl p-3 ${isActive('/admin')}`}>
                                        <RiAdminFill className={`${isActiveIcon('/admin')}`} />
                                    </div>
                                    <div className={`flex w-full sidebar-text-${isExpand()}`}>
                                        Admin
                                    </div> 
                                </a>
                            </Link>
                            :null
                        }
                    </div>
                    
                </div>
                <div className="flex items-center justify-center py-2">
                    <div>
                        <Switch
                            shadow
                            size="sm"
                            checked={isDark}
                            color="primary"
                            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                            iconOn={<BsFillMoonFill />}
                            iconOff={<BsFillSunFill />}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar