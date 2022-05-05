import Link from 'next/link'
import React from 'react'
import { useClientDrawerContext } from '../../context/state'
import TagContainer from '../ui/tag/TagContainer'

export default function ClientTableCell({
  type,
  clientId,
  tags,
  cellValue,
  isRnwl = false,
  month=null,
  year=null
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
      ? `page-link h-full w-full hover:bg-gray-600/10 p-4 rounded transition duration-100 ease-out`
      : `page-link h-full w-full hover:bg-gray-500/10 p-4 rounded transition duration-100 ease-out`
  }
  return (
    <div className="px-2 text-xs">
      <div className={checkTheme()} onClick={() => openSidebar()}>
        <Link href={`/client/${clientId}`}>
          <a className="transition duration-100 ease-in-out hover:text-sky-500">
            {cellValue}
          </a>
        </Link>
        <TagContainer tags={tags} />
      </div>
    </div>
  )
}
