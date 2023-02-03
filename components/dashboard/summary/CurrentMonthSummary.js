import { useTheme } from '@nextui-org/react'
import React from 'react'
import {
  abbreviateMoney,
  getCurrentMonth,
  getIcon,
  getPercentage,
  isLaptop,
  isMobile,
  sumFromArrayOfObjects,
  sumFromArrayOfObjects2,
  toMonthName,
} from '../../../utils/utils'
import DashboardSummaryCard from '../../ui/card/DashboardSummaryCard'
import PanelTitle from '../../ui/title/PanelTitle'


function CurrentMonthSummary({
  hideTitle = false,
  teamData = null,
  expiringPolicies = null,
  recentlyAdded = null,
}) {
  const { type } = useTheme()
  const currentMonthName = toMonthName(getCurrentMonth())
  const premSum = () => {
    return sumFromArrayOfObjects(teamData, 'prem')
  }
  const taskPercentage = () => {
    const completed = sumFromArrayOfObjects2(
      teamData,
      'tasks',
      'tasks_completed'
    )
    const total = sumFromArrayOfObjects2(teamData, 'tasks', 'tasks_total')
    const percentage = getPercentage(completed, total)
    return percentage
  }
  const renewalPercentage = () => {
    const completed = sumFromArrayOfObjects2(
      teamData,
      'renewal',
      'renewals_completed'
    )
    const total = sumFromArrayOfObjects2(teamData, 'renewal', 'renewals_total')
    const percentage = getPercentage(completed, total)
    return percentage
  }
  const mobile = isMobile()
  const laptop = isLaptop() 
  return (
    <div className={`flex h-full w-full flex-col`}>
      {!mobile && !hideTitle ? (
        <div className="pl-4">
          <PanelTitle title={`${currentMonthName} Summary`} color="pink" />
        </div>
      ) : null}
      <div
        className={`${
          mobile || laptop ? 'flex-wrap' : 'w-full'
        } flex gap-4 rounded-lg 2xl:px-2 py-2 xl:items-center`}
      >
        <DashboardSummaryCard
          gradient={'purple-to-green-gradient-1'}
          shadow
          shadowColor={'blue'}
          title={'Renewing Premium'}
          icon={getIcon('dollarSign')}
          chartData={null}
          content={`$${abbreviateMoney(teamData ? premSum() : 0)}`}
          animationDelay={0}
          useSparkline={false}
          useSmallHeight
          useBgIcons
        />
        <DashboardSummaryCard
          gradient={'purple-to-peach-gradient-1'}
          shadow
          shadowColor={'orange'}
          title={'Renewals Completed'}
          icon={getIcon('calendarCheck')}
          chartData={null}
          content={`${teamData ? renewalPercentage() : 0}%`}
          animationDelay={0}
          useSparkline={false}
          useSmallHeight
          useBgIcons
        />
        <DashboardSummaryCard
          gradient={'pink-to-blue-gradient-1'}
          shadow
          shadowColor={'pink'}
          title={'Tasks Completed'}
          icon={getIcon('circleCheck')}
          chartData={null}
          content={`${teamData ? taskPercentage() : 0}%`}
          animationDelay={0}
          useSparkline={false}
          useSmallHeight
          useBgIcons
        />
        <DashboardSummaryCard
          gradient={'orange-to-red-gradient-2'}
          shadow
          shadowColor={'orange'}
          title={'Expiring Soon'}
          icon={getIcon('calendarX')}
          chartData={null}
          useModal
          data={expiringPolicies}
          content={`${expiringPolicies.length}`}
          animationDelay={0}
          useSparkline={false}
          useSmallHeight
          useBgIcons
          usePolicyCard
        />
        <DashboardSummaryCard
          gradient={'blue-to-purple-to-cyan-gradient-1'}
          shadow
          shadowColor={'purple'}
          title={'Recently Added'}
          icon={getIcon('plus')}
          chartData={null}
          useModal
          data={recentlyAdded}
          content={`${recentlyAdded.length}`}
          animationDelay={0}
          useSparkline={false}
          useSmallHeight
          useBgIcons
          usePolicyCard
        />
        {/* <DashboardSummaryCard
          gradient={'pink-gradient-1'}
          shadow
          shadowColor={'pink'}
          title={'Expiring Soon'}
          icon={getIcon('circleX')}
          chartData={null}
          useModal
          data={recentlyAdded}
          content={`${recentlyAdded.length}`}
          animationDelay={0}
          useSparkline={false}
          usePolicyCard
        /> */}
      </div>
    </div>
  )
}

export default CurrentMonthSummary
