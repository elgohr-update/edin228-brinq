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
  tasksTotal = null,
  faded = false,
  color = 'def',
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

  const getColor = () => {
    const def = 'tag-gray-bg'
    switch (color) {
      case 'green':
        return 'deal-tag-green'
      case 'blue':
        return 'deal-tag-blue'
      case 'red':
        return 'deal-tag-red'
      case 'orange':
        return 'deal-tag-orange'
      case 'purple':
        return 'deal-tag-purple'
      case 'pink':
        return 'deal-tag-pink'
      case 'yellow':
        return 'deal-tag-yellow'
      case 'subtle':
        return 'deal-tag-subtle'
      default:
        return def
    }
  }

  return (
    <div
      className={`z-[100] flex rounded-lg text-xs transition duration-200 ease-out`}
    >
      <div
        className={`page-link flex h-full w-full items-center justify-between px-2`}
        onClick={() => openDrawer(true)}
      >
        <div className="flex items-center">
          <a className={`font-bold`}><div className={` ${faded ? 'opacity-60' : ''}`}>{cellValue}</div></a>
          <div className="flex items-center pb-1 pl-2">
            <TagContainer tags={tags} />
          </div>
        </div>
        {premiumTotal ? (
          <div className="flex items-center gap-2 pr-3">
            <div className="flex flex-col items-end">
              <h4>Total Premium</h4>
              <div>{premiumTotal}</div>
            </div>
            <div className="flex flex-col items-end">
              <h4>Renewed</h4>
              <div>{renewedTotal}</div>
            </div>
            <div className="flex flex-col items-end">
              <h4>Tasks</h4>
              <div>{tasksTotal}</div>
            </div>
          </div>
        ) : null}
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
