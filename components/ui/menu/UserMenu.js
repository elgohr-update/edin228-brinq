import { Button, Popover, useTheme } from '@nextui-org/react'
import React from 'react'
import { FiLogOut } from 'react-icons/fi'
import { FaCog } from 'react-icons/fa'
import { RiFileUserFill } from 'react-icons/ri'
import UserAvatar from '../../user/Avatar'
import LinkedMenuItem from './item/LinkedMenuItem'
import { signOut } from 'next-auth/react'

const UserMenu = () => {
  const { type } = useTheme()

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <Popover placement={`bottom-right`}>
        <Popover.Trigger>
          <div>
            <UserAvatar squared={false} tooltip={false} isLink={false} />
          </div>
        </Popover.Trigger>
        <Popover.Content>
          <div className="flex w-full flex-col space-y-1 p-1">
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
                <div className="flex items-center gap-4">
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
