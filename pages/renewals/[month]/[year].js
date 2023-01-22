import { useTheme as useNextTheme } from 'next-themes'
import { Button, useTheme } from '@nextui-org/react'
import { useRouter } from 'next/router'
import AppLayout from '../../../layouts/AppLayout'
import { getSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { BsFillCalendar3WeekFill, BsBox, BsListCheck } from 'react-icons/bs'
import {
  AiFillDollarCircle,
} from 'react-icons/ai'
import { HiOutlineRefresh } from 'react-icons/hi'
import RenewalsTable from '../../../components/table/RenewalsTable'
import { getIcon, sumFromArrayOfObjects, timeout } from '../../../utils/utils'
import SummaryCard from '../../../components/ui/card/SummaryCard'
import { RiFolderUserFill } from 'react-icons/ri'
import PageTitle from '../../../components/ui/pageheaders/PageTitle'
import { useAppHeaderContext, useClientDrawerContext } from '../../../context/state'
import { useChannel, useEvent } from '@harelpls/use-pusher'

export default function Renewals({ data }) {
  const router = useRouter()
  const { month, year } = router.query
  const date = new Date(year, month - 1, 1)
  const monthName = date.toLocaleString('default', { month: 'long' })
  const [tableData, setTableData] = useState(data)
  const { appHeader, setAppHeader } = useAppHeaderContext()
  const { clientDrawer, setClientDrawer } = useClientDrawerContext()

  useEffect(() => {
    setAppHeader({
      ...appHeader,
      titleContent: (
        <PageTitle
          icon={<BsFillCalendar3WeekFill />}
          text={`${monthName} ${year} Renewals`}
        />
      ),
    })
  }, [router])

  useEffect(() => {
    setTableData(data)
  }, [data])

  const goToMonth = (dir) => {
    const currentMonth = Number(month)
    const currentYear = Number(year)
    if (dir === 'next') {
      const nextMonth = currentMonth + 1 != 13 ? currentMonth + 1 : 1
      const nextYear = currentMonth + 1 != 13 ? currentYear : currentYear + 1
      router.replace(`/renewals/${nextMonth}/${nextYear}`)
    } else {
      const nextMonth = currentMonth - 1 != 0 ? currentMonth - 1 : 12
      const nextYear = currentMonth - 1 != 0 ? currentYear : currentYear - 1
      router.replace(`/renewals/${nextMonth}/${nextYear}`)
    }
  }
  const refreshCurrent = () => {
    const currentMonth = Number(month)
    const currentYear = Number(year)
    router.replace(`/renewals/${currentMonth}/${currentYear}`)
  }

  const premSum = () => {
    return sumFromArrayOfObjects(tableData, 'premium')
  }
  const polSum = () => {
    return sumFromArrayOfObjects(tableData, 'policy_count')
  }
  const completedTasks = () => {
    let completedTotal = sumFromArrayOfObjects(tableData, 'tasks_completed')
    let totalTotal = sumFromArrayOfObjects(tableData, 'tasks_total')
    const calc = Math.round((completedTotal / totalTotal) * 100)
    const result = Number(calc) ? calc : 0
    return result
  }
  const renewedPolSum = () => {
    let total = tableData?.reduce((tot, record) => {
      const filt = record.policies.filter((e) => e.renewed === true)
      return tot + filt.length
    }, 0)
    return total
  }
  const renewedPolPercent = () => {
    const calc = Math.round((renewedPolSum() / polSum()) * 100)
    const result = Number(calc) ? calc : 0
    return result
  }

  return (
    <main className="flex flex-col w-full min-h-0">
      <div className="flex items-center pl-4 space-x-1">
        <Button.Group color="primary" auto size="xs" flat>
          <Button onClick={() => goToMonth('prev')}>
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center text-xs text-center">
                {getIcon('caretLeft')}
              </div>
              <div>Previous Month</div>
            </div>
          </Button>
          <Button onClick={() => goToMonth('next')}>
            <div className="flex items-center space-x-2">
              <div>Next Month</div>
              <div className="flex items-center justify-center text-xs text-center">
                {getIcon('caretRight')}
              </div>
            </div>
          </Button>
        </Button.Group>
        <Button color="warning" auto size="xs" flat onClick={() => refreshCurrent()}>
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center text-lg text-center">
              {getIcon('refresh')}
            </div>
            <div>Refresh</div>
          </div>
        </Button>
      </div>
      <div className="flex flex-col w-full">
        <div className="flex items-center min-h-0 px-4 py-4 mb-2 space-x-4 overflow-x-auto xl:overflow-x-hidden xl:py-2">
          <SummaryCard
            vertical={false}
            val={premSum()}
            color="teal"
            gradientColor="green-to-blue-2"
            panel
            shadow
            icon={<AiFillDollarCircle />}
            title="Premium"
            money
          />
          <SummaryCard
            vertical={false}
            val={tableData?.length}
            color="fuchsia"
            gradientColor="pink-to-blue"
            panel
            shadow
            title="Clients"
            icon={<RiFolderUserFill />}
          />
          <SummaryCard
            vertical={false}
            val={polSum()}
            color="fuchsia"
            gradientColor="orange-to-red-2"
            panel
            shadow
            title="Policies"
            icon={<BsBox />}
          />
          <SummaryCard
            vertical={false}
            val={renewedPolPercent()}
            color="purple"
            gradientColor="purple-to-blue-gradient-2"
            panel
            shadow
            title="Renewed"
            icon={<HiOutlineRefresh />}
            percent
          />
          {/* <SummaryCard vertical={false} val={renewedPolSum()} color="orange" gradientColor="pink-to-orange"  panel shadow title="Renewed Policies" icon={<MdTaskAlt />}  /> */}
          <SummaryCard
            vertical={false}
            val={completedTasks()}
            color="sky"
            gradientColor="green"
            panel
            shadow
            title="Completed Tasks"
            icon={<BsListCheck />}
          />
        </div>
        <div className="flex px-4">
          <div className={`flex h-full w-full rounded-lg `}>
            {data ? <RenewalsTable data={tableData} /> : null}
          </div>
        </div>
      </div>
    </main>
  )
}

Renewals.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}

export async function getServerSideProps(context) {
  const { year, month } = context.params
  const session = await getSession(context)
  if (session) {
    const baseUrl = `${process.env.FETCHBASE_URL}/renewals/${year}/${month}`
    const res = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
    const data = await res.json()

    return { props: { data } }
  }
  return { props: { data: null } }
}
