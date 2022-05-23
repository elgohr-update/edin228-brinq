import React, { useEffect, useState } from 'react'
import { timeout, useNextApi } from '../../utils/utils'
import CompanyAnnualChart from '../charts/CompanyAnnualChart'
import CompanySummaryChart from '../charts/CompanySummaryChart'

export default function CompanyChartContainer({ dataYear,dataSelection = 1 }) {
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
  }, [dataYear,dataSelection])

  const fetchData = async () => {
    if (dataYear) {
      const res = await useNextApi(
        'GET',
        `/api/charts/company/summary?year=${dataYear}&parent=${dataSelection == 1 ? true : false}&writing=${dataSelection == 2 ? true : false}`
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
