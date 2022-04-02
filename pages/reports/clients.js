import { useTheme } from '@nextui-org/react'
import { getSession } from 'next-auth/react';
import { useEffect } from 'react';
import { BsBox } from 'react-icons/bs';
import { AiFillDollarCircle } from 'react-icons/ai';
import { useAppContext } from '../../context/state';
import AppLayout from '../../layouts/AppLayout';
import { sumFromArrayOfObjects } from '../../utils/utils';
import SummaryCard from '../../components/ui/card/SummaryCard';
import { RiFolderUserFill } from 'react-icons/ri';
import ClientsTable from '../../components/table/ClientsTable';
import { IoMdListBox } from 'react-icons/io';
import ReportNavbar from '../../components/ui/navbar/ReportNavbar';
import ReportHeader from '../../components/ui/pageheaders/ReportHeader';


export default function ReportsClient({data}) {
    const { type } = useTheme();
    const {state, setState} = useAppContext();

    useEffect(() => {
        setState({...state,reports:{...state.reports,data:{...state.reports.data,clients:{raw:data,filtered:data}}}})
    }, [data])

    const tableData = state.reports.data.clients.filtered

    const premSum = () => {
        return sumFromArrayOfObjects(tableData,'premium')
    }
    const polSum = () => {
        return sumFromArrayOfObjects(tableData,'policy_count')
    }
    return (
        <main className="flex flex-col w-full md:px-4">      
          <div className="flex flex-col md:flex-row w-full py-2 md:items-center">
            <ReportHeader icon={<IoMdListBox />} text="Clients" />
            <ReportNavbar />
          </div>
          <div className="flex flex-col w-full">
            <div className="flex mb-2 md:mb-0 md:justify-center items-center h-full pb-4 space-x-4 md:overflow-hidden overflow-x-auto">
              <SummaryCard val={premSum()} color="teal" gradientColor="green-to-blue-2"  panel shadow icon={<AiFillDollarCircle />} title="Premium" money   />
              <SummaryCard val={tableData?.length} color="fuchsia" gradientColor="pink-to-blue"  panel shadow title="Clients" icon={<RiFolderUserFill />}  />
              <SummaryCard val={polSum()} color="fuchsia" gradientColor="orange-to-red-2"  panel shadow title="Policies" icon={<BsBox />}  />
            </div>
            <div className={`w-full h-full  rounded-lg ${type}-shadow panel-theme-${type} overflow-auto max-h-[75vh]`}>
              {data ? <ClientsTable /> : null}
            </div>
          </div>
        </main>
    )
}

ReportsClient.getLayout = function getLayout(page) {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    const baseUrl = `${process.env.FETCHBASE_URL}/clients/list/all`
    if(session){
        const res = await fetch(baseUrl, {
            method: 'GET',
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.accessToken}`
            }
        })
        const data = await res.json()
      
        return {props: { data }}
    }
    return {props: { data:null }}
}