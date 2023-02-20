import React, { useEffect, useState } from 'react'
import NavAction from '../ui/navbar/NavAction'
import { getIcon, isLaptop } from '../../utils/utils'

const ClientDataNavbar = ({activeTab, setTabCallback}) => {
  const checkLaptop = isLaptop()

  return (
    <div className="flex items-center px-4 py-2 xl:py-0 mb-1 space-x-2 overflow-x-auto xl:overflow-visible max-w-[45vh] xl:max-w-none">
      <NavAction
        onClick={() => setTabCallback(1)}
        icon={getIcon('policy')}
        title={'Policies'}
        activeItem={activeTab}
        itemId={1}
      />
      <NavAction
        onClick={() => setTabCallback(2)}
        icon={getIcon('activity')}
        title={'Suspenses'}
        activeItem={activeTab}
        itemId={2}
      />
      {checkLaptop ? (
        <>
          <NavAction
            onClick={() => setTabCallback(3)}
            icon={getIcon('activity')}
            title={'Activity'}
            activeItem={activeTab}
            itemId={3}
          />
          <NavAction
            onClick={() => setTabCallback(4)}
            icon={getIcon('note')}
            title={'Notes'}
            activeItem={activeTab}
            itemId={4}
          />
          <NavAction
            onClick={() => setTabCallback(5)}
            icon={getIcon('file')}
            title={'Files'}
            activeItem={activeTab}
            itemId={5}
          />
        </>
      ) : null}
    </div>
  )
}
export default ClientDataNavbar
