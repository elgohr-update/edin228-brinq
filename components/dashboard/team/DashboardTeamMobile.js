import { useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import uuid from 'react-uuid'
import PanelTitle from '../../ui/title/PanelTitle'
import DashboardTeamCard from './DashboardTeamCard'
import { motion } from 'framer-motion'
import { sortByProperty } from '../../../utils/utils'

export default function DashboardTeamMobile({ base = [] }) {
  const [data, setData] = useState([])
  const { type } = useTheme()

  useEffect(() => {
    if (base.length > 1) {
      const format = base.map((b) => {
        return { ...b, id: uuid() }
      })
      const sorted = sortByProperty(format, 'prem')
      setData(sorted)
    }
  }, [base])

  return (
    <div className="flex w-full flex-col">
      {data?.map((d, i) => (
        <motion.div
          key={d.id}
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              opacity: 1,
              transition: {
                delay: i * 0.1,
              },
            },
            hidden: { opacity: 0 },
          }}
          transition={{ ease: 'easeOut', duration: 1 }}
          className="flex h-[90px] flex-auto shrink-0"
        >
          <DashboardTeamCard data={d} />
        </motion.div>
      ))}
    </div>
  )
}
