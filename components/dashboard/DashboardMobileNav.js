import { useTheme } from '@nextui-org/react'
import React from 'react'
import { AiFillInfoCircle, AiOutlineCalendar } from 'react-icons/ai'
import {
  BsListTask,
  BsCalendarX,
  BsCalendarEvent,
  BsCalendar2Week,
} from 'react-icons/bs'
import { MdOutlineDashboard, MdOutlineStickyNote2 } from 'react-icons/md'
import MobileNavAction from '../ui/navbar/MobileNavAction'
import NavAction from '../ui/navbar/NavAction'

const DashboardMobileNav = ({ activeItem = 1, setTab }) => {
  const { type } = useTheme()
  const setActive = (key) => {
    setTab(key)
  }

  return (
    <div
      className={`mb-2 flex items-center space-x-1  p-2`}
    >
      <MobileNavAction
        onClick={() => setActive(1)}
        icon={<MdOutlineDashboard />}
        title={'Dashboard'}
        activeItem={activeItem}
        itemId={1}
      />
      <MobileNavAction
        onClick={() => setActive(2)}
        icon={<BsListTask />}
        title={'Todos'}
        activeItem={activeItem}
        itemId={2}
      />
      <MobileNavAction
        onClick={() => setActive(3)}
        icon={<MdOutlineStickyNote2/>}
        title={'Activity'}
        activeItem={activeItem}
        itemId={3}
      />
      <MobileNavAction
        onClick={() => setActive(4)}
        icon={<AiOutlineCalendar />}
        title={'Suspenses'}
        activeItem={activeItem}
        itemId={4}
      />
    </div>
  )
}
export default DashboardMobileNav
