import { Avatar, Tooltip, User, useTheme } from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'
import { useSession } from 'next-auth/react'
import { useAgencyContext } from '../../context/state'

const UserAvatar = ({
  tooltip = false,
  size = 'md',
  tooltipPlacement = 'bottomEnd',
  isLink = true,
  squared = true,
  isUser = false,
  passUser = {},
  isGrouped = false,
  userWithName = false,
  userSubContent = null,
  userTitle = true,
  userEmail = false,
  lookUpUser = null
}) => {
  const { type } = useTheme()
  const { data: session } = useSession()
  const { agency, setAgency } = useAgencyContext()

  const getUserFromLookUp = () => {
    const u = agency.users.find( x => x.id == lookUpUser)
    return u
  }

  const user = isUser ? passUser : lookUpUser ? getUserFromLookUp() : session?.user

  const getPosition = () => {
    return user?.owner
      ? 'Owner'
      : user?.producer
      ? 'Producer'
      : user?.account_manager
      ? 'Account Manager'
      : user?.support
      ? 'Support'
      : 'Admin'
  }

  return (
    <div className="relative z-40 flex w-full h-full cursor-pointer">
      {userWithName ? (
        <User
          src={user?.image_file}
          name={user?.name}
          description={userEmail ? user?.email : userTitle ? getPosition() : null}
          squared={squared}
        />
      ) : tooltip && isLink ? (
        <Link href={`/user/${user?.id}`}>
          <a>
            <Tooltip content={user?.name} placement={tooltipPlacement}>
              <Avatar
                bordered={false}
                squared={squared}
                
                pointer
                size={size}
                zoomed
                text={user?.name}
                src={user?.image ? user?.image : user?.image_file}
              />
            </Tooltip>
          </a>
        </Link>
      ) : isLink ? (
        <Link href={`/user/${user?.id}`}>
          <a>
            <Avatar
              bordered={false}
              squared={squared}
              
              pointer
              size={size}
              zoomed
              text={user?.name}
              src={user?.image ? user?.image : user?.image_file}
            />
          </a>
        </Link>
      ) : tooltip ? (
        <Tooltip content={user?.name} placement={tooltipPlacement}>
          <Avatar
            bordered={false}
            squared={squared}
            
            size={size}
            zoomed
            text={user?.name}
            src={user?.image ? user?.image : user?.image_file}
          />
        </Tooltip>
      ) : isGrouped ? (
        <Avatar
          squared={squared}
          
          size={size}
          color="gradient"
          bordered={false}
          zoomed
          text={user?.name}
          src={user?.image ? user?.image : user?.image_file}
        />
      ) : (
        <Avatar
          squared={squared}
          bordered={false}
          
          size={size}
          color="gradient"
          zoomed
          text={user?.name}
          src={user?.image ? user?.image : user?.image_file}
        />
      )}
    </div>
  )
}

export default UserAvatar
