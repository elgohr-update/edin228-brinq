import React, { useEffect, useState } from 'react'
import { timeout, useNextApi } from '../../utils/utils'
import CompanyAnnualChart from '../charts/CompanyAnnualChart'
import CompanySummaryChart from '../charts/CompanySummaryChart'

export default function CompanyChartContainer({ dataYear }) {
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled) {
        fetchData()
      }
    }
    handleChange()
    return () => {}
  }, [dataYear])

  const fetchData = async () => {
    if (dataYear) {
      const res = await useNextApi(
        'GET',
        `/api/charts/company/summary?year=${dataYear}`
      )
      setChartData(res)
    }
  }

  return (
    <div className="flex flex-auto flex-col lg:flex-row lg:px-4 mb-4 lg:gap-4 lg:space-y-0 space-y-2">
      <div className="flex flex-auto lg:w-1/4">
        <CompanySummaryChart fullData={chartData?.summaries} /> 
      </div>
      <div className="flex flex-auto lg:w-3/4">
        <CompanyAnnualChart fullData={chartData?.annual} /> 
      </div>
    </div>
  )
}
