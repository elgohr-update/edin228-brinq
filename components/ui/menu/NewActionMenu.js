import { Button, Dropdown, Popover, useTheme } from '@nextui-org/react'
import React, { useState } from 'react'
import { AiOutlineDown } from 'react-icons/ai'
import { BsClipboardPlus } from 'react-icons/bs'
import ActionMenuItem from './item/ActionMenuItem'
import { BiFolderPlus, BiCalendarPlus } from 'react-icons/bi'
import { FaRegPaperPlane } from 'react-icons/fa'
import { getConstantIcons } from '../../../utils/utils'
import { useActivityDrawerContext } from '../../../context/state'

const NewActionMenu = () => {
  const { type } = useTheme()
  const { activityDrawer, setActivityDrawer } = useActivityDrawerContext()
  const [shouldClose, setShouldClose] = useState(false)

  const openNewActivity = () => {
    setShouldClose(true)
    setActivityDrawer({ ...activityDrawer, isOpen: true })

    // setShouldClose(false)
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <Dropdown>
        <Dropdown.Trigger>
          <Button size="xs" className={`${type}-shadow`} color="gradient" auto>
            <div className="flex items-center space-x-2 text-xs">
              <div>{getConstantIcons('plus')}</div>
            </div>
            <div className="pl-2">
              <AiOutlineDown />
            </div>
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Menu aria-label="Static Actions">
          <Dropdown.Item key="activity">
            <ActionMenuItem
              icon={getConstantIcons('activity')}
              label="New Activity/Suspense"
              onClick={() => openNewActivity()}
            />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default NewActionMenu
