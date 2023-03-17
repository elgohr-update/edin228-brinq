import Link from 'next/link'
import React, { useState } from 'react'
import { useClientDrawerContext } from '../../context/state'
import { getIcon } from '../../utils/utils'
import ClientDrawer from '../ui/drawer/ClientDrawer'
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
  drawerCallback = null,
  premiumTotal = null,
  renewedTotal = null,
}) {
  const { clientDrawer, setClientDrawer } = useClientDrawerContext()
  const [isOpen, setIsOpen] = useState(false)

  const closeDrawer = () => {
    const setDefault = {
      isOpen: false,
      clientId: null,
      isRenewal: false,
      renewalMonth: null,
      renewalYear: null,
      nav: 1,
      style: 1,
      company_id: null,
      parent: false,
      writing: false,
    }
    setClientDrawer(setDefault)
    return true
  }

  const openDrawer = (useStateDrawer = false) => {
    if (drawerCallback) {
      drawerCallback(clientId)
    } else if (useStateDrawer) {
      setClientDrawer({
        ...clientDrawer,
        nav: 1,
        isOpen: true,
        clientId: clientId,
        style: style,
        companyId: companyId,
        parent: parent,
        writing: writing,
      })
    }
  }

  return (
    <div className="z-[100] flex flex-col rounded-lg py-2 text-xs transition duration-200 ease-out hover:bg-gray-600/20">
      <div
        className={`page-link flex h-full w-full items-center justify-between px-2 pb-1`}
        onClick={() => openDrawer(true)}
      >
        <div className="flex items-center">
          <Link href={`/clients/${clientId}`}>
            <a className="flex transition duration-100 ease-in-out">
              {cellValue}
            </a>
          </Link>
          <div className="flex items-center ml-4 xl:hidden">
            {getIcon('rightDrawer')}
          </div>
        </div>
        {premiumTotal ? (
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <h4>Total Premium</h4>
              <div>{premiumTotal}</div>
            </div>
            <div className="flex flex-col items-end">
              <h4>Renewed</h4>
              <div>{renewedTotal}</div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="pl-2">
        <TagContainer tags={tags} />
      </div>
      {subContent ? <div className="flex w-full px-2">{subContent}</div> : null}
      {isOpen && !drawerCallback ? (
        <ClientDrawer
          clientId={clientId}
          isRenewal={isRnwl}
          companyId={companyId}
          parent={parent}
          writing={writing}
          callBack={() => setIsOpen(!isOpen)}
        />
      ) : null}
    </div>
  )
}
