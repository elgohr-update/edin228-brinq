import React from 'react'
import NavAction from '../ui/navbar/NavAction'
import { getConstantIcons } from '../../utils/utils'
import { clientNavState } from '../../atoms/client'
import { useRecoilState } from 'recoil';

const ClientActionNavbar = () => {
  const [clientState, setClientState] = useRecoilState(clientNavState)

  const setActive = (key) => {
    setClientState({...clientState,actionNavbar:key})
  }

  return (
    <div className="flex items-center space-x-2 px-4 mb-1">
      <NavAction
        onClick={() => setActive(1)}
        icon={getConstantIcons('activity')}
        title={'Recent Activity'}
        activeItem={clientState.actionNavbar}
        itemId={1}
      />
      <NavAction
        onClick={() => setActive(2)}
        icon={getConstantIcons('note')}
        title={'Notes'}
        activeItem={clientState.actionNavbar}
        itemId={2}
      />
      <NavAction
        onClick={() => setActive(3)}
        icon={getConstantIcons('file')}
        title={'Files'}
        activeItem={clientState.actionNavbar}
        itemId={3}
      />
      <NavAction
        onClick={() => setActive(4)}
        icon={getConstantIcons('calendar')}
        title={'Events'}
        activeItem={clientState.actionNavbar}
        itemId={4}
      />
    </div>
  )
}
export default ClientActionNavbar
