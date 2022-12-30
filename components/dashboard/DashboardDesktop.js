import { Loading } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { MdOutlineDashboard } from 'react-icons/md'
import { useAppHeaderContext, useReloadContext } from '../../context/state'
import { timeout, useNextApi } from '../../utils/utils'
import DashboardSummaryChart from '../charts/DashboardSummaryChart'
import PageTitle from '../ui/pageheaders/PageTitle'
import DashboardActivity from './activity/DashboardActivity'
import DashboardAudit from './audit/DashboardAudit'
import DashboardCards from './cards/DashboardCards'
import DashboardExpiringPolicies from './expiring/DashboardExpiringPolicies'
import DashboardRecentPolicies from './policy/DashboardRecentPolicies'
import DashboardTeam from './team/DashboardTeam'
import DashboardTodos from './todos/DashboardTodos'

export default function DashboardDesktop() {
  const { appHeader, setAppHeader } = useAppHeaderContext()
  const [data, setData] = useState(null)
  const [tasks, setTasks] = useState(null)
  const [loading, setLoading] = useState(true)
  const { reload, setReload } = useReloadContext()

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled) {
        setAppHeader({
          ...appHeader,
          titleContent: (
            <PageTitle icon={<MdOutlineDashboard />} text={`Dashboard`} />
          ),
        })
        fetchData()
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [])

  const fetchTasks = async () => {
    const res = await useNextApi('GET', `/api/tasks/`)
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
      {loading && !data ? (
        <div className="flex w-full h-full">
          <div className="flex w-full flex-col items-center justify-center lg:mt-[-200px]">
            <Loading type="points-opacity" size="xl" color="primary" textColor="primary" />
            <div className="mt-5 tracking-widest uppercase opacity-80">
              Loading
            </div>
          </div>
        </div>
      ) : (
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
            <div className="flex flex-col flex-auto w-full shrink-0 lg:flex-row">
              <div className="flex flex-col flex-auto p-2 shrink-0 lg:flex-row lg:px-2 lg:gap-2">
                <div className="flex flex-auto shrink-0 flex-col py-2 lg:min-w-[400px]">
                  <DashboardTodos data={tasks} />
                </div>
                <div className="flex flex-col flex-auto px-2">
                  <div className="flex flex-col shrink-0">
                    <DashboardTeam base={data?.relation_list} />
                  </div>
                  <div className="flex flex-col flex-auto w-full lg:flex-row lg:gap-4 lg:py-2">
                    <div className="flex flex-auto shrink-0 flex-col lg:w-[500px]">
                      <DashboardActivity />
                    </div>
                    <div className="flex flex-col flex-auto w-[300px] shrink-0">
                      <div className="flex flex-col flex-auto shrink-0">
                        <DashboardAudit />
                      </div>
                      <div className="flex flex-col flex-auto shrink-0">
                        <DashboardExpiringPolicies />
                      </div>
                      <div className="flex flex-col flex-auto shrink-0">
                        <DashboardRecentPolicies />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

