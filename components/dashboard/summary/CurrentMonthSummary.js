import { useTheme } from '@nextui-org/react'
import React from 'react'
import {
  abbreviateMoney,
  getCurrentMonth,
  getPercentage,
  isMobile,
  sumFromArrayOfObjects,
  sumFromArrayOfObjects2,
  toMonthName,
} from '../../../utils/utils'
import PanelTitle from '../../ui/title/PanelTitle'

function CurrentMonthSummary({ hideTitle = false, data = null }) {
  const { type } = useTheme()
  const mobile = isMobile()
  const currentMonthName = toMonthName(getCurrentMonth())
  const premSum = () => {
    return sumFromArrayOfObjects(data, 'prem')
  }
  const taskPercentage = () => {
    const completed = sumFromArrayOfObjects2(data, 'tasks', 'tasks_completed')
    const total = sumFromArrayOfObjects2(data, 'tasks', 'tasks_total')
    const percentage = getPercentage(completed, total)
    return percentage
  }
  const renewalPercentage = () => {
    const completed = sumFromArrayOfObjects2(
      data,
      'renewal',
      'renewals_completed'
    )
    const total = sumFromArrayOfObjects2(data, 'renewal', 'renewals_total')
    const percentage = getPercentage(completed, total)
    return percentage
  }
  return (
    <div className={`flex h-full w-full flex-col`}>
      {!mobile && !hideTitle ? (
        <div className="pl-4">
          <PanelTitle title={`${currentMonthName} Summary`} color="pink" />
        </div>
      ) : null}
      <div className={`flex w-full items-center gap-4 rounded-lg p-4`}>
        <div
          className={`relative flex flex-auto flex-col border-b-[4px] overflow-hidden rounded-lg border-teal-500 px-2 text-right`}
        >
          <div className="text-4xl font-bold text-teal-500">
            ${abbreviateMoney(data ? premSum() : 0)}
          </div>
          <div className="py-2 font-bold ">Premium</div>
        </div>
        <div
          className={`relative flex flex-auto flex-col border-b-[4px] overflow-hidden rounded-lg border-orange-500 px-2 text-right`}
        >
          <div className="text-4xl font-bold text-orange-500">
            {data ? renewalPercentage() : 0}%
          </div>
          <div className="py-2 font-bold ">Renewals Completed</div>
        </div>
        <div
          className={`relative flex flex-auto flex-col border-b-[4px] overflow-hidden rounded-lg border-sky-500 px-2 text-right`}
        >
          <div className="text-4xl font-bold text-sky-500">
            {data ? taskPercentage() : 0}%
          </div>
          <div className="py-2 font-bold ">Tasks Completed</div>
        </div>
      </div>
    </div>
  )
}

export default CurrentMonthSummary
