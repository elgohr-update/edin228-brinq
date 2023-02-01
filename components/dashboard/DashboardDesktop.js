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

export default function DashboardDesktop() {
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
    <div className="flex h-full w-full flex-col">
      {loading && !data ? (
        <div className="flex h-full w-full">
          <div className="flex w-full flex-col items-center justify-center xl:mt-[-200px]">
            <Loading
              type="points-opacity"
              size="xl"
              color="primary"
              textColor="primary"
            />
            <div className="mt-5 uppercase tracking-widest opacity-80">
              Loading
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col xl:flex-row xl:pl-2">
          <div className="flex h-full w-full flex-col">
            <div className="flex w-full flex-auto flex-col">
              <div className="flex flex-auto shrink-0 gap-2 p-2">
                <div className="flex w-3/12 flex-auto flex-col py-2">
                  <DashboardTodos data={tasks} />
                </div>
                <div className="flex w-9/12 flex-auto flex-col px-2">
                  <div className="flex w-full shrink-0 flex-col">
                    <div className="flex h-full flex-col px-4 xl:flex-row xl:px-0">
                      <div className="flex h-full w-full xl:items-center">
                        <DashboardCards
                          premium={data?.premium}
                          clients={data?.clients}
                          renewals_summary={data?.renewals_summary}
                          tasks_summary={data?.tasks_summary}
                          charts={data?.charts}
                          loading={loading}
                        />
                      </div>
                      <div className="hidden w-full justify-center xl:flex ">
                        <DashboardSummaryChart
                          fullData={data?.charts}
                          loading={loading}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full shrink-0 flex-col px-2">
                    <DashboardTeam base={data?.relation_list} />
                  </div>
                  <div className="flex w-full flex-auto flex-col gap-2 p-2">
                    <div className="flex items-center gap-2">
                      <CurrentMonthSummary
                        teamData={data?.relation_list}
                        expiringPolicies={expiringPolicies}
                        recentlyAdded={recentlyAdded}
                      />
                    </div>
                    <div className="flex w-full gap-4">
                      <div className="w-1/2">
                        <DashboardSuspense />
                      </div>
                      <div className="w-1/2">
                        <DashboardActivity />
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
