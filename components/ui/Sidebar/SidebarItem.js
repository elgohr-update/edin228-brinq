import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

export default function SidebarItem({ href, isOpen, icon, label, basePath = href }) {
  const router = useRouter()
  const isActive = () => {
    if (router.pathname.includes(basePath)) {
      return 'active-path'
    }
    return ''
  }
  const isActiveIcon = () => {
    if (router.pathname.includes(basePath)) {
      return 'active-icon'
    }
    return ''
  }
  return (
    <div>
      <Link href={href}>
        <a
          className={`flex w-full items-center py-1 px-2 text-sm transition duration-75 ease-out hover:text-sky-500 ${isActive(
            href
          )} ${isActiveIcon(href)}`}
        >
          <div className={`flex h-[30px] w-[30px] text-xs items-center justify-center`}>
            {icon}
          </div>
          <div className={`flex w-full items-center sidebar-text-${isOpen}`}>
            {label}
          </div>
        </a>
      </Link>
    </div>
  )
}
