import React, { useState } from 'react'
import { getConstantIcons } from '../../../utils/utils'
import NavAction from '../../ui/navbar/NavAction'

const TodosNavBar = ({activeItem=1, setTab}) => {

  const setActive = (key) => {
    setTab(key)
  }

  return (
    <div className="flex items-center space-x-1 px-2">
      <NavAction
        onClick={() => setActive(1)}
        icon={getConstantIcons('policy')}
        title={'All'}
        activeItem={activeItem}
        itemId={1}
      />
      <NavAction
        onClick={() => setActive(2)}
        icon={getConstantIcons('policy')}
        title={'Overdue'}
        activeItem={activeItem}
        itemId={2}
      />
      <NavAction
        onClick={() => setActive(3)}
        icon={getConstantIcons('policy')}
        title={'Today'}
        activeItem={activeItem}
        itemId={3}
      />
      <NavAction
        onClick={() => setActive(4)}
        icon={getConstantIcons('policy')}
        title={'Week'}
        activeItem={activeItem}
        itemId={4}
      />
    </div>
  )
}
export default TodosNavBar
