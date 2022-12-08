import React, { useState } from 'react'
import NavAction from '../ui/navbar/NavAction'
import { getIcon } from '../../utils/utils'
import { useAppContext } from '../../context/state'

const ClientActionNavbar = () => {
  const { state, setState } = useAppContext()
  const [activeItem, setActiveItem] = useState(state.client.actionNavbar)

  const setActive = (key) => {
    setActiveItem(key)
    setState({...state, client:{...state.client,actionNavbar:key}})
  }

  return (
    <div className="flex items-center px-4 mb-1 space-x-2">
      <NavAction
        onClick={() => setActive(1)}
        icon={getIcon('activity')}
        title={'Recent Activity'}
        activeItem={activeItem}
        itemId={1}
      />
      <NavAction
        onClick={() => setActive(2)}
        icon={getIcon('note')}
        title={'Notes'}
        activeItem={activeItem}
        itemId={2}
      />
      <NavAction
        onClick={() => setActive(3)}
        icon={getIcon('file')}
        title={'Files'}
        activeItem={activeItem}
        itemId={3}
      />
      {/* <NavAction
        onClick={() => setActive(4)}
        icon={getIcon('calendar')}
        title={'Events'}
        activeItem={activeItem}
        itemId={4}
      /> */}
    </div>
  )
}
export default ClientActionNavbar
