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
        <div className="py-1">
          <div className={`bottom-border-flair pink-gradient-1`} />
        </div>
      </div>
      <div className="flex items-center justify-end mt-2 space-x-2 text-xs">
        <div className="flex items-center text-orange-500">
          <span className="flex items-center mr-1">{getIcon('policy')}</span>
          <span className="flex min-w-[20px] justify-end text-right">
            {data?.data.policies.length}
          </span>
        </div>
        <div className="flex items-center text-teal-500">
          <span className="flex items-center mr-1">
            {getIcon('dollarSign')}
          </span>
          <span className="flex min-w-[40px] justify-end text-right">
            ${abbreviateMoney(premSum())}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CarrierSummaryCard
