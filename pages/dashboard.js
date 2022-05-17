import AppLayout from '../layouts/AppLayout'
import { useEffect, useState } from 'react'
import { useAppHeaderContext } from '../context/state'
import PageTitle from '../components/ui/pageheaders/PageTitle'
import { MdOutlineDashboard } from 'react-icons/md'
import DashboardActivity from '../components/dashboard/activity/DashboardActivity'
import DashboardTodos from '../components/dashboard/todos/DashboardTodos'
import DashboardTeam from '../components/dashboard/team/DashboardTeam'
import DashboardCards from '../components/dashboard/cards/DashboardCards'
import { timeout, useNextApi } from '../utils/utils'
import PanelTitle from '../components/ui/title/PanelTitle'
import DashboardSummaryChart from '../components/charts/DashboardSummaryChart'
import DashboardRecentPolicies from '../components/dashboard/policy/DashboardRecentPolicies'
import DashboardNewBusinessChart from '../components/charts/DashboardNewBusinessChart'

export default function Dashboard() {
  const { appHeader, setAppHeader } = useAppHeaderContext()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setAppHeader({
      ...appHeader,
      titleContent: (
        <PageTitle icon={<MdOutlineDashboard />} text={`Dashboard`} />
      ),
    })
  }, [])

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled) {
        fetchData()
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [])

  const fetchData = async () => {
    const res = await useNextApi('GET', `/api/summary/dashboard`)
    setData(res)
    setLoading(false)
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-full w-full flex-col lg:flex-row lg:pl-2">
        <div className="flex w-full h-full flex-col">
          <div className="flex w-full h-full flex-col">
            <div className="flex flex-col h-full px-4 lg:flex-row lg:items-center lg:px-0">
              <div className="flex w-full h-full lg:items-center">
                <DashboardCards
                  premium={data?.premium}
                  clients={data?.clients}
                  renewals_summary={data?.renewals_summary}
                  tasks_summary={data?.tasks_summary}
                  charts={data?.charts}
                  loading={loading}
                />
              </div>
              <div className="hidden w-full justify-center lg:flex ">
                <DashboardSummaryChart
                  fullData={data?.charts}
                  loading={loading}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-1 lg:flex-row">
            <div className="flex w-full flex-col lg:p-2">
              {/* <div className="h-full w-full flex-col md:flex lg:hidden lg:w-3/12 lg:p-2">
                <DashboardTodos />
              </div> */}
              <div className="flex w-full flex-col lg:flex-row">
                <div className="h-full w-full flex-col pb-2 flex lg:w-3/12 lg:px-2 lg:pr-4">
                  <DashboardTodos />
                </div>
                <div className="flex flex-col h-full lg:min-w-[450px] lg:max-w-[450px]">
                  <div className="mb-2 flex w-full flex-col">
                    <DashboardTeam base={data?.relation_list} />
                  </div>
                  <div className="flex h-full flex-col lg:w-full">
                    <DashboardRecentPolicies />
                  </div>
                </div>
                <div className="flex w-full flex-col lg:px-4">
                  <div className="hidden md:flex flex-col lg:w-full">
                    <DashboardNewBusinessChart
                      fullData={data?.charts}
                      loading={loading}
                    />
                  </div>
                  <div className="flex h-full flex-col lg:w-full lg:mt-1">
                    <DashboardActivity />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Dashboard.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}
