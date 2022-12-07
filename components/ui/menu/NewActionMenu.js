import { Button, Dropdown, Popover, useTheme } from '@nextui-org/react'
import React, { useState } from 'react'
import { AiOutlineDown } from 'react-icons/ai'
import { BsClipboardPlus } from 'react-icons/bs'
import ActionMenuItem from './item/ActionMenuItem'
import { BiFolderPlus, BiCalendarPlus } from 'react-icons/bi'
import { FaRegPaperPlane } from 'react-icons/fa'
import { getIcon } from '../../../utils/utils'
import { useActivityDrawerContext } from '../../../context/state'
import NewActivityModal from '../../activity/NewActivityModal'

const NewActionMenu = () => {
  const { type } = useTheme()
  const [shouldClose, setShouldClose] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)

  const openNewActivity = () => {
    setShowActivityModal(true)
  }

  const closeActivityModal = () => {
    setShowActivityModal(false)
  }

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <Dropdown>
        <Dropdown.Trigger>
          <Button size="xs" className={`${type}-shadow`} color="gradient" auto>
            <div className="flex items-center space-x-2 text-xs">
              <div>{getIcon('plus')}</div>
            </div>
            <div className="pl-2">
              <AiOutlineDown />
            </div>
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Menu aria-label="Static Actions">
          <Dropdown.Item key="activity">
            <ActionMenuItem
              icon={getIcon('activity')}
              label="New Activity/Suspense"
              onClick={() => openNewActivity()}
            />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <NewActivityModal
        open={showActivityModal}
        callBack={closeActivityModal}
      />
    </div>
  )
}

export default NewActionMenu
