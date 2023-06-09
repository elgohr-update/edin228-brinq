import React, { useEffect, useState } from 'react'
import { abbreviateMoney, getIcon, sumFromArray, timeout, useNextApi } from '../../../utils/utils'
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
    <div className="flex xl:flex-nowrap flex-wrap flex-auto py-2 gap-4 rounded-lg 2xl:px-4 xl:space-x-0 xl:gap-4">
      <DashboardSummaryCard
        gradient={'green-gradient-2'}
        shadow
        shadowColor={'green'}
        title={'Total Premium'}
        icon={<AiOutlineDollarCircle />}
        chartData={charts?.premium_chart}
        content={`$${abbreviateMoney(premium)}`}
        animationDelay={0}
      />
      <DashboardSummaryCard
        gradient={'orange-gradient-top-1 '}
        shadow
        shadowColor={'orange'}
        title={'Clients'}
        icon={getIcon('client')}
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
        title={'New Business'}
        slice={false}
        toCurrentMonth
        icon={getIcon('deal')}
        chartData={charts?.nb_premium_chart}
        content={`$${abbreviateMoney(sumFromArray(charts?.nb_premium_chart))}`}
        animationDelay={2}
      />
    </div>
  )
}
