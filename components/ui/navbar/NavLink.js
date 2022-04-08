import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

export default function NavLink({url,slug,icon,title}) {
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
        <Link href={url}>
            <a>
                <div className={`flex hover:text-sky-500 transition duration-100 ease-out items-center px-2 py-1 ${isActive(`${slug}`)}`}>
                    <div className={`mr-2 ${isActiveIcon(`${slug}`)}`}>{icon}</div>
                    <div className={`mr-2 ${isActiveIcon(`${slug}`)}`}>{title}</div>
                </div>
            </a>
        </Link>
    )
}
