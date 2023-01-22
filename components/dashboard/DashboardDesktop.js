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
import DashboardActivitySuspenseContainer from './containers/DashboardActivitySuspenseContainer'
import DashboardExpiringAndRecent from './containers/DashboardExpiringAndRecent'
import DashboardExpiringPolicies from './expiring/DashboardExpiringPolicies'
import DashboardRecentPolicies from './policy/DashboardRecentPolicies'
import DashboardSuspense from './suspense/DashboardSuspense'
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
          <div className="flex w-full flex-col items-center justify-center xl:mt-[-200px]">
            <Loading type="points-opacity" size="xl" color="primary" textColor="primary" />
            <div className="mt-5 tracking-widest uppercase opacity-80">
              Loading
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full h-full xl:flex-row xl:pl-2">
          <div className="flex flex-col w-full h-full">
            <div className="flex flex-col w-full shrink-0">
              <div className="flex flex-col h-full px-4 xl:flex-row xl:px-0">
                <div className="flex w-full h-full xl:items-center">
                  <DashboardCards
                    premium={data?.premium}
                    clients={data?.clients}
                    renewals_summary={data?.renewals_summary}
                    tasks_summary={data?.tasks_summary}
                    charts={data?.charts}
                    loading={loading}
                  />
                </div>
                <div className="justify-center hidden w-full xl:flex ">
                  <DashboardSummaryChart
                    fullData={data?.charts}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-auto w-full">
              <div className="flex flex-auto gap-2 p-2 shrink-0">
                <div className="flex flex-col flex-auto w-3/12 py-2 shrink-0">
                  <DashboardTodos data={tasks} />
                </div>
                <div className="flex flex-col flex-auto w-9/12 px-2">
                  <div className="flex flex-col w-full shrink-0">
                    <DashboardTeam base={data?.relation_list} />
                  </div>
                  <div className="flex flex-auto w-full gap-4 p-2">
                    <div className="flex flex-col w-1/2">
                      <DashboardActivitySuspenseContainer />
                    </div>
                    <div className="flex flex-col w-1/2">
                      <div className="flex flex-col">
                        <DashboardAudit />
                      </div>
                      <div className="flex flex-col flex-auto">
                        <DashboardExpiringAndRecent /> 
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

