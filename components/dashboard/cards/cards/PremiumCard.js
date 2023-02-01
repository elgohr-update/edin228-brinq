import React from 'react'
import { abbreviateMoney } from '../../../../utils/utils'
import DashboardSummaryCard from '../../../ui/card/DashboardSummaryCard'

export default function PremiumCard({ premium = 0, premiumChart = [] }) {
  return (
    <DashboardSummaryCard
      gradient={'green-gradient-2'}
      title={'Premium'}
      icon={<AiOutlineDollarCircle />}
      chartData={premiumChart}
      content={`$${abbreviateMoney(premium)}`}
    />
  )
}
