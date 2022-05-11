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
        <div className="flex h-full w-full flex-col lg:w-9/12">
          <div className="flex h-full w-full flex-col lg:flex-1 lg:px-4 py-2">
            <div>
            <PanelTitle title={`Overview`} color="sky" />
            </div>
            <DashboardCards
              premium={data?.premium}
              clients={data?.clients}
              renewals_summary={data?.renewals_summary}
              tasks_summary={data?.tasks_summary}
              charts={data?.charts}
              loading={loading}
            />
          </div>
          <div className="flex flex-col lg:flex-1 lg:flex-row lg:items-center">
            <div className="flex h-full w-full flex-col lg:w-8/12 lg:p-2">
              <DashboardTeam />
            </div>
            <div className="flex h-full w-full flex-col lg:w-4/12 lg:p-2">
              <DashboardActivity />
            </div>
          </div>
        </div>
        <div className="flex h-full w-full flex-col lg:w-3/12 lg:p-2">
          <DashboardTodos />
        </div>
      </div>
    </div>
  )
}

Dashboard.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}
