import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

export default function NavLink({url,slug,icon,title}) {
    const router = useRouter()
    const isActive = (currentPage) => {
        if (router.pathname.includes(currentPage)){
            return 'opacity-100 active-path-small'
        }
        return 'opacity-70 hover:opacity-100'
    }
    const isActiveBorder = (currentPage) => {
        if (router.pathname.includes(currentPage)){
            return 'pink-to-blue-gradient-1'
        }
    }
    const isActiveIcon = (currentPage) => {
        if (router.pathname.includes(currentPage)){
            return 'active-icon-glow'
        }
        return ''
    }
    return (
        <Link href={url}>
            <a>
                <div className={`flex relative text-xs tracking-wider transition duration-100 ease-out justify-center w-full items-center px-2 py-1 ${isActive(`${slug}`)}`}>
                    <div className={`mr-2 ${isActiveIcon(`${slug}`)}`}>{icon}</div>
                    <div className={`hidden md:flex mr-2`}>{title}</div>
                    <div className={`${isActiveBorder(`${slug}`)} navlink-border`} />
                </div>
            </a>
        </Link>
    )
}
