import { Avatar, Tooltip, useTheme } from '@nextui-org/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useTheme as useNextTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useAgencyContext, useReloadContext } from '../../context/state'
import { timeout, useNextApi } from '../../utils/utils'

const UserAvatar = ({
  tooltip = false,
  size = 'md',
  tooltipPlacement = 'bottomEnd',
  isLink = true,
  squared = true,
  isUser = false,
  passUser = {},
  isGrouped = false,
}) => {
  const { setTheme } = useNextTheme()
  const { isDark, type } = useTheme()
  const router = useRouter()
  const { data: session } = useSession()
  const { agency, setAgency } = useAgencyContext()
  const { reload, setReload } = useReloadContext()

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled && !agency.id) {
        fetchData()
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    if (reload.agency) {
      let isCancelled = false
      const handleChange = async () => {
        await timeout(100)
        if (!isCancelled) {
          fetchData()
          setReload({
            ...reload,
            agency: false,
          })
        }
      }
      handleChange()
      return () => {
        isCancelled = true
      }
    }
  }, [reload])

  const fetchData = async () => {
    const res = await useNextApi('GET', `/api/agency/`)
    setAgency(res)
  }

  const user = isUser ? passUser : session?.user

  return (
    <div className="relative z-40 flex h-full w-full cursor-pointer">
      {tooltip && isLink ? (
        <Link href={`/user/${user?.id}`}>
          <a>
            <Tooltip content={user?.name} placement={tooltipPlacement}>
              <Avatar
                bordered={false}
                squared={squared}
                className={`${type}-shadow`}
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
              className={`${type}-shadow`}
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
            className={`${type}-shadow`}
            size={size}
            zoomed
            text={user?.name}
            src={user?.image ? user?.image : user?.image_file}
          />
        </Tooltip>
      ) : isGrouped ? (
        <Avatar
          squared={squared}
          className={`${type}-shadow`}
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
          className={`${type}-shadow`}
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
