import React, { useState } from 'react'
import NavAction from '../ui/navbar/NavAction'
import { getConstantIcons } from '../../utils/utils'
import { useAppContext } from '../../context/state'

const ClientDataNavbar = () => {
  const { state, setState } = useAppContext()
  const [activeItem, setActiveItem] = useState(state.client.dataNavbar)

  const setActive = (key) => {
    setActiveItem(key)
    setState({...state, client:{...state.client,dataNavbar:key}})
  }

  return (
    <div className="flex items-center space-x-2 px-4 mb-1">
      <NavAction
        onClick={() => setActive(1)}
        icon={getConstantIcons('policy')}
        title={'Policies'}
        activeItem={activeItem}
        itemId={1}
      />
      <NavAction
        onClick={() => setActive(2)}
        icon={getConstantIcons('deal')}
        title={'Deals'}
        activeItem={activeItem}
        itemId={2}
      />
      <NavAction
        onClick={() => setActive(3)}
        icon={getConstantIcons('email')}
        title={'Emails'}
        activeItem={activeItem}
        itemId={3}
      />
      <NavAction
        onClick={() => setActive(4)}
        icon={getConstantIcons('activity')}
        title={'Suspenses'}
        activeItem={activeItem}
        itemId={4}
      />
    </div>
  )
}
export default ClientDataNavbar
