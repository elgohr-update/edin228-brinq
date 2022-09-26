import { useTheme } from '@nextui-org/react'
import React from 'react'
import { abbreviateMoney, sumFromArrayOfObjects } from '../../../utils/utils'

function CarrierSummaryCard(data) {
  const { type } = useTheme()

  const premSum = () => {
    return sumFromArrayOfObjects(data?.data.policies, 'premium')
  }

  return (
    <div
      className={`flex flex-col w-full xl:w-[200px] rounded-lg p-2`}
    >
      <div className="flex flex-col relative">
        <div className="text-xs">{data?.data.name}</div>
        <div className={`bottom-border-flair pink-gradient-1`} />
      </div>
      <div className="flex items-center justify-end space-x-2 text-xs mt-2">
        <div className="text-orange-500">{data?.data.policies.length}</div>
        <div className="text-teal-500">${abbreviateMoney(premSum())}</div>
      </div>
    </div>
  )
}

export default CarrierSummaryCard
