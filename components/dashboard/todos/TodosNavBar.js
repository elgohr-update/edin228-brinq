import React from 'react'
import NavAction from '../../ui/navbar/NavAction'
import { BsListTask,BsCalendarX,BsCalendarEvent,BsCalendar2Week } from 'react-icons/bs';
import { useTheme } from '@nextui-org/react';

const TodosNavBar = ({activeItem=1, setTab}) => {
  const { type } = useTheme()
  const setActive = (key) => {
    setTab(key)
  }

  return (
    <div className={`flex items-center justify-center xl:justify-start space-x-1 rounded-lg px-2 py-1`}>
      <NavAction
        onClick={() => setActive(1)}
        icon={<BsListTask/>}
        title={'All'}
        activeItem={activeItem}
        itemId={1}
      />
      <NavAction
        onClick={() => setActive(2)}
        icon={<BsCalendarX/>}
        title={'Overdue'}
        activeItem={activeItem}
        itemId={2}
      />
      <NavAction
        onClick={() => setActive(3)}
        icon={<BsCalendarEvent/>}
        title={'Today'}
        activeItem={activeItem}
        itemId={3}
      />
      <NavAction
        onClick={() => setActive(4)}
        icon={<BsCalendar2Week/>}
        title={'Week'}
        activeItem={activeItem}
        itemId={4}
      />
    </div>
  )
}
export default TodosNavBar
