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
    if (base.length > 1){
      const format = base.map((b) => {
        return { ...b, id: uuid() }
      })
      const sorted = sortByProperty(format,'prem')
      setData(sorted)  
    }
    
  }, [base])

  return (
    <div className={`mt-2 lg:mt-0 flex w-full rounded-lg flex-col`}>
      {/* <div className="pl-4">
        <PanelTitle title={`Team`} color="orange" />
      </div> */}
      <div
        className={`relative flex flex-auto shrink-0 min-h-[85px] rounded-lg w-full`}
      >
        <div className="flex w-full justify-start lg:justfy-center space-y-2 lg:max-w-[68vw] lg:space-y-0 overflow-y-auto lg:max-h-[20vh] lg:gap-2 lg:space-x-0 overflow-x-auto">
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
              className="flex flex-auto shrink-0 h-[90px]"
            >
              <DashboardTeamCard  data={d} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
