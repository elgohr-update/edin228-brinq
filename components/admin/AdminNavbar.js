import React, { useState } from 'react'
import NavAction from '../ui/navbar/NavAction'
import { getIcon } from '../../utils/utils'
import { useAppContext } from '../../context/state'

const AdminNavbar = () => {
  const { state, setState } = useAppContext()
  const [activeItem, setActiveItem] = useState(state.admin.navBar)

  const setActive = (key) => {
    setActiveItem(key)
    setState({...state, admin:{...state.admin,navBar:key}})
  }

  return (
    <div className={`flex items-center space-x-2`}>
      <NavAction
        onClick={() => setActive(1)}
        icon={getIcon('agency')}
        title={'Agency Information'}
        activeItem={activeItem}
        itemId={1}
      />
      <NavAction
        onClick={() => setActive(2)}
        icon={getIcon('deal')}
        title={'Deals & Sales Setttings'}
        activeItem={activeItem}
        itemId={2}
      />
      <NavAction
        onClick={() => setActive(3)}
        icon={getIcon('policy')}
        title={'Policy Setttings'}
        activeItem={activeItem}
        itemId={4}
      />
    </div>
  )
}
export default AdminNavbar
