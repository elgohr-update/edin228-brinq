import React, { useEffect, useState } from 'react'
import PanelTitle from '../../ui/title/PanelTitle'
import { motion } from 'framer-motion'
import { timeout, useNextApi } from '../../../utils/utils'
import { useTheme } from '@nextui-org/react'
import DashboardPolicyCard from './DashboardPolicyCard'

export default function DashboardRecentPolicies() {
  const [data, setData] = useState([])
  const { type } = useTheme()

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled) {
        fetchData()
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [])

  const fetchData = async () => {
    const res = await useNextApi('GET', `/api/policy/recent`)
    setData(res)
  }

  return (
    <div className={`mt-2 flex flex-auto shrink-0 w-full flex-col rounded-lg `}>
      <div className="pl-4">
        <PanelTitle title={`Recently Added Policies`} color="pink" />
      </div>
      <div className={`flex flex-col rounded-lg px-2 lg:px-0 panel-theme-${type} ${type}-shadow`}>
        <div
          className={`policy-card-container flex max-h-[40vh] w-full flex-col overflow-x-hidden overflow-y-auto rounded lg:max-h-[41vh]`}
        >
          {data?.map((u, i) => (
            <motion.div
              key={u.id}
              className="policy-card relative px-2"
              custom={i}
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  opacity: 1,
                  transition: {
                    delay: i * 0.05,
                  },
                  y: 0,
                },
                hidden: { opacity: 0, y: -10 },
              }}
              transition={{ ease: 'easeInOut', duration: 0.25 }}
            >
              <DashboardPolicyCard policy={u} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
