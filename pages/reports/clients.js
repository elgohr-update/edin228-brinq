import { useTheme } from '@nextui-org/react'
import { getSession } from 'next-auth/react'
import { useEffect } from 'react'
import { BsBox } from 'react-icons/bs'
import { AiFillDollarCircle } from 'react-icons/ai'
import { useAppContext } from '../../context/state'
import AppLayout from '../../layouts/AppLayout'
import { sumFromArrayOfObjects } from '../../utils/utils'
import SummaryCard from '../../components/ui/card/SummaryCard'
import { RiFolderUserFill } from 'react-icons/ri'
import ClientsTable from '../../components/table/ClientsTable'
import { IoMdListBox } from 'react-icons/io'
import ReportNavbar from '../../components/ui/navbar/ReportNavbar'
import ReportHeader from '../../components/ui/pageheaders/ReportHeader'

export default function ReportsClient({ data }) {
  const { type } = useTheme()
  const { state, setState } = useAppContext()

  useEffect(() => {
    setState({
      ...state,
      reports: {
        ...state.reports,
        data: { ...state.reports.data, clients: { raw: data, filtered: data } },
      },
    })
  }, [data])

  const tableData = state.reports.data.clients.filtered

  const premSum = () => {
    return sumFromArrayOfObjects(tableData, 'premium')
  }
  const polSum = () => {
    return sumFromArrayOfObjects(tableData, 'policy_count')
  }
  return (
    <main className="flex w-full flex-col">
      <div className="flex w-full flex-col py-2 md:flex-row md:items-center md:justify-between px-4">
        <ReportHeader icon={<IoMdListBox />} text="Clients" />
        <ReportNavbar />
      </div>
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
            className={`h-full w-full  rounded-lg ${type}-shadow panel-theme-${type} max-h-[75vh] overflow-auto`}
          >
            {data ? <ClientsTable /> : null}
          </div>
        </div>
      </div>
    </main>
  )
}

ReportsClient.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const baseUrl = `${process.env.FETCHBASE_URL}/clients/list/all`
  if (session) {
    const res = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken}`,
      },
    })
    const data = await res.json()

    return { props: { data } }
  }
  return { props: { data: null } }
}
