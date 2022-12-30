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
import DashboardTeam from './team/DashboardTeam'
import DashboardTodos from './todos/DashboardTodos'

export default function DashboardMobile() {
  const { appHeader, setAppHeader } = useAppHeaderContext()
  const [data, setData] = useState(null)
  const [tasks, setTasks] = useState(null)
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

  const fetchData = async () => {
    fetchTasks()
    const res = await useNextApi('GET', `/api/summary/dashboard`)
    setData(res)
    setLoading(false)
  }
  const setTab = (e) => {
    setNavTab(e)
  }
  return (
    <div className="flex flex-col w-full h-full">
      {loading && !data ? (
        <div className="flex w-full h-full">
          <div className="flex flex-col items-center justify-center w-full ">
            <Loading type="points-opacity" size="xl" color="primary" textColor="primary" />
            <div className="mt-5 tracking-widest uppercase opacity-80">
              Loading
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-col w-full h-full">
            <div className="flex flex-col w-full shrink-0">
              <div className="flex flex-col h-full px-4">
                <div className="flex w-full h-full">
                  <DashboardCards
                    premium={data?.premium}
                    clients={data?.clients}
                    renewals_summary={data?.renewals_summary}
                    tasks_summary={data?.tasks_summary}
                    charts={data?.charts}
                    loading={loading}
                  />
                </div>
                <div className="flex flex-col py-4 shrink-0 ">
                  <DashboardTeam base={data?.relation_list} />
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full h-full">
              <DashboardMobileNav
                activeItem={navTab}
                setTab={(e) => setTab(e)}
              />
              <div className="flex flex-col w-full h-full px-2">
                {navTab == 1 ? (
                  <div className="flex flex-col flex-auto shrink-0 ">
                    <DashboardTodos data={tasks} />
                  </div>
                ) : navTab == 2 ? (
                  <div className="flex flex-col flex-auto shrink-0 ">
                    <DashboardActivity />
                  </div>
                ) : navTab == 3 ? (
                  <div className="flex flex-col flex-auto shrink-0">
                    <DashboardAudit />
                  </div>
                ) : navTab == 4 ? (
                  <div className="flex flex-col flex-auto shrink-0">
                    <DashboardExpiringPolicies />
                  </div>
                ) : navTab == 5 ? (
                  <div className="flex flex-col flex-auto shrink-0">
                    <DashboardRecentPolicies />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
