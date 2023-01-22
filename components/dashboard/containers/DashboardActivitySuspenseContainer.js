import React, { useState } from 'react'
import DashboardActivity from '../activity/DashboardActivity'
import DashboardSuspense from '../suspense/DashboardSuspense'
import NavAction from '../../ui/navbar/NavAction'
import { BsListTask,BsCalendar2Week } from 'react-icons/bs';

const ContainerNavbar = ({ activeItem = 1, setTab }) => {
  const setActive = (key) => {
    setTab(key)
  }

  return (
    <div
      className={`flex items-center justify-start space-x-1 rounded-lg py-1 px-2`}
    >
      <NavAction
        onClick={() => setActive(1)}
        icon={<BsCalendar2Week />}
        title={'Suspenses'}
        activeItem={activeItem}
        itemId={1}
      />
      <NavAction
        onClick={() => setActive(2)}
        icon={<BsListTask />}
        title={'Recent Activity'}
        activeItem={activeItem}
        itemId={2}
      />
    </div>
  )
}
function DashboardActivitySuspenseContainer() {
  const [tab, setTab] = useState(1)
  const setActiveTab = (e) => {
    setTab(e)
  }
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col w-full md:flex-row md:items-center md:justify-between">
        <ContainerNavbar activeItem={tab} setTab={(e) => setActiveTab(e)} />
      </div>
      <div>
        {tab == 1 ? (
          <DashboardSuspense hideTitle={true}/>
        ) : tab == 2 ? (
          <DashboardActivity hideTitle={true}/>
        ) : null}
      </div>
    </div>
  )
}

export default DashboardActivitySuspenseContainer
