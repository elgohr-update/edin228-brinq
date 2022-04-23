import React, { useState } from 'react'
import NavAction from '../ui/navbar/NavAction'
import { getConstantIcons } from '../../utils/utils'
import { useAppContext } from '../../context/state'

const ClientActionNavbar = () => {
  const { state, setState } = useAppContext()
  const [activeItem, setActiveItem] = useState(state.client.actionNavbar)

  const setActive = (key) => {
    setActiveItem(key)
    setState({...state, client:{...state.client,actionNavbar:key}})
  }

  return (
    <div className="flex items-center space-x-2 px-4 mb-1">
      <NavAction
        onClick={() => setActive(1)}
        icon={getConstantIcons('activity')}
        title={'Recent Activity'}
        activeItem={activeItem}
        itemId={1}
      />
      <NavAction
        onClick={() => setActive(2)}
        icon={getConstantIcons('note')}
        title={'Notes'}
        activeItem={activeItem}
        itemId={2}
      />
      <NavAction
        onClick={() => setActive(3)}
        icon={getConstantIcons('file')}
        title={'Files'}
        activeItem={activeItem}
        itemId={3}
      />
      <NavAction
        onClick={() => setActive(4)}
        icon={getConstantIcons('calendar')}
        title={'Events'}
        activeItem={activeItem}
        itemId={4}
      />
    </div>
  )
}
export default ClientActionNavbar
