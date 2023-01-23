import React, { useState } from 'react'
import NavAction from '../ui/navbar/NavAction'
import { getIcon, isLaptop } from '../../utils/utils'
import { useAppContext } from '../../context/state'

const ClientDataNavbar = () => {
  const { state, setState } = useAppContext()
  const [activeItem, setActiveItem] = useState(state.client.dataNavbar)

  const setActive = (key) => {
    setActiveItem(key)
    setState({ ...state, client: { ...state.client, dataNavbar: key } })
  }

  const checkLaptop = isLaptop()

  return (
    <div className="flex items-center px-4 mb-1 space-x-2">
      <NavAction
        onClick={() => setActive(1)}
        icon={getIcon('policy')}
        title={'Policies'}
        activeItem={activeItem}
        itemId={1}
      />
      <NavAction
        onClick={() => setActive(2)}
        icon={getIcon('activity')}
        title={'Suspenses'}
        activeItem={activeItem}
        itemId={2}
      />
      {checkLaptop ? (
        <>
          <NavAction
            onClick={() => setActive(3)}
            icon={getIcon('activity')}
            title={'Activity'}
            activeItem={activeItem}
            itemId={3}
          />
          <NavAction
            onClick={() => setActive(4)}
            icon={getIcon('note')}
            title={'Notes'}
            activeItem={activeItem}
            itemId={4}
          />
          <NavAction
            onClick={() => setActive(5)}
            icon={getIcon('file')}
            title={'Files'}
            activeItem={activeItem}
            itemId={5}
          />
        </>
      ) : null}
    </div>
  )
}
export default ClientDataNavbar
