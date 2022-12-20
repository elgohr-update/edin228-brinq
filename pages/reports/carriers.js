import { useTheme } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { BsBox } from 'react-icons/bs'
import { AiFillDollarCircle } from 'react-icons/ai'
import { useAppContext, useAppHeaderContext } from '../../context/state'
import AppLayout from '../../layouts/AppLayout'
import { sumFromArrayOfObjects, timeout, useNextApi } from '../../utils/utils'
import SummaryCard from '../../components/ui/card/SummaryCard'
import ReportNavbar from './../../components/ui/navbar/ReportNavbar'
import PageTitle from '../../components/ui/pageheaders/PageTitle'
import { RiBuildingFill } from 'react-icons/ri'
import { DateTime } from 'luxon'
import ParentCompaniesTable from '../../components/table/ParentCompaniesTable'
import PanelTitle from '../../components/ui/title/PanelTitle'
import SelectInput from '../../components/ui/select/SelectInput'
import CompanyChartContainer from '../../components/table/CompanyChartContainer'
import WritingCompaniesTable from '../../components/table/WritingCompaniesTable'

export default function ReportsCarriers() {
  const { type } = useTheme()
  const { state, setState } = useAppContext()
  const { appHeader, setAppHeader } = useAppHeaderContext()
  const [dataYear, setDataYear] = useState(null)
  const [dataYearOptions, setDataYearOptions] = useState(null)
  const [dataSelection, setDataSelection] = useState(2)
  const [dataSelectionOptions, setDataSelectionOptions] = useState([
    { id: 1, label: 'Parent Companies' },
    { id: 2, label: 'Writing Companies' },
  ])

  useEffect(() => {
    setAppHeader({
      ...appHeader,
      titleContent: <PageTitle icon={<RiBuildingFill />} text="Carriers" />,
    })
    let isCancelled = false
    const handleYears = () => {
      const base = DateTime.local()
      const currentYear = base.year
      const years = []
      Array.from(Array(5).keys()).forEach((y) => {
        years.push({ id: currentYear - y, year: String(currentYear - y) })
      })
      years.unshift({ id: currentYear + 1, year: String(currentYear + 1) })
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
    return () => {
      isCancelled = true
    }
  }, [dataYear, dataSelection])

  const fetchData = async () => {
    if (dataYear) {
      const res = await useNextApi(
        'GET',
        `/api/company/table?year=${dataYear}&parent=${
          dataSelection == 1 ? true : false
        }&writing=${dataSelection == 2 ? true : false}`
      )
      setState({
        ...state,
        reports: {
          ...state.reports,
          data: {
            ...state.reports.data,
            carriers: { raw: res, filtered: res, loading: false },
          },
        },
      })
    }
  }

  const tableData = state.reports.data.carriers.filtered

  const allPremSum = () => {
    return sumFromArrayOfObjects(tableData, 'premium')
  }
  const clPremSum = () => {
    return sumFromArrayOfObjects(tableData, 'premium_cl')
  }
  const plPremSum = () => {
    return sumFromArrayOfObjects(tableData, 'premium_pl')
  }
  const bPremSum = () => {
    return sumFromArrayOfObjects(tableData, 'premium_b')
  }
  return (
    <main className="relative flex flex-col w-full">
      <ReportNavbar />
      <div className="flex flex-col flex-auto">
        <div className="flex flex-col flex-auto lg:flex-row">
          <div className="flex items-center flex-auto w-full px-4 py-4 space-x-4 overflow-x-auto md:mb-0 md:overflow-hidden">
            <SummaryCard
              val={allPremSum()}
              color="teal"
              gradientColor="pink-to-blue"
              panel
              shadow
              icon={<AiFillDollarCircle />}
              title="Total Premium"
              money
              vertical={false}
            />
            <SummaryCard
              val={clPremSum()}
              color="teal"
              gradientColor="green-to-blue-2"
              panel
              shadow
              icon={<AiFillDollarCircle />}
              title="Commercial Lines Premium"
              money
              vertical={false}
            />
            <SummaryCard
              val={plPremSum()}
              color="teal"
              gradientColor="pink"
              panel
              shadow
              icon={<AiFillDollarCircle />}
              title="Personal Lines Premium"
              money
              vertical={false}
            />
            <SummaryCard
              val={bPremSum()}
              color="teal"
              gradientColor="green-to-orange"
              panel
              shadow
              icon={<AiFillDollarCircle />}
              title="Benefits Premium"
              money
              vertical={false}
            />
            <SummaryCard
              val={tableData?.length}
              color="fuchsia"
              gradientColor="peach"
              panel
              shadow
              title="Carriers"
              icon={<BsBox />}
              vertical={false}
            />
          </div>
        </div>
        <CompanyChartContainer
          dataYear={dataYear}
          dataSelection={dataSelection}
        />
        <div className="flex flex-col px-4 pb-4">
          <div className="flex flex-col w-full xl:flex-row xl:items-center xl:justify-between">
            <div className="pl-4">
              <PanelTitle title={`Carriers`} color="teal" />
            </div>
            <div className="flex flex-auto p-4 space-x-1 lg:mb-4 lg:items-center lg:justify-end lg:gap-2 lg:space-x-0 lg:p-0 lg:pr-4">
              <div className="flex flex-col">
                <div>
                  <PanelTitle title={`Data Table`} color="purple" />
                </div>
                <SelectInput
                  styling={`flex w-full min-w-[150px]`}
                  clearable={false}
                  value={dataSelection}
                  opts={dataSelectionOptions}
                  labelField={`label`}
                  keyField={`id`}
                  valueField={`id`}
                  placeholder={'Data Table'}
                  filterable={false}
                  onChange={(v) => setDataSelection(v)}
                />
              </div>
              <div className="flex flex-col">
                <div>
                  <PanelTitle title={`Year`} color="pink" />
                </div>
                <SelectInput
                  styling={`flex w-full min-w-[150px]`}
                  clearable={false}
                  value={dataYear}
                  opts={dataYearOptions}
                  labelField={`year`}
                  keyField={`id`}
                  valueField={`id`}
                  placeholder={'Year'}
                  filterable={false}
                  onChange={(v) => setDataYear(v)}
                />
              </div>
            </div>
          </div>

          <div
            className={`h-full w-full rounded-lg panel-theme-${type} ${type}-shadow`}
          >
            {tableData && dataSelection == 1 ? <ParentCompaniesTable /> : null}
            {tableData && dataSelection == 2 ? <WritingCompaniesTable /> : null}
          </div>
        </div>
      </div>
    </main>
  )
}

ReportsCarriers.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}
