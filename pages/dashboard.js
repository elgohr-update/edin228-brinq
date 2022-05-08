import AppLayout from '../layouts/AppLayout'
import { Row } from '@nextui-org/react'
import { useEffect } from 'react'
import { useAppHeaderContext } from '../context/state'
import PageTitle from '../components/ui/pageheaders/PageTitle'
import { MdOutlineDashboard } from 'react-icons/md'
import DashboardActivity from '../components/dashboard/activity/DashboardActivity'
import DashboardTodos from '../components/dashboard/todos/DashboardTodos'

export default function Dashboard() {
  const { appHeader, setAppHeader } = useAppHeaderContext()

  useEffect(() => {
    setAppHeader({
      ...appHeader,
      titleContent: (
        <PageTitle icon={<MdOutlineDashboard />} text={`Dashboard`} />
      ),
    })
  }, [])
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-full w-full flex-col md:flex-row md:pl-2">
        <div className="flex h-full w-full flex-col md:w-9/12">
          <div className="flex h-full w-full flex-col md:flex-1 md:p-2">
            <div
              className="flex h-full w-full bg-gray-500/20 rounded-lg"
            >
              .
            </div>
          </div>
          <div className="flex flex-col md:flex-1 md:flex-row md:items-center">
            <div className="flex h-full w-full flex-col md:w-1/2 md:p-2">
              <div
                className="flex h-full w-full bg-gray-500/20 rounded-lg"
              >
                .
              </div>
            </div>
            <div className="flex h-full w-full flex-col md:w-1/2 md:p-2">
              <DashboardActivity />
            </div>
          </div>
        </div>
        <div className="flex h-full w-full flex-col md:w-3/12 md:p-2">
          <DashboardTodos />
        </div>
      </div>
    </div>
  )
}

Dashboard.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}
