import React, { useState } from 'react'
import NavAction from '../../ui/navbar/NavAction'
import { BsListTask,BsCalendarX } from 'react-icons/bs';
import DashboardExpiringPolicies from '../expiring/DashboardExpiringPolicies';
import DashboardRecentPolicies from '../policy/DashboardRecentPolicies';

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
        icon={<BsCalendarX />}
        title={'Expiring Soon'}
        activeItem={activeItem}
        itemId={1}
      />
      <NavAction
        onClick={() => setActive(2)}
        icon={<BsListTask />}
        title={'Recently Added Policies'}
        activeItem={activeItem}
        itemId={2}
      />
    </div>
  )
}
function DashboardExpiringAndRecent() {
  const [tab, setTab] = useState(1)
  const setActiveTab = (e) => {
    setTab(e)
  }
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col w-full xl:flex-row xl:items-center xl:justify-between">
        <ContainerNavbar activeItem={tab} setTab={(e) => setActiveTab(e)} />
      </div>
      <div>
        {tab == 1 ? (
          <DashboardExpiringPolicies hideTitle={true}/>
        ) : tab == 2 ? (
          <DashboardRecentPolicies hideTitle={true}/>
        ) : null}
      </div>
    </div>
  )
}

export default DashboardExpiringAndRecent
