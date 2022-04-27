import { useTheme } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { BsStars, BsBox } from 'react-icons/bs'
import {
  AiFillDollarCircle,
  AiOutlineArrowUp,
  AiOutlineArrowDown,
} from 'react-icons/ai'
import {
  useAgencyContext,
  useAppContext,
  useReloadContext,
} from '../../context/state'
import AppLayout from '../../layouts/AppLayout'
import {
  sumFromArray,
  sumFromArrayOfObjects,
  timeout,
  useNextApi,
} from '../../utils/utils'
import SummaryCard from '../../components/ui/card/SummaryCard'
import ReportNavbar from '../../components/ui/navbar/ReportNavbar'
import PageTitle from '../../components/ui/pageheaders/PageTitle'
import PageHeader from '../../components/ui/pageheaders/PageHeader'
import NewBusinessTable from '../../components/table/NewBusinessTable'
import ChartSummaryCard from '../../components/charts/ChartSummaryCard'
import PanelTitle from '../../components/ui/title/PanelTitle'
import NewBusinessLineChart from '../../components/charts/NewBusinessLineChart'
import NewBusinessBarChart from '../../components/charts/NewBusinessBarChart'

export default function ReportsNewBusiness() {
  const { type } = useTheme()
  const { state, setState } = useAppContext()
  const [chartData, setChartData] = useState(null)
  const { agency, setAgency } = useAgencyContext()
  const { reload, setReload } = useReloadContext()

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled) {
        if (state.reports.data.nb.raw.length < 1) {
          fetchData()
        }
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled && state.reports.data.nb.raw.length > 1) {
        getChartData()
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [state.reports.data.nb])

  const getChartData = () => {
    const producers = getProducers()
    const users = []
    producers.forEach((p) => {
      let data = state.reports.data.nb.raw.filter((d) =>
        checkUser(d.users, p.id)
      )
      let totalPrem = sumFromArrayOfObjects(data, 'premium')
      let premByMonth = []
      Array.from(Array(12).keys()).forEach((m) => {
        let base = data.filter((d) => checkMonth(m, d.effective_date))
        let sum = sumFromArrayOfObjects(base, 'premium')
        premByMonth.push(sum)
      })
      const bundle = { id: p.id, name: p.name, user:p, premByMonth, totalPrem }
      users.push(bundle)
    })
    let totalPremByMonth = []
    let baseTotalPremByMonth = []
    Array.from(Array(12).keys()).forEach((m) => {
      let base = state.reports.data.nb.raw.filter((d) =>
        checkMonth(m, d.effective_date)
      )
      let sum = sumFromArrayOfObjects(base, 'premium')
      baseTotalPremByMonth.push(sum)
      let totalSum = sumFromArray(baseTotalPremByMonth)
      totalPremByMonth.push(totalSum)
    })
    let totalPremGoalByMonth = []
    Array.from(Array(12).keys()).forEach((m) => {
      let baseSum = sumFromArrayOfObjects(producers, 'monthly_rev_goal')
      totalPremGoalByMonth.push(baseSum * (m + 1))
    })
    const final = {
      users,
      totalPremByMonth,
      totalPremGoalByMonth,
    }
    setChartData(final)
  }

  const checkUser = (users, id) => {
    let check = false
    users.forEach((x) => {
      x.id === id ? (check = true) : null
    })
    return check
  }

  const checkMonth = (month, date) => {
    const base = new Date(date)
    const d = new Date(base.getTime() - base.getTimezoneOffset() * -60000)
    return d.getMonth() == month
  }

  const getProducers = () => {
    return agency?.users?.filter((u) => u.producer && u.is_active)
  }

  const fetchData = async () => {
    const res = await useNextApi('GET', `/api/policy/list/all/newbusiness`)
    setState({
      ...state,
      reports: {
        ...state.reports,
        data: {
          ...state.reports.data,
          nb: { raw: res, filtered: res, loading: false },
        },
      },
    })
  }

  const currentMonth = () => {
    const base = new Date()
    const d = new Date(base.getTime() - base.getTimezoneOffset() * -60000)
    return d.getMonth()
  }

  const getMonthsData = (p) => {
    const m = currentMonth()
    const d = p.premByMonth[m]
    return d
  }

  const getMonthComparison = (p) => {
    const m = currentMonth()
    if (m > 0) {
      const current = p.premByMonth[m]
      const last = p.premByMonth[m - 1]
      const diff = current - last
      const percent = isNaN(Math.floor((diff / current) * 100))
        ? 0
        : current == 0
        ? -100
        : Math.floor((diff / current) * 100)
      if (percent > 0) {
        const subContent = () => {
          return (
            <div className="flex items-center space-x-1">
              <div className="text-color-success flex items-center">
                <h6>{percent}%</h6>
                {percent != 0 ? (
                  <div>
                    <AiOutlineArrowUp />
                  </div>
                ) : null}
              </div>
              <h4>since last month</h4>
            </div>
          )
        }
        return subContent()
      } else {
        const subContent = () => {
          return (
            <div className="flex items-center space-x-1">
              <div className="text-color-error flex items-center">
                <h6>{percent}%</h6>
                {percent != 0 ? (
                  <div>
                    <AiOutlineArrowDown />
                  </div>
                ) : null}
              </div>
              <h4>since last month</h4>
            </div>
          )
        }
        return subContent()
      }
    }
    return null
  }

  const getTotalToLastMonthComparison = (p) => {
    const m = currentMonth()
    if (m > 0) {
      const current = p.totalPrem
      const last = current - p.premByMonth[m]
      const diff = current - last
      const percent = isNaN(Math.floor((diff / current) * 100))
        ? 0
        : Math.floor((diff / current) * 100)

      if (percent > 0) {
        const subContent = () => {
          return (
            <div className="flex items-center space-x-1">
              <div className="text-color-success flex items-center">
                <h6>{percent}%</h6>
                {percent != 0 ? (
                  <div>
                    <AiOutlineArrowUp />
                  </div>
                ) : null}
              </div>
              <h4>since last month</h4>
            </div>
          )
        }
        return subContent()
      } else {
        const subContent = () => {
          return (
            <div className="flex items-center space-x-1">
              <div className="text-color-error flex items-center">
                <h6>{percent}%</h6>
                {percent != 0 ? (
                  <div>
                    <AiOutlineArrowDown />
                  </div>
                ) : null}
              </div>
              <h4>since last month</h4>
            </div>
          )
        }
        return subContent()
      }
    }
    return null
  }

  const getTotalToLastMonthDirection = (p) => {
    const m = currentMonth()
    if (m > 0) {
      const current = p.totalPrem
      const last = current - p.premByMonth[m]
      const diff = current - last
      const percent = isNaN(Math.floor((diff / current) * 100))
        ? 0
        : Math.floor((diff / current) * 100)
      if (percent > 0) {
        return 'up'
      }
      return 'down'
    }
    return null
  }

  const getDirection = (p) => {
    const m = currentMonth()
    if (m > 0) {
      const current = p.premByMonth[m]
      const last = p.premByMonth[m - 1]
      const diff = current - last
      const percent = isNaN(Math.floor((diff / current) * 100))
        ? 0
        : Math.floor((diff / current) * 100)
      if (percent > 0) {
        return 'up'
      }
      return 'down'
    }
    return null
  }

  const tableData = state.reports.data.nb.filtered

  const premSum = () => {
    return sumFromArrayOfObjects(tableData, 'premium')
  }
  return (
    <main className="relative flex w-full flex-col">
      <PageHeader>
        <PageTitle icon={<BsStars />} text="New Business" />
        <div
          className={`panel-flat-${type} ${type}-shadow rounded-lg px-4 py-1`}
        >
          <ReportNavbar />
        </div>
      </PageHeader>
      <div className="flex w-full flex-col">
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col">
            <div className="pl-4">
              <PanelTitle title={`This Month`} color="indigo" />
            </div>
            <div className="flex w-full flex-col items-center md:flex-row">
              <div className="flex h-full flex-col items-center space-y-4 overflow-x-auto px-4 py-4 md:mb-0 md:overflow-hidden">
                {chartData?.users.map((p) => (
                  <ChartSummaryCard
                    key={p.id}
                    label={p.name}
                    fullData={p}
                    panel
                    shadow
                    content={getMonthsData(p)}
                    subContent={getMonthComparison(p)}
                    currentMonth={currentMonth()}
                    direction={getDirection(p)}
                    money
                    slice
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div>
              <PanelTitle title={`Year to Date`} color="orange" />
            </div>
            <div className="flex w-full flex-col space-x-4 md:flex-row">
              <div className="flex h-full flex-col items-center space-y-4 overflow-x-auto px-4 py-4 md:mb-0 md:overflow-hidden">
                {chartData?.users.map((p) => (
                  <ChartSummaryCard
                    key={p.id}
                    label={p.name}
                    fullData={p}
                    panel
                    shadow
                    content={p.totalPrem}
                    subContent={getTotalToLastMonthComparison(p)}
                    currentMonth={currentMonth()}
                    direction={getTotalToLastMonthDirection(p)}
                    money
                    slice
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full px-4 space-y-4">
            {chartData ? (
              <NewBusinessBarChart
                currentMonth={currentMonth()}
                fullData={chartData}
              />
            ) : null}
            {chartData ? (
              <NewBusinessLineChart
                currentMonth={currentMonth()}
                slice
                fullData={chartData}
              />
            ) : null}
          </div>
        </div>
        <div className="mb-2 flex h-full items-center justify-center space-x-4 overflow-x-auto px-4 py-4 md:mb-0 md:overflow-hidden">
          <SummaryCard
            val={premSum()}
            color="teal"
            gradientColor="green-to-blue-2"
            panel
            shadow
            icon={<AiFillDollarCircle />}
            title="Premium"
            money
            vertical={false}
          />
          <SummaryCard
            val={tableData?.length}
            color="fuchsia"
            gradientColor="pink-to-blue"
            panel
            shadow
            title="Policies"
            icon={<BsBox />}
            vertical={false}
          />
        </div>
        <div className="px-4">
          <div
            className={`h-full w-full rounded-lg ${type}-shadow panel-theme-${type}`}
          >
            {tableData ? <NewBusinessTable /> : null}
          </div>
        </div>
      </div>
    </main>
  )
}

ReportsNewBusiness.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}
