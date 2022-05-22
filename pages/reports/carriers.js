import { useTheme } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { BsBox } from 'react-icons/bs'
import { AiFillDollarCircle } from 'react-icons/ai'
import { useAppContext, useAppHeaderContext } from '../../context/state'
import AppLayout from '../../layouts/AppLayout'
import { sumFromArrayOfObjects, timeout, useNextApi } from '../../utils/utils'
import SummaryCard from '../../components/ui/card/SummaryCard'
import PoliciesTable from '../../components/table/PoliciesTable'
import ReportNavbar from './../../components/ui/navbar/ReportNavbar'
import PageTitle from '../../components/ui/pageheaders/PageTitle'
import PageHeader from '../../components/ui/pageheaders/PageHeader'
import { RiBuildingFill } from 'react-icons/ri'
import { DateTime } from 'luxon'
import ParentCompaniesTable from '../../components/table/ParentCompaniesTable'
import PanelTitle from '../../components/ui/title/PanelTitle'
import SelectInput from '../../components/ui/select/SelectInput'

export default function ReportsCarriers() {
  const { type } = useTheme()
  const { state, setState } = useAppContext()
  const { appHeader, setAppHeader } = useAppHeaderContext()
  const [dataYear, setDataYear] = useState(null)
  const [dataYearOptions, setDataYearOptions] = useState(null)

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
    return () => {}
  }, [dataYear])

  const fetchData = async () => {
    if (dataYear) {
      const res = await useNextApi('GET', `/api/company/table?year=${dataYear}`)
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
    <main className="relative flex w-full flex-col">
      <ReportNavbar />
      <div className="flex w-full flex-col">
        <div className="mb-2 flex h-full items-center space-x-4 overflow-x-auto px-4 py-4 md:mb-0 md:overflow-hidden">
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
          <div className="mb-4 flex justify-center space-x-2 lg:mb-0 lg:items-center lg:justify-end lg:pr-4">
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
        <div className="px-4">
          <div className={`h-full w-full rounded-lg `}>
            {tableData ? <ParentCompaniesTable /> : null}
          </div>
        </div>
      </div>
    </main>
  )
}

ReportsCarriers.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}
