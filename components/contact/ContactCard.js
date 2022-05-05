import React from 'react'
import { Popover, Tooltip, useTheme } from '@nextui-org/react'
import { MdPermContactCalendar } from 'react-icons/md'
import { AiOutlineMore } from 'react-icons/ai'
import { getConstantIcons } from '../../utils/utils'

const ContactCard = ({
  contact,
  border = false,
  vertical = false,
  panel = false,
  shadow = false,
}) => {
  const { isDark, type } = useTheme()

  const isVertical = () => {
    return vertical ? `flex-col space-y-2` : `flex-row items-center`
  }
  const isPanel = () => {
    return panel ? `panel-flat-${type}` : ``
  }
  const isShadow = () => {
    return shadow ? `${type}-shadow` : ``
  }
  const isBorder = () => {
    return border
      ? `${isDark ? `border-slate-900` : `border-slate-200`} border`
      : ``
  }
  const baseClass = `flex min-w-[240px] p-2 rounded-lg ${isBorder()} ${isVertical()} ${isPanel()} ${isShadow()}`
  return (
    <div className={baseClass}>
      <div className="flex w-full items-center">
        <div className={`${vertical ? 'flex justify-end' : `flex`} z-20`}>
          <div
            className={`flex items-center ${type}-shadow mr-2 justify-center rounded ${
              isDark ? 'bg-slate-500/20' : 'bg-white/40'
            } h-[30px] w-[30px] p-2`}
          >
            <div className={``}>
              <MdPermContactCalendar />
            </div>
          </div>
        </div>
        <div
          className={`relative z-20 flex flex-col ${vertical ? '' : `w-full`}`}
        >
          <h6 className={`font-semibold`}>
            {contact.first_name} {contact.last_name}
          </h6>
          <h4 className={``}>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </h4>
        </div>
      </div>
      <Popover placement={`top-right`} triggerType={'menu'}>
        <Popover.Trigger>
          <div className="flex cursor-pointer transition duration-100 ease-out hover:text-sky-500">
            <AiOutlineMore />
          </div>
        </Popover.Trigger>
        <Popover.Content>
          <div className="flex w-full h-full px-4 py-2 items-center gap-4">
            <Tooltip content={'Edit'}>
                <div className="flex items-center justify-center transition duration-100 ease-out hover:text-sky-500 cursor-pointer">{getConstantIcons('edit')}</div>
            </Tooltip>
            <Tooltip content={'Primary Contact'}>
                <div className="flex items-center justify-center transition duration-100 ease-out hover:text-orange-500 cursor-pointer">{getConstantIcons('star')}</div>
            </Tooltip>
            <Tooltip content={'Remove'}>
                <div className="flex items-center justify-center transition duration-100 ease-out hover:text-red-500 cursor-pointer">{getConstantIcons('trash')}</div>
            </Tooltip>
          </div>
        </Popover.Content>
      </Popover>
    </div>
  )
}

export default ContactCard
