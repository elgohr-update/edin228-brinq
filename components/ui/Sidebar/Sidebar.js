import { useTheme } from '@nextui-org/react'
import React, { useState } from 'react'
import SidebarItemContainer from './SidebarItemContainer'

const Sidebar = () => {
  const [expand, setExpand] = useState(false)
  const { type } = useTheme()

  const isExpand = () => {
    if (expand) {
      return `open`
    }
    return `closed`
  }
  const hoverSidebar = (status) => {
    const res = status === 'in' ? true : false
    setExpand(res)
  }

  return (
    <div className="relative z-50 flex h-full min-w-[50px] w-full flex-col">
      <div
        className={`absolute flex h-full w-full flex-col justify-between ${
          expand ? `sidebar-theme-${type} ${type}-shadow` : ``
        } sidebar-${isExpand()}`}
        onMouseOver={() => hoverSidebar('in')}
        onMouseOut={() => hoverSidebar('out')}
      >
        <SidebarItemContainer expand={expand} />
      </div>
    </div>
  )
}

export default Sidebar
