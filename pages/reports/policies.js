import { useTheme as useNextTheme } from 'next-themes'
import { Button, useTheme } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { BsFillCalendar3WeekFill,BsBox,BsListCheck } from 'react-icons/bs';
import { AiFillCaretLeft,AiFillCaretRight,AiFillDollarCircle } from 'react-icons/ai';
import { HiOutlineRefresh } from 'react-icons/hi';
import { MdTaskAlt } from 'react-icons/md';
import { useAppContext } from '../../context/state';
import AppLayout from '../../layouts/AppLayout';
import { sumFromArrayOfObjects } from '../../utils/utils';
import SummaryCard from '../../components/ui/card/SummaryCard';
import { RiFolderUserFill,RiBuildingFill } from 'react-icons/ri';
import ClientsTable from '../../components/table/ClientsTable';
import { IoMdListBox } from 'react-icons/io';
import Link from 'next/link';
import PoliciesTable from '../../components/table/PoliciesTable';


export default function ReportsPolicies({data}) {
    const router = useRouter()
    const { month, year } = router.query
    const date = new Date(year, month-1, 1);
    const monthName = date.toLocaleString('default', {month:'long'})
    const { isDark, type } = useTheme();
    // const [tableData, setTableData] = useState(data)
    const {state, setState} = useAppContext();

    useEffect(() => {
        setState({...state,reports:{...state.reports,data:{...state.reports.data,policies:{raw:data,filtered:data}}}})
        // setTableData(data)
    }, [data])

    const tableData = state.reports.data.policies.filtered

    const isActive = (currentPage) => {
        if (router.pathname.includes(currentPage)){
            return 'active-path-small'
        }
        return ''
    }
    const isActiveIcon = (currentPage) => {
        if (router.pathname.includes(currentPage)){
            return 'active-icon'
        }
        return ''
    }

    const premSum = () => {
        return sumFromArrayOfObjects(tableData,'premium')
    }
    const polSum = () => {
        return sumFromArrayOfObjects(tableData,'policy_count')
    }
    const completedTasks = () => {
        let completedTotal = sumFromArrayOfObjects(tableData,'tasks_completed')
        let totalTotal = sumFromArrayOfObjects(tableData,'tasks_total')
        const calc =  Math.round((completedTotal / totalTotal) * 100)
        const result = Number(calc) ? calc : 0
        return result
    }
    const renewedPolSum = () => {
        let total = tableData.reduce( (tot, record) => {
            const filt = record.policies.filter(e => e.renewed === true)
            return tot + filt.length;
        },0);
        return total
    }
    const renewedPolPercent = () => {
        const calc =  Math.round((renewedPolSum() / polSum()) * 100)
        const result = Number(calc) ? calc : 0
        return result
    }

    return (
        <main className="flex flex-col w-full md:px-4">      
          <div className="flex w-full pb-2 items-center">
            <span className="mr-2 text-color-warning"><BsBox /></span>
            <h1 className="mr-8">
              <span className="mx-2 text-color-primary font-bold">/</span>
              <span className="font-bold">Policies</span>
            </h1>
            <div className="flex items-center space-x-2 px-2">
                <Link href="/reports/clients">
                    <a>
                        <div className={`flex hover:text-sky-500 transition duration-100 ease-out items-center px-2 ${isActive(`/clients`)}`}>
                            <div className={`mr-2 ${isActiveIcon(`/clients`)}`}><RiFolderUserFill /></div>
                            <div className={`mr-2 ${isActiveIcon(`/clients`)}`}>Clients</div>
                        </div>
                    </a>
                </Link>
                <Link href="/reports/policies">
                    <a>
                        <div className={`flex hover:text-sky-500 transition duration-100 ease-out items-center px-2 ${isActive(`/policies`)}`}>
                            <div className={`mr-2 ${isActiveIcon(`/policies`)}`}><BsBox /></div>
                            <div className={`mr-2 ${isActiveIcon(`/policies`)}`}>Policies</div>
                        </div>
                    </a>
                </Link>
                <Link href="/reports/carriers">
                    <a>
                        <div className={`flex hover:text-sky-500 transition duration-100 ease-out items-center px-2 ${isActive(`/carriers`)}`}>
                            <div className={`mr-2 ${isActiveIcon(`/carriers`)}`}><RiBuildingFill /></div>
                            <div className={`mr-2 ${isActiveIcon(`/carriers`)}`}>Carriers</div>
                        </div>
                    </a>
                </Link>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex mb-2 md:mb-0 md:justify-center items-center h-full pb-4 space-x-4 md:overflow-hidden overflow-x-auto">
              <SummaryCard val={premSum()} color="teal" gradientColor="green-to-blue-2"  panel shadow icon={<AiFillDollarCircle />} title="Premium" money   />
              <SummaryCard val={tableData?.length} color="fuchsia" gradientColor="pink-to-blue"  panel shadow title="Policies" icon={<BsBox />}  />
              {/* <SummaryCard val={polSum()} color="fuchsia" gradientColor="orange-to-red-2"  panel shadow title="Policies" icon={<BsBox />}  /> */}
            </div>
            <div className={`w-full h-full  rounded-lg ${type}-shadow panel-theme-${type} overflow-auto max-h-[75vh]`}>
              {data ? <PoliciesTable /> : null}
            </div>
          </div>
        </main>
    )
}

ReportsPolicies.getLayout = function getLayout(page) {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    const baseUrl = `${process.env.FETCHBASE_URL}/policy/list/all`
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