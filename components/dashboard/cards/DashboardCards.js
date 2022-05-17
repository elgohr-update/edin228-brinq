import React, { useEffect, useState } from 'react'
import { abbreviateMoney, getConstantIcons, sumFromArray, timeout, useNextApi } from '../../../utils/utils'
import { AiOutlineDollarCircle } from 'react-icons/ai'
import DashboardSummaryCard from '../../ui/card/DashboardSummaryCard'

export default function DashboardCards({
  premium = 0,
  clients,
  renewals_summary,
  tasks_summary,
  charts,
  loading,
}) {
  return (
    <div className="flex w-full h-full rounded-lg space-x-2 lg:px-4 lg:py-2 overflow-x-hidden lg:space-x-0 lg:gap-4">
      <DashboardSummaryCard
        gradient={'green-gradient-2'}
        shadow
        shadowColor={'green'}
        label={'Premium'}
        icon={<AiOutlineDollarCircle />}
        chartData={charts?.premium_chart}
        content={`$${abbreviateMoney(premium)}`}
        animationDelay={0}
      />
      <DashboardSummaryCard
        gradient={'orange-gradient-top-1 '}
        shadow
        shadowColor={'orange'}
        label={'Clients'}
        icon={getConstantIcons('client')}
        chartData={charts?.clients_chart}
        content={clients}
        slice={false}
        animationDelay={1}
        colors={[
          '#ff5e62',
          '#ff5e62',
          '#ff9966',
          '#ff5e621f',
          '#ff5e6269',
          '#ff5e62',
        ]}
      />
      <DashboardSummaryCard
        gradient={'pink-to-blue-gradient-top-1'}
        shadow
        shadowColor={'purple'}
        label={'New Business'}
        slice={false}
        toCurrentMonth
        icon={getConstantIcons('deal')}
        chartData={charts?.nb_premium_chart}
        content={`$${abbreviateMoney(sumFromArray(charts?.nb_premium_chart))}`}
        animationDelay={2}
      />
    </div>
  )
}
