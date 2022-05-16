import Link from 'next/link'
import React from 'react'
import { useClientDrawerContext } from '../../context/state'
import TagContainer from '../ui/tag/TagContainer'

export default function ClientTableCell({
  type,
  clientId,
  tags = [],
  cellValue,
  isRnwl = false,
  subContent = null,
  month = null,
  year = null,
}) {
  const { clientDrawer, setClientDrawer } = useClientDrawerContext()

  const openSidebar = () => {
    if (isRnwl) {
      setClientDrawer({
        ...clientDrawer,
        nav: 1,
        isOpen: true,
        clientId: clientId,
        renewalMonth: month,
        renewalYear: year,
      })
    } else {
      setClientDrawer({
        ...clientDrawer,
        nav: 1,
        isOpen: true,
        clientId: clientId,
      })
    }
  }

  const checkTheme = () => {
    return type === 'dark'
      ? `page-link h-full w-full px-2 pb-1`
      : `page-link h-full w-full px-2 pb-1`
  }
  return (
    <div className="flex flex-col py-1 rounded-lg text-xs hover:bg-gray-600/10 transition duration-200 ease-out">
      <div className={checkTheme()} onClick={() => openSidebar()}>
        <Link href={`/clients/${clientId}`}>
          <a className="flex transition duration-100 ease-in-out">
            {cellValue}
          </a>
        </Link>
      </div>
      <div>
        <TagContainer tags={tags} />
      </div>
      {subContent ? <div className="flex w-full px-4">{subContent}</div> : null}
    </div>
  )
}
