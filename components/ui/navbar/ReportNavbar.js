import Link from 'next/link'
import { useRouter } from 'next/router'
import { RiFolderUserFill,RiBuildingFill } from 'react-icons/ri';
import { BsBox } from 'react-icons/bs';
import React from 'react'


const ReportNavbar = () => {

    const router = useRouter()
    
    const isActive = (currentPage) => {
        if (router.pathname.includes(currentPage)){
            return 'active-path-small'
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
        <div className="flex justify-center md:justify-end items-center space-x-2 py-2 md:py-0">
            <Link href="/reports/clients">
                <a>
                    <div className={`flex hover:text-sky-500 transition duration-100 ease-out items-center px-2 ${isActive(`/clients`)}`}>
                        <div className={`mr-2 ${isActiveIcon(`/clients`)}`}><RiFolderUserFill /></div>
                        <div className={`mr-2 ${isActiveIcon(`/clients`)}`}>Clients</div>
                    </div>
                </a>
            </Link>
            <Link href="/reports/policies">
                <a>
                    <div className={`flex hover:text-sky-500 transition duration-100 ease-out items-center px-2 ${isActive(`/policies`)}`}>
                        <div className={`mr-2 ${isActiveIcon(`/policies`)}`}><BsBox /></div>
                        <div className={`mr-2 ${isActiveIcon(`/policies`)}`}>Policies</div>
                    </div>
                </a>
            </Link>
            <Link href="/reports/carriers">
                <a>
                    <div className={`flex hover:text-sky-500 transition duration-100 ease-out items-center px-2 ${isActive(`/carriers`)}`}>
                        <div className={`mr-2 ${isActiveIcon(`/carriers`)}`}><RiBuildingFill /></div>
                        <div className={`mr-2 ${isActiveIcon(`/carriers`)}`}>Carriers</div>
                    </div>
                </a>
            </Link>
        </div>
    )
}

export default ReportNavbar