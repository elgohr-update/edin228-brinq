import { useTheme } from '@nextui-org/react'
import React from 'react'
import {
  abbreviateMoney,
  getIcon,
  sumFromArrayOfObjects,
} from '../../../utils/utils'

function CarrierSummaryCard(data) {
  const { type } = useTheme()

  const premSum = () => {
    return sumFromArrayOfObjects(data?.data.policies, 'premium')
  }

  return (
    <div className={`flex w-full flex-col rounded-lg p-2 xl:w-[200px]`}>
      <div className="relative flex flex-col">
        <div className="text-xs">{data?.data.name}</div>
        <div className={`bottom-border-flair pink-gradient-1`} />
      </div>
      <div className="mt-2 flex items-center justify-end space-x-2 text-xs">
        <div className="flex items-center text-orange-500">
          <span className="mr-1 flex items-center">
            {getIcon('policy')}
          </span>
          <span className="flex justify-end text-right min-w-[20px]">{data?.data.policies.length}</span>
        </div>
        <div className="flex items-center text-teal-500">
          <span className="mr-1 flex items-center">
            {getIcon('dollarSign')}
          </span>
          <span className="flex justify-end text-right min-w-[40px]">${abbreviateMoney(premSum())}</span>
        </div>
      </div>
    </div>
  )
}

export default CarrierSummaryCard
