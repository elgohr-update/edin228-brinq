import React, { useState } from 'react'
import NavAction from '../ui/navbar/NavAction'
import { getIcon } from '../../utils/utils'
import { useClientDrawerContext } from '../../context/state'

const ClientDrawerNavbar = () => {
  const { clientDrawer, setClientDrawer } = useClientDrawerContext()
  const [activeItem, setActiveItem] = useState(clientDrawer.nav)

  const setActive = (key) => {
    setActiveItem(key)
    setClientDrawer({...clientDrawer,nav:key})
  }

  return (
    <div className="flex items-center space-x-2 px-4 mb-1">
      <NavAction
        onClick={() => setActive(1)}
        icon={getIcon('policy')}
        title={'Policies'}
        activeItem={activeItem}
        itemId={1}
      />
      {/* <NavAction
        onClick={() => setActive(2)}
        icon={getIcon('deal')}
        title={'Deals'}
        activeItem={activeItem}
        itemId={2}
      /> */}
      {/* <NavAction
        onClick={() => setActive(3)}
        icon={getIcon('email')}
        title={'Emails'}
        activeItem={activeItem}
        itemId={3}
      />
      <NavAction
        onClick={() => setActive(4)}
        icon={getIcon('activity')}
        title={'Suspenses'}
        activeItem={activeItem}
        itemId={4}
      /> */}
    </div>
  )
}
export default ClientDrawerNavbar
