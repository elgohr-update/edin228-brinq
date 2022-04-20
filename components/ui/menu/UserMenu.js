import { Button, Switch, useTheme } from '@nextui-org/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { AiOutlineDown } from 'react-icons/ai'
import { useTheme as useNextTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { BsPlusLg } from 'react-icons/bs'
import { FiLogOut } from 'react-icons/fi'
import { FaCog } from 'react-icons/fa'
import { RiFileUserFill } from 'react-icons/ri'
import HiddenBackdrop from '../../util/HiddenBackdrop'
import UserAvatar from '../../user/Avatar'
import LinkedMenuItem from './item/LinkedMenuItem'

const UserMenu = () => {
  const { setTheme } = useNextTheme()
  const { isDark, type } = useTheme()
  const [openMenu, setOpenMenu] = useState(false)
  const router = useRouter()

  const closeMenu = () => {
    setOpenMenu(false)
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div onClick={() => setOpenMenu(!openMenu)}>
        <UserAvatar squared={false} tooltip={false} isLink={false} />
      </div>
      {openMenu ? <HiddenBackdrop onClick={() => closeMenu()} /> : null}
      <div
        className={
          openMenu
            ? `opacity-1 min-h-20 absolute top-[50px] right-[2px] z-50 w-[160px] rounded transition-all duration-200 ease-out panel-theme-${type} ${type}-shadow`
            : 'absolute top-[-200px] w-[160px] right-[2px] opacity-0 transition-all duration-200 ease-out'
        }
      >
        <div
          className={`flex h-full flex-col justify-between ${
            openMenu ? 'opacity-1' : 'opacity-0'
          }`}
        >
          <div className="flex w-full flex-col space-y-2 py-2 px-1">
            <LinkedMenuItem
              href="/user/profile"
              icon={<RiFileUserFill />}
              label="Profile"
            />
            <LinkedMenuItem
              href="/user/settings"
              icon={<FaCog />}
              label="Settings"
            />
          </div>
          <div className={`panel-flat-${type} p-1`}>
            <LinkedMenuItem
              href="/user/signout"
              icon={<FiLogOut />}
              label="Sign Out"
              isColor
              color="error"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserMenu
