import { Button, Popover, User, useTheme } from '@nextui-org/react'
import React from 'react'
import { FiLogOut } from 'react-icons/fi'
import { FaCog } from 'react-icons/fa'
import { RiFileUserFill } from 'react-icons/ri'
import UserAvatar from '../../user/Avatar'
import LinkedMenuItem from './item/LinkedMenuItem'
import { signOut } from 'next-auth/react'
import { getConstantIcons } from '../../../utils/utils'

const UserMenu = () => {
  const { type } = useTheme()

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <Popover placement={`bottom-right`}>
        <Popover.Trigger>
          <div className="flex items-center cursor-pointer">
            <div className="flex lg:hidden">
              <UserAvatar squared={false} tooltip={false} isLink={false} />
            </div>
            <div className="hidden lg:flex">
              <UserAvatar userWithName squared={false} tooltip={false} isLink={false} />
            </div>
            <div>
              { getConstantIcons('down') }
            </div>
          </div>
        </Popover.Trigger>
        <Popover.Content>
          <div className="flex w-full flex-col space-y-1 p-1 lg:w-[180px]">
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
            <div
              className={`panel-flat-${type} flex w-full items-center justify-center rounded-b-lg p-1`}
            >
              <Button
                auto
                color="error"
                light
                size="xs"
                onClick={() => signOut()}
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <FiLogOut />
                  </div>
                  <div>Sign Out</div>
                </div>
              </Button>
            </div>
          </div>
        </Popover.Content>
      </Popover>
    </div>
  )
}

export default UserMenu
