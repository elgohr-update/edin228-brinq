import { Button, Dropdown, Popover, User, useTheme } from '@nextui-org/react'
import React from 'react'
import { FiLogOut } from 'react-icons/fi'
import { FaCog } from 'react-icons/fa'
import { RiFileUserFill } from 'react-icons/ri'
import UserAvatar from '../../user/Avatar'
import LinkedMenuItem from './item/LinkedMenuItem'
import { signOut } from 'next-auth/react'
import { getIcon } from '../../../utils/utils'

const UserMenu = () => {
  const { type } = useTheme()

  return (
    <div className="relative flex h-full w-full items-center justify-center menu-container">
      <Dropdown>
        <Dropdown.Trigger>
          <div className="flex cursor-pointer items-center">
            <div className="flex xl:hidden">
              <UserAvatar squared={false} tooltip={false} isLink={false} />
            </div>
            <div className="hidden xl:flex">
              <UserAvatar
                userWithName
                squared={false}
                tooltip={false}
                isLink={false}
              />
            </div>
            <div className="hidden xl:flex">{getIcon('down')}</div>
          </div>
        </Dropdown.Trigger>
        <Dropdown.Menu aria-label="Static Actions">
          <Dropdown.Item key="new">
            <LinkedMenuItem
              href="/user/profile"
              icon={<RiFileUserFill />}
              label="Profile"
            />
          </Dropdown.Item>
          <Dropdown.Item key="copy">
            <LinkedMenuItem
              href="/user/settings"
              icon={<FaCog />}
              label="Settings"
            />
          </Dropdown.Item>
          <Dropdown.Item key="delete" color="error" withDivider>
            <Button
              auto
              color="error"
              light
              size="xs"
              onClick={() => signOut()}
              className="w-full"
            >
              <div className="flex flex-auto items-center justify-between">
                <div className="flex w-full">
                  <FiLogOut />
                </div>
                <div className="flex w-full">Sign Out</div>
              </div>
            </Button>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default UserMenu
