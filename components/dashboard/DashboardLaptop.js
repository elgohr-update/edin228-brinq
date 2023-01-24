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
import CurrentMonthSummary from './summary/CurrentMonthSummary'
import DashboardGlanceSummaryCard from './summary/DashboardGlanceSummaryCard'
import DashboardSuspense from './suspense/DashboardSuspense'
import DashboardTeam from './team/DashboardTeam'
import DashboardTodos from './todos/DashboardTodos'

export default function DashboardLaptop() {
  const { appHeader, setAppHeader } = useAppHeaderContext()
  const [data, setData] = useState(null)
  const [tasks, setTasks] = useState(null)
  const [expiringPolicies, setExpiringPolicies] = useState([])
  const [recentlyAdded, setRecentlyAdded] = useState([])
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
  const fetchExpiringPolicies = async () => {
    const res = await useNextApi('GET', `/api/policy/expiring`)
    setExpiringPolicies(res)
  }
  const fetchRecentlyAdded = async () => {
    const res = await useNextApi('GET', `/api/policy/recent`)
    setRecentlyAdded(res)
  }

  const fetchData = async () => {
    fetchTasks()
    fetchExpiringPolicies()
    fetchRecentlyAdded()
    const res = await useNextApi('GET', `/api/summary/dashboard`)
    setData(res)
    setLoading(false)
  }

  return (
    <div className="flex flex-col w-full h-full">
      {loading && !data ? (
        <div className="flex w-full h-full">
          <div className="flex w-full flex-col items-center justify-center xl:mt-[-200px]">
            <Loading
              type="points-opacity"
              size="xl"
              color="primary"
              textColor="primary"
            />
            <div className="mt-5 tracking-widest uppercase opacity-80">
              Loading
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full h-full xl:flex-row xl:px-2">
          <div className="flex flex-col w-full h-full">
            <div className="flex flex-col flex-auto w-full">
              <div className="flex flex-auto gap-2 p-2 shrink-0">
                <div className="flex flex-col w-3/12 py-2 shrink-0">
                  <DashboardTodos data={tasks} />
                </div>
                <div className="flex flex-col w-[73%] px-4">
                  <div className="flex flex-col w-fullshrink-0">
                    <div className="flex flex-col h-full">
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
                  <div className="flex flex-col w-full px-2 shrink-0">
                    <DashboardTeam base={data?.relation_list} />
                  </div>
                  <div className="flex flex-col flex-auto w-full gap-4 p-2">
                  <div className="flex flex-col items-center gap-2">
                      <CurrentMonthSummary data={data?.relation_list} />
                      <div className="flex items-center w-full gap-4 p-2">
                        <DashboardGlanceSummaryCard
                          title={`Expiring Soon`}
                          data={expiringPolicies}
                          gradient={`orange-to-red-gradient-2`}
                          shadowColor={`orange`}
                          usePolicyCard
                        />
                        <DashboardGlanceSummaryCard
                          title={`Recently Added`}
                          data={recentlyAdded}
                          gradient={`blue-to-purple-to-cyan-gradient-1`}
                          shadowColor={`purple`}
                          usePolicyCard
                        />
                        <DashboardAudit
                          gradient={`pink-gradient-1`}
                          shadowColor={`pink`}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <DashboardActivitySuspenseContainer />
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
