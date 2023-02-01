import { Loading } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { MdOutlineDashboard } from 'react-icons/md'
import { useAppHeaderContext } from '../../context/state'
import { timeout, useNextApi } from '../../utils/utils'
import DashboardSummaryChart from '../charts/DashboardSummaryChart'
import PageTitle from '../ui/pageheaders/PageTitle'
import DashboardActivity from './activity/DashboardActivity'
import DashboardAudit from './audit/DashboardAudit'
import DashboardCards from './cards/DashboardCards'
import DashboardMobileNav from './DashboardMobileNav'
import DashboardExpiringPolicies from './expiring/DashboardExpiringPolicies'
import DashboardRecentPolicies from './policy/DashboardRecentPolicies'
import CurrentMonthSummary from './summary/CurrentMonthSummary'
import DashboardSuspense from './suspense/DashboardSuspense'
import DashboardTeam from './team/DashboardTeam'
import DashboardTeamMobile from './team/DashboardTeamMobile'
import DashboardTodos from './todos/DashboardTodos'

export default function DashboardMobile() {
  const { appHeader, setAppHeader } = useAppHeaderContext()
  const [data, setData] = useState(null)
  const [tasks, setTasks] = useState(null)
  const [expiringPolicies, setExpiringPolicies] = useState([])
  const [recentlyAdded, setRecentlyAdded] = useState([])
  const [loading, setLoading] = useState(true)
  const [navTab, setNavTab] = useState(1)

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
  const setTab = (e) => {
    setNavTab(e)
  }
  return (
    <div className="flex h-full w-full flex-col">
      {loading && !data ? (
        <div className="flex h-full w-full">
          <div className="flex w-full flex-col items-center justify-center ">
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
        <div className="flex h-full w-full flex-col">
          <div className="flex h-full w-full flex-col px-2">
            <DashboardMobileNav activeItem={navTab} setTab={(e) => setTab(e)} />
            {navTab == 1 ? (
              <div className="flex w-full shrink-0 flex-col">
                <div className="flex h-full flex-col px-4">
                  <div className="flex w-full">
                    <DashboardSummaryChart
                      fullData={data?.charts}
                      loading={loading}
                    />
                  </div>
                  <div className="flex h-full w-full">
                    <DashboardCards
                      premium={data?.premium}
                      clients={data?.clients}
                      renewals_summary={data?.renewals_summary}
                      tasks_summary={data?.tasks_summary}
                      charts={data?.charts}
                      loading={loading}
                    />
                  </div>
                  <CurrentMonthSummary
                    teamData={data?.relation_list}
                    expiringPolicies={expiringPolicies}
                    recentlyAdded={recentlyAdded}
                  />
                  <div className="flex shrink-0 flex-col py-4 ">
                    <DashboardTeamMobile base={data?.relation_list} />
                  </div>
                </div>
              </div>
            ) : navTab == 2 ? (
              <div className="flex flex-auto shrink-0 flex-col">
                <DashboardTodos data={tasks} />
              </div>
            ) : navTab == 3 ? (
              <div className="flex flex-auto shrink-0 flex-col ">
                <DashboardActivity />
              </div>
            ) : navTab == 4 ? (
              <div className="flex flex-auto shrink-0 flex-col">
                <DashboardSuspense />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
