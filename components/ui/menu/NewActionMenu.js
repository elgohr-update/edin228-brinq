import { Button, Popover, useTheme } from '@nextui-org/react'
import React, { useState } from 'react'
import { AiOutlineDown } from 'react-icons/ai'
import { useTheme as useNextTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { BsPlusLg, BsClipboardPlus } from 'react-icons/bs'
import { MdOutlineStickyNote2 } from 'react-icons/md'
import HiddenBackdrop from '../../util/HiddenBackdrop'
import ActionMenuItem from './item/ActionMenuItem'
import { BiFolderPlus,BiCalendarPlus } from 'react-icons/bi'
import { FaRegPaperPlane } from 'react-icons/fa'

import { getConstantIcons } from '../../../utils/utils'

const NewActionMenu = () => {
  const { setTheme } = useNextTheme()
  const { isDark, type } = useTheme()
  const [openMenu, setOpenMenu] = useState(false)
  const router = useRouter()

  const closeMenu = () => {
    setOpenMenu(false)
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <Popover placement={`bottom-right`}>
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
            />
            <ActionMenuItem
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
            />
          </div>
        </Popover.Content>
      </Popover>
    </div>
  )
}

export default NewActionMenu
