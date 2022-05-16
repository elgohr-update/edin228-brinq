import { useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import uuid from 'react-uuid'
import PanelTitle from '../../ui/title/PanelTitle'
import DashboardTeamCard from './DashboardTeamCard'
import { motion } from 'framer-motion'
import { sortByProperty } from '../../../utils/utils'


export default function DashboardTeam({ base = [] }) {
  const [data, setData] = useState([])
  const { type } = useTheme()

  useEffect(() => {
    if (!base) {
      return
    }
    const format = base.map((b) => {
      return { ...b, id: uuid() }
    })
    const sorted = sortByProperty(format,'prem')
    setData(sorted)
  }, [base,setData])

  return (
    <div className="mt-2 lg:mt-0 flex w-full flex-col">
      <div className="pl-4">
        <PanelTitle title={`Team`} color="orange" />
      </div>
      <div
        className={`relative flex w-full min-h-[87px] rounded-lg`}
      >
        <div className="flex flex-wrap w-full space-y-2 lg:space-y-0 overflow-y-auto h-[28vh] lg:gap-2 lg:space-x-0">
          {data?.map((d,i) => (
            <motion.div
              key={d.id}
              initial="hidden"
              animate="visible"
              variants={{
                visible: { opacity: 1, transition: {
                  delay: i * 0.1,
                }, },
                hidden: { opacity: 0 },
              }}
              transition={{ ease: 'easeOut', duration: 1 }}
            >
              <DashboardTeamCard  data={d} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
