import AppLayout from '../layouts/AppLayout'
import { useEffect, useState } from 'react'
import { useAppHeaderContext, useReloadContext } from '../context/state'
import PageTitle from '../components/ui/pageheaders/PageTitle'
import { MdOutlineDashboard } from 'react-icons/md'
import DashboardActivity from '../components/dashboard/activity/DashboardActivity'
import DashboardTodos from '../components/dashboard/todos/DashboardTodos'
import DashboardTeam from '../components/dashboard/team/DashboardTeam'
import DashboardCards from '../components/dashboard/cards/DashboardCards'
import { timeout, useNextApi } from '../utils/utils'
import DashboardSummaryChart from '../components/charts/DashboardSummaryChart'
import DashboardRecentPolicies from '../components/dashboard/policy/DashboardRecentPolicies'
import DashboardExpiringPolicies from '../components/dashboard/expiring/DashboardExpiringPolicies'
import DashboardPhone from '../components/dashboard/phone/DashboardPhone'

export default function Dashboard() {
  const { appHeader, setAppHeader } = useAppHeaderContext()
  const [data, setData] = useState(null)
  const [tasks, setTasks] = useState(null)
  const [loading, setLoading] = useState(true)
  const { reload, setReload } = useReloadContext()

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

  useEffect(() => {
    if (reload.policies) {
      let isCancelled = false
      const handleChange = async () => {
        await timeout(100)
        if (!isCancelled) {
          fetchTasks()
          setReload({
            ...reload,
            policies: false,
          })
        }
      }
      handleChange()
      return () => {
        isCancelled = true
      }
    }
  }, [reload])

  const fetchTasks = async () => {
    const res = await useNextApi('GET', `/api/task/list`)
    setTasks(res)
  }

  const fetchData = async () => {
    fetchTasks()
    const res = await useNextApi('GET', `/api/summary/dashboard`)
    setData(res)
    setLoading(false)
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col w-full h-full lg:flex-row lg:pl-2">
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-col w-full shrink-0">
            <div className="flex flex-col h-full px-4 lg:flex-row lg:px-0">
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
              <div className="justify-center hidden w-full lg:flex ">
                <DashboardSummaryChart
                  fullData={data?.charts}
                  loading={loading}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-auto shrink-0 lg:flex-row">
            <div className="flex flex-col flex-auto p-2 shrink-0 lg:p-2">
              <div className="flex flex-col flex-auto shrink-0 lg:flex-row lg:gap-4">
                <div className="flex flex-auto shrink-0 flex-col lg:min-w-[450px] lg:max-w-[450px]">
                  <DashboardTodos data={tasks} />
                </div>
                <div className="flex flex-auto shrink-0 flex-col lg:min-w-[450px] lg:max-w-[450px]">
                  <div className="flex flex-col shrink-0 lg:mb-0">
                    <DashboardTeam base={data?.relation_list} />
                  </div>
                  <div className="flex flex-col flex-auto shrink-0">
                    <DashboardActivity />
                  </div>
                </div>
                <div className="flex flex-col flex-auto w-auto shrink-0 lg:w-[500px]">
                  <div className="flex flex-col flex-auto shrink-0">
                    <DashboardExpiringPolicies />
                  </div>
                  <div className="flex flex-col flex-auto shrink-0">
                    <DashboardRecentPolicies />
                  </div>
                </div>
                <div className="flex flex-col flex-auto w-auto shrink-0 lg:w-[300px]">
                  <div className="flex flex-col flex-auto shrink-0">
                    <DashboardPhone />
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
