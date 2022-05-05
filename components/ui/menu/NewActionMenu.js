import { Button, Popover, useTheme } from '@nextui-org/react'
import React, { useState } from 'react'
import { AiOutlineDown } from 'react-icons/ai'
import { BsClipboardPlus } from 'react-icons/bs'
import ActionMenuItem from './item/ActionMenuItem'
import { BiFolderPlus,BiCalendarPlus } from 'react-icons/bi'
import { FaRegPaperPlane } from 'react-icons/fa'
import { getConstantIcons } from '../../../utils/utils'
import { useActivityDrawerContext } from '../../../context/state'

const NewActionMenu = () => {
  const { type } = useTheme()
  const { activityDrawer,setActivityDrawer } = useActivityDrawerContext()
  const [shouldClose, setShouldClose] = useState(false)

  const openNewActivity = () => {
    setShouldClose(true)
    setActivityDrawer({...activityDrawer,isOpen:true})
    
    // setShouldClose(false)
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <Popover placement={`bottom-right`} triggerType={'menu'}>
        <Popover.Trigger>
          <Button
            size="xs"
            className={`${type}-shadow`}
            color="gradient"
            auto
          >
            <div className="flex items-center space-x-2 pr-2">
              <div>
                { getConstantIcons('plus') }
              </div>
              <div className="hidden md:flex tracking-widest">Create</div>
            </div>
            <div className="pl-2">
              <AiOutlineDown />
            </div>
          </Button>
        </Popover.Trigger>
        <Popover.Content>
          <div className="flex w-full flex-col space-y-1 p-1">
            <ActionMenuItem
              icon={getConstantIcons('activity')}
              label="New Activity/Suspense"
              onClick={() => openNewActivity()}
            />
            {/* <ActionMenuItem
              icon={<BiCalendarPlus />}
              label="New Calendar Event"
            />
            <ActionMenuItem
              icon={<BiFolderPlus />}
              label="New Client"
            />
            <ActionMenuItem
              icon={<FaRegPaperPlane />}
              label="New Email"
            />
            <ActionMenuItem
              icon={<BsClipboardPlus />}
              label="New Deal"
            /> */}
          </div>
        </Popover.Content>
      </Popover>
    </div>
  )
}

export default NewActionMenu
