import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { getConstantIcons } from '../../../utils/utils'

export default function SidebarDropdown({ children, icon, label, basePath, isOpen, isExpand }) {
  const router = useRouter()
  const [show, setShow] = useState(false)
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
    <div className="flex flex-col">
      <div
        className={`flex cursor-pointer w-full items-center px-2 py-2 text-sm transition duration-75 ease-out hover:text-sky-500 ${isActive(
          basePath
        )} ${isActiveIcon(basePath)}`}
        onClick={() => setShow(!show)}
      >
        <div className={`flex h-[30px] w-[30px] items-center justify-center`}>
          {icon}
        </div>
        <div className={`flex w-full items-center sidebar-text-${isOpen}`}>
          {label}
          <div className="pl-2">{ show ? getConstantIcons('down') : getConstantIcons('left')}</div>
        </div>
      </div>
      {
          show ? 
          <div className={`flex flex-col ${isExpand ? `pl-8 ` : ``} relative h-full transition duration-100 ease-out`}>
            <div className={`${isExpand ? `opacity-1` : `opacity-0`} transition duration-100 ease-out left-[22px] top-[5px] absolute w-[1px] h-full bg-color-default rounded-lg`}></div>
            {children}
          </div>
          :null
      }
    </div>
  )
}
