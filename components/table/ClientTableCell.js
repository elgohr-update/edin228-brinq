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
  style = 1,
  companyId = null,
  parent = false,
  writing = false,
}) {
  const { clientDrawer, setClientDrawer } = useClientDrawerContext()

  const openSidebar = () => {
    if (isRnwl) {
      setClientDrawer({
        ...clientDrawer,
        nav: 1,
        isOpen: true,
        clientId: clientId,
        isRenewal: isRnwl,
        renewalMonth: month,
        renewalYear: year,
        style: style,
        companyId:companyId,
        parent:parent,
        writing:writing,
      })
    } else {
      setClientDrawer({
        ...clientDrawer,
        nav: 1,
        isOpen: true,
        clientId: clientId,
        style: style,
        companyId:companyId,
        parent:parent,
        writing:writing,
      })
    }
  }

  const checkTheme = () => {
    return type === 'dark'
      ? `page-link h-full w-full px-2 pb-1`
      : `page-link h-full w-full px-2 pb-1`
  }
  return (
    <div className="flex flex-col rounded-lg py-1 text-xs transition duration-200 ease-out hover:bg-gray-600/10">
      <div className={checkTheme()} onClick={() => openSidebar()}>
        <Link href={`/clients/${clientId}`}>
          <a className="flex transition duration-100 ease-in-out">
            {cellValue}
          </a>
        </Link>
      </div>
      <div className="pl-3">
        <TagContainer tags={tags} />
      </div>
      {subContent ? <div className="flex w-full px-4">{subContent}</div> : null}
    </div>
  )
}
