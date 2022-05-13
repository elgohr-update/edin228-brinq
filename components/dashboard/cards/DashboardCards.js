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
    <div className="flex h-full w-full rounded-lg space-x-2 lg:p-6 overflow-x-auto lg:space-x-0 lg:gap-4">
      <DashboardSummaryCard
        gradient={'green-gradient-2'}
        shadow
        shadowColor={'green'}
        label={'Premium'}
        icon={<AiOutlineDollarCircle />}
        chartData={charts?.premium_chart}
        content={`$${abbreviateMoney(premium)}`}
        animtationDelay={0}
      />
      <DashboardSummaryCard
        gradient={'pink-to-blue-gradient-top-1'}
        shadow
        shadowColor={'blue'}
        label={'New Business'}
        slice={false}
        toCurrentMonth
        icon={getConstantIcons('deal')}
        chartData={charts?.nb_premium_chart}
        content={`$${abbreviateMoney(sumFromArray(charts?.nb_premium_chart))}`}
        animtationDelay={1}
      />
      <DashboardSummaryCard
        gradient={'peach-gradient-top-1'}
        shadow
        shadowColor={'orange'}
        label={'Clients'}
        icon={getConstantIcons('client')}
        chartData={charts?.clients_chart}
        content={clients}
        slice={false}
        animtationDelay={2}
        colors={[
          '#ff5e62',
          '#ff5e62',
          '#ff9966',
          '#ff5e621f',
          '#ff5e6269',
          '#ff5e62',
        ]}
      />
    </div>
  )
}
