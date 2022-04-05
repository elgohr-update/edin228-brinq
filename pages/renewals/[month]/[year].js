import { useTheme as useNextTheme } from 'next-themes'
import { Button, useTheme } from '@nextui-org/react'
import { useRouter } from 'next/router'
import AppLayout from '../../../layouts/AppLayout'
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { BsFillCalendar3WeekFill,BsBox,BsListCheck } from 'react-icons/bs';
import { AiFillCaretLeft,AiFillCaretRight,AiFillDollarCircle } from 'react-icons/ai';
import { HiOutlineRefresh } from 'react-icons/hi';
import { MdTaskAlt } from 'react-icons/md';
import RenewalsTable from '../../../components/table/RenewalsTable';
import { sumFromArrayOfObjects } from '../../../utils/utils';
import SummaryCard from '../../../components/ui/card/SummaryCard';
import { RiFolderUserFill } from 'react-icons/ri';


export default function Renewals({data}) {
    const router = useRouter()
    const { month, year } = router.query
    const date = new Date(year, month-1, 1);
    const monthName = date.toLocaleString('default', {month:'long'})
    const { isDark, type } = useTheme();
    const [tableData, setTableData] = useState(data)

    useEffect(() => {
      setTableData(data)
    }, [data])
    

    const goToMonth = (dir) => {
      const currentMonth = Number(month)
      const currentYear = Number(year)
      if (dir === 'next'){
        const nextMonth = currentMonth + 1 != 13 ? currentMonth+1 : 1
        const nextYear = currentMonth + 1 != 13 ? currentYear : currentYear+1
        router.replace(`/renewals/${nextMonth}/${nextYear}`)
        
      }
      else{
        const nextMonth = currentMonth - 1 != 0 ? currentMonth-1 : 12
        const nextYear = currentMonth - 1 != 0 ? currentYear : currentYear-1
        router.replace(`/renewals/${nextMonth}/${nextYear}`)
      }      
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
        let total = tableData?.reduce( (tot, record) => {
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
        <main className="flex flex-col w-full">      
          <div className="flex w-full px-4 pb-2 items-center text-xs md:text-lg">
            <span className="mr-2 text-color-warning"><BsFillCalendar3WeekFill /></span>
            <h1>
              <span>{monthName}</span>
              <span className="mx-2 text-color-primary font-bold">/</span>
              <span className="font-bold">{year}</span>
              <span className="ml-2">Renewals</span>
            </h1>
            <Button.Group color="primary" auto size="sm" flat>
              <Button onClick={() => goToMonth('prev')} icon={<AiFillCaretLeft fill="currentColor" />} />
              <Button onClick={() => goToMonth('next')} icon={<AiFillCaretRight fill="currentColor" />} />
            </Button.Group>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex md:justify-center items-center h-full px-4 mb-2 py-4 space-x-4 md:overflow-hidden overflow-x-auto">
              <SummaryCard val={premSum()} color="teal" gradientColor="green-to-blue-2"  panel shadow icon={<AiFillDollarCircle />} title="Premium" money   />
              <SummaryCard val={tableData?.length} color="fuchsia" gradientColor="pink-to-blue"  panel shadow title="Clients" icon={<RiFolderUserFill />}  />
              <SummaryCard val={renewedPolPercent()} color="purple" gradientColor="purple-to-blue-gradient-2"  panel shadow title="Renewed" icon={<HiOutlineRefresh />} percent  />
              <SummaryCard val={renewedPolSum()} color="orange" gradientColor="pink-to-orange"  panel shadow title="Renewed Policies" icon={<MdTaskAlt />}  />
              <SummaryCard val={polSum()} color="fuchsia" gradientColor="orange-to-red-2"  panel shadow title="Policies" icon={<BsBox />}  />
              <SummaryCard val={completedTasks()} color="sky" gradientColor="green"  panel shadow title="Completed Tasks" icon={<BsListCheck />}  />
            </div>
            <div className="px-4">
              <div className={`w-full h-full pb-4 rounded-lg ${type}-shadow panel-theme-${type} overflow-auto max-h-[75vh]`}>
                {data ? <RenewalsTable data={tableData} /> : null}
              </div>
            </div>
          </div>
        </main>
    )
}

Renewals.getLayout = function getLayout(page) {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export async function getServerSideProps(context) {
  const {year, month} = context.params
  const session = await getSession(context)
  if(session){
    const baseUrl = `${process.env.FETCHBASE_URL}/renewals/${year}/${month}`
    const res = await fetch(baseUrl, {
        method: 'GET',
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.accessToken}`
        }
    })
    const data = await res.json()
    
    return {props: { data }}
  }
  return {props: { data:null }}
}