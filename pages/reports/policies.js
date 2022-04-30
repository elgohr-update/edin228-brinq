import { useTheme } from '@nextui-org/react'
import { useEffect } from 'react'
import { BsBox } from 'react-icons/bs'
import { AiFillDollarCircle } from 'react-icons/ai'
import { useAppContext } from '../../context/state'
import AppLayout from '../../layouts/AppLayout'
import { sumFromArrayOfObjects, timeout, useNextApi } from '../../utils/utils'
import SummaryCard from '../../components/ui/card/SummaryCard'
import PoliciesTable from '../../components/table/PoliciesTable'
import ReportNavbar from './../../components/ui/navbar/ReportNavbar'
import PageTitle from '../../components/ui/pageheaders/PageTitle'
import PageHeader from '../../components/ui/pageheaders/PageHeader'

export default function ReportsPolicies() {
  const { type } = useTheme()
  const { state, setState } = useAppContext()

  useEffect(() => {
    let isCancelled = false;
    const handleChange = async () => {
      await timeout(100);
      if (!isCancelled){
        if (state.reports.data.policies.raw.length < 1){
          fetchData()  
        }
      }
    }
    handleChange()
    return () => {
      isCancelled = true;
    }
  }, [])

  const fetchData = async () => {
    const res = await useNextApi(
      'GET',
      `/api/policy/list/all`
    )
    setState({
      ...state,
      reports: {
        ...state.reports,
        data: { ...state.reports.data, policies: { raw: res, filtered: res, loading:false } },
      },
    })
  }

  const tableData = state.reports.data.policies.filtered

  const premSum = () => {
    return sumFromArrayOfObjects(tableData, 'premium')
  }
  return (
    <main className="flex w-full flex-col relative">
      <PageHeader>
        <PageTitle icon={<BsBox />} text="Policies" />
        <div>
          <ReportNavbar />
        </div>
      </PageHeader>
      <div className="flex w-full flex-col">
        <div className="mb-2 flex h-full items-center space-x-4 overflow-x-auto px-4 py-4 md:mb-0 md:overflow-hidden">
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
            {tableData ? <PoliciesTable /> : null}
          </div>
        </div>
        
      </div>
    </main>
  )
}

ReportsPolicies.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}