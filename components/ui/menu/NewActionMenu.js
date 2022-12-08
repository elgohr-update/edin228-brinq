import { Button, Dropdown, Popover, useTheme } from '@nextui-org/react'
import React, { useState } from 'react'
import { AiOutlineDown } from 'react-icons/ai'
import ActionMenuItem from './item/ActionMenuItem'
import { getIcon } from '../../../utils/utils'
import NewActivityModal from '../../activity/NewActivityModal'

const NewActionMenu = () => {
  const { type } = useTheme()
  const [shouldClose, setShouldClose] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [suspenseOnly, setSuspenseOnly] = useState(false)

  const openNewActivity = (isSuspense = false) => {
    setShowActivityModal(true)
    setSuspenseOnly(isSuspense)
  }

  const closeActivityModal = () => {
    setShowActivityModal(false)
    setSuspenseOnly(false)
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
        <Dropdown.Menu className="p-2 space-y-2" aria-label="Static Actions">
          <Dropdown.Item key="activity">
            <ActionMenuItem
              icon={getIcon('activity')}
              label="New Activity"
              onClick={() => openNewActivity()}
            />
          </Dropdown.Item>
          <Dropdown.Item key="suspense">
            <ActionMenuItem
              icon={getIcon('activity')}
              label="New Suspense"
              onClick={() => openNewActivity(true)}
            />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <NewActivityModal
        open={showActivityModal}
        callBack={closeActivityModal}
        createSuspenseOnly={suspenseOnly}
      />
    </div>
  )
}

export default NewActionMenu
