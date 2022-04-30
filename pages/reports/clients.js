import { useTheme } from '@nextui-org/react'
import { useEffect } from 'react'
import { BsBox } from 'react-icons/bs'
import { AiFillDollarCircle } from 'react-icons/ai'
import { useAppContext } from '../../context/state'
import AppLayout from '../../layouts/AppLayout'
import { sumFromArrayOfObjects, timeout, useNextApi } from '../../utils/utils'
import SummaryCard from '../../components/ui/card/SummaryCard'
import { RiFolderUserFill } from 'react-icons/ri'
import ClientsTable from '../../components/table/ClientsTable'
import { IoMdListBox } from 'react-icons/io'
import PageTitle from '../../components/ui/pageheaders/PageTitle'
import PageHeader from '../../components/ui/pageheaders/PageHeader'
import ReportNavbar from '../../components/ui/navbar/ReportNavbar'

export default function ReportsClient() {
  const { type } = useTheme()
  const { state, setState } = useAppContext()

  useEffect(() => {
    let isCancelled = false;
    const handleChange = async () => {
      await timeout(100);
      if (!isCancelled){
        if (state.reports.data.clients.raw.length < 1){
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
      `/api/clients/list/all`
    )
    setState({
      ...state,
      reports: {
        ...state.reports,
        data: { ...state.reports.data, clients: { raw: res, filtered: res, loading:false } },
      },
    })
  }

  const tableData = state.reports.data.clients.filtered

  const premSum = () => {
    return sumFromArrayOfObjects(tableData, 'premium')
  }
  const polSum = () => {
    return sumFromArrayOfObjects(tableData, 'policy_count')
  }
  return (
    <main className="flex w-full flex-col">
      <PageHeader>
        <PageTitle icon={<IoMdListBox />} text="Clients" />
        <div>
          <ReportNavbar />
        </div>
      </PageHeader>
      <div className="flex w-full flex-col">
        <div className="px-4 mb-2 flex h-full items-center space-x-4 overflow-x-auto py-4 md:mb-0 md:justify-center md:overflow-hidden">
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
        </div>
        <div className="px-4">
          <div
            className={`h-full w-full  rounded-lg ${type}-shadow panel-theme-${type}`}
          >
            {tableData ? <ClientsTable /> : null}
          </div>
        </div>
      </div>
    </main>
  )
}

ReportsClient.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}
