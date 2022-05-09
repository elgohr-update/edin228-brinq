import { useTheme } from '@nextui-org/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { getConstantIcons } from '../../../utils/utils'
import { motion } from 'framer-motion'

export default function SidebarDropdown({
  children,
  icon,
  label,
  basePath,
  isOpen,
  isExpand,
  isMobile = false,
}) {
  const router = useRouter()
  const [show, setShow] = useState(false)
  const { type } = useTheme()

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
    <div
      className={`flex flex-col ${
        show ? `rounded-lg panel-theme-${type}` : ``
      }`}
    >
      <div
        className={`flex w-full cursor-pointer  items-center rounded-lg py-1 px-2 text-sm  hover:text-sky-500`}
        onClick={() => setShow(!show)}
      >
        <div
          className={`${isActiveIcon()}   flex h-[30px] w-[30px] items-center justify-center`}
        >
          {icon}
        </div>
        <div
          className={`flex w-full items-center ${isActiveText()} ${
            isMobile
              ? 'sidebar-text-size relative font-bold uppercase tracking-widest'
              : `sidebar-text-${isOpen}`
          }`}
        >
          {label}
          <div className="pl-2">
            {show ? getConstantIcons('down') : getConstantIcons('left')}
          </div>
        </div>
      </div>
      {show ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              opacity: 1,
              y: 0,
            },
            hidden: { opacity: 0, y: -10 },
          }}
          transition={{ ease: 'easeInOut', duration: 0.25 }}
          className={`relative flex flex-col ${
            isExpand ? `pl-4 ` : ``
          } sidebar-dropdown relative h-full`}
        >
          {children}
        </motion.div>
      ) : null}
    </div>
  )
}
