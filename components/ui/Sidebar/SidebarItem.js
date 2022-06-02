import { useTheme } from '@nextui-org/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

export default function SidebarItem({ href, isOpen, icon, label, basePath = href, isMobile=false, mainMenuItem=true }) {
  const router = useRouter()
  
  
  const isActiveIcon = () => {
    if (router.pathname.includes(basePath)) {
      return 'active-icon-glow'
    }
    return ''
  }
  const isActiveText = () => {
    if (router.pathname.includes(basePath)) {
      return 'active-icon'
    }
    return ''
  }
  return (
    <div className="sidebar-item relative min-w-[200px]">
      <Link href={href}>
        <a
          className={`flex w-full items-center  rounded-lg py-1 px-2 text-xs hover:text-sky-500`}
        >
          <div className={`${isActiveIcon()} flex h-[30px] w-[30px] text-xs items-center justify-center`}>
            {icon}
          </div>
          <div className={`flex w-full items-center ${isActiveText()} ${isMobile ? 'relative uppercase sidebar-text-size tracking-widest font-bold' : `sidebar-text-${isOpen}` } `}>
            {label}
          </div>
        </a>
      </Link>
    </div>
  )
}
