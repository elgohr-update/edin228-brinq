import { useTheme } from '@nextui-org/react'
import React from 'react'
import {
  BsListTask,
  BsCalendarX,
  BsCalendarEvent,
  BsCalendar2Week,
} from 'react-icons/bs'
import NavAction from '../ui/navbar/NavAction'

const DashboardMobileNav = ({ activeItem = 1, setTab }) => {
  const { type } = useTheme()
  const setActive = (key) => {
    setTab(key)
  }

  return (
    <div
      className={`mb-2 flex items-center space-x-1  p-2 panel-theme-${type} ${type}-shadow`}
    >
      <NavAction
        onClick={() => setActive(1)}
        icon={<BsListTask />}
        title={'Todos'}
        activeItem={activeItem}
        itemId={1}
      />
      <NavAction
        onClick={() => setActive(2)}
        icon={<BsCalendarX />}
        title={'Activity'}
        activeItem={activeItem}
        itemId={2}
      />
      <NavAction
        onClick={() => setActive(3)}
        icon={<BsCalendarEvent />}
        title={'Audits'}
        activeItem={activeItem}
        itemId={3}
      />
      <NavAction
        onClick={() => setActive(4)}
        icon={<BsCalendar2Week />}
        title={'Expiring'}
        activeItem={activeItem}
        itemId={4}
      />
      <NavAction
        onClick={() => setActive(5)}
        icon={<BsCalendar2Week />}
        title={'Recently Added'}
        activeItem={activeItem}
        itemId={5}
      />
    </div>
  )
}
export default DashboardMobileNav
