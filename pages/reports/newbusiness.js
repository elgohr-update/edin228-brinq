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
  toMonthName,
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
import NewBusinessCurrentMonthBarChart from '../../components/charts/NewBusinessCurrentMonthBarChart'
import SelectInput from '../../components/ui/select/SelectInput'

export default function ReportsNewBusiness() {
  const { type } = useTheme()
  const { state, setState } = useAppContext()
  const [chartData, setChartData] = useState(null)
  const { agency, setAgency } = useAgencyContext()
  const { reload, setReload } = useReloadContext()
  const [dataMonth, setDataMonth] = useState(null)
  const [dataYear, setDataYear] = useState(null)
  const [dataYearOptions, setDataYearOptions] = useState(null)
  const [dataMonthOptions, setDataMonthOptions] = useState([
    { id: 0, label: 'January', value: 0 },
    { id: 1, label: 'February', value: 1 },
    { id: 2, label: 'March', value: 2 },
    { id: 3, label: 'April', value: 3 },
    { id: 4, label: 'May', value: 4 },
    { id: 5, label: 'June', value: 5 },
    { id: 6, label: 'July', value: 6 },
    { id: 7, label: 'August', value: 7 },
    { id: 8, label: 'September', value: 8 },
    { id: 9, label: 'October', value: 9 },
    { id: 10, label: 'November', value: 10 },
    { id: 11, label: 'December', value: 11 },
  ])

  useEffect(() => {
    let isCancelled = false
    const handleYears = () => {
      const base = new Date()
      const currentYear = base.getFullYear()
      const currentMonth = base.getMonth()
      const years = []
      Array.from(Array(5).keys()).forEach((y) => {
        years.push({ id: currentYear - y, year: String(currentYear - y) })
      })
      setDataMonth(currentMonth)
      setDataYear(currentYear)
      setDataYearOptions(years)
    }
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled) {
        handleYears()
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
      if (!isCancelled) {
        fetchData()
      }
    }
    handleChange()
    return () => {}
  }, [dataYear])

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
    producers?.forEach((p) => {
      let data = state.reports.data.nb.filtered.filter((d) =>
        checkUser(d.users, p.id)
      )
      let totalPrem = sumFromArrayOfObjects(data, 'premium')
      let premByMonth = []
      Array.from(Array(12).keys()).forEach((m) => {
        let base = data.filter((d) => checkMonth(m, d.effective_date))
        let sum = sumFromArrayOfObjects(base, 'premium')
        premByMonth.push(sum)
      })
      const bundle = { id: p.id, name: p.name, user: p, premByMonth, totalPrem }
      users.push(bundle)
    })
    let totalPremByMonth = []
    let baseTotalPremByMonth = []
    Array.from(Array(12).keys()).forEach((m) => {
      let base = state.reports.data.nb.filtered.filter((d) =>
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
    if (dataYear) {
      const res = await useNextApi(
        'GET',
        `/api/policy/list/all/newbusiness?year=${dataYear}`
      )
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
  }

  const getMonthsData = (p) => {
    const d = p.premByMonth[dataMonth]
    return d
  }

  const getMonthComparison = (p) => {
    const m = dataMonth
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
    const m = dataMonth
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
    const m = dataMonth
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
    const m = dataMonth
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
        <div>
          <ReportNavbar />
        </div>
      </PageHeader>
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col lg:flex-row">
          <div className="mb-2 flex w-full h-full items-center lg:justify-center space-x-4 overflow-x-auto px-4 pb-6 pt-4 md:mb-0 md:overflow-hidden">
            <SummaryCard
              val={premSum()}
              color="teal"
              gradientColor="green-to-blue-2"
              panel
              shadow
              icon={<AiFillDollarCircle />}
              title={`New Business Premium`}
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
          <div className="flex gap-2 md:items-center justify-end pr-4">
            <div className="flex flex-col">
              <div>
                <PanelTitle title={`New Business Month`} color="pink" />
              </div>
              <SelectInput
                styling={`flex w-full min-w-[150px]`}
                clearable={false}
                value={dataMonth}
                opts={dataMonthOptions}
                labelField={`label`}
                keyField={`id`}
                valueField={`value`}
                placeholder={'New Business Month'}
                filterable={false}
                onChange={(v) => setDataMonth(v)}
              />
            </div>
            <div className="flex flex-col">
              <div>
                <PanelTitle title={`New Business Year`} color="sky" />
              </div>
              <SelectInput
                styling={`flex w-full min-w-[150px]`}
                clearable={false}
                value={dataYear}
                opts={dataYearOptions}
                labelField={`year`}
                keyField={`id`}
                valueField={`id`}
                placeholder={'New Business Year'}
                filterable={false}
                onChange={(v) => setDataYear(v)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-col md:items-center md:justify-evenly lg:flex-row">
            <div className="flex flex-col">
              <div className="pl-4">
                <PanelTitle
                  title={`${toMonthName(dataMonth)} ${dataYear} New Business`}
                  color="indigo"
                />
              </div>
              <div className="flex w-full flex-col md:flex-row">
                <div className="flex h-full flex-row lg:flex-col items-center gap-4 overflow-x-auto p-4 pt-2 pl-2">
                  {chartData?.users.map((p) => (
                    <ChartSummaryCard
                      key={p.id}
                      label={p.name}
                      fullData={p}
                      panel
                      shadow
                      content={getMonthsData(p)}
                      subContent={getMonthComparison(p)}
                      currentMonth={dataMonth}
                      direction={getDirection(p)}
                      money
                      slice
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="pl-4">
                <PanelTitle title={`Year to Date`} color="orange" />
              </div>
              <div className="flex w-full flex-col md:flex-row">
                <div
                  className={`flex h-full flex-row lg:flex-col items-center gap-4 overflow-x-auto p-4 pt-2 pl-2`}
                >
                  {chartData?.users.map((p) => (
                    <ChartSummaryCard
                      key={p.id}
                      label={p.name}
                      fullData={p}
                      panel
                      shadow
                      content={p.totalPrem}
                      subContent={getTotalToLastMonthComparison(p)}
                      currentMonth={dataMonth}
                      direction={getTotalToLastMonthDirection(p)}
                      money
                      slice
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 py-4 pr-4 md:w-full lg:w-9/12">
            {chartData ? (
              <div className="flex w-full flex-col gap-4 md:flex-row">
                <div className="flex w-full md:w-1/2">
                  <NewBusinessCurrentMonthBarChart
                    currentMonth={dataMonth}
                    year={dataYear}
                    fullData={chartData}
                  />
                </div>
                <div className={`flex w-full md:w-1/2`}>
                  <NewBusinessBarChart fullData={chartData} year={dataYear} />
                </div>
              </div>
            ) : null}
            {chartData ? (
              <NewBusinessLineChart
                currentMonth={dataMonth}
                slice
                fullData={chartData}
              />
            ) : null}
          </div>
        </div>
        <div className="px-4 pb-4">
          <div
            className={`h-full w-full rounded-lg ${type}-shadow panel-theme-${type}`}
          >
            {tableData && chartData ? (
              <NewBusinessTable year={dataYear} />
            ) : null}
          </div>
        </div>
      </div>
    </main>
  )
}

ReportsNewBusiness.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}
