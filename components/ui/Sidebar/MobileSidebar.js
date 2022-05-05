import { Button, useTheme } from '@nextui-org/react'
import React, { useState } from 'react'
import HiddenBackdrop from '../../util/HiddenBackdrop'
import SidebarItemContainer from './SidebarItemContainer'
import { RiMenu4Line } from 'react-icons/ri'

const MobileSidebar = () => {
  const [open, setOpen] = useState(false)
  const { type } = useTheme()

  return (
    <div className="relative z-50 flex h-full w-full flex-col">
      <div className="z-20">
        <Button flat color="primary" auto size="sm" onClick={() => setOpen(true)}>
          <RiMenu4Line />
        </Button>
      </div>
      {open ? (
        <div
          className={`z-50 fixed left-0 top-0 flex h-full w-full flex-col justify-between panel-theme-${type} ${type}-shadow sidebar-open`}
        >
          <SidebarItemContainer isMobile expand={true} />
        </div>
      ) : null}
      {open ? <HiddenBackdrop onClick={() => setOpen(false)} /> : null}
    </div>
  )
}

export default MobileSidebar
