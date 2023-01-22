import React, { useEffect, useState } from 'react'
import PanelTitle from '../../ui/title/PanelTitle'
import { motion } from 'framer-motion'
import { isMobile, timeout, useNextApi } from '../../../utils/utils'
import { useTheme } from '@nextui-org/react'
import DashboardPolicyCard from './DashboardPolicyCard'

export default function DashboardRecentPolicies({hideTitle = false}) {
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
  const mobile = isMobile()

  return (
    <div
      className={`relative flex h-full flex-auto shrink-0 flex-col rounded-lg`}
    >
      {!mobile && !hideTitle ? (
        <div className="pl-4">
        <PanelTitle title={`Recently Added Policies`} color="pink" />
        </div>
      ) : null}
      <div
        className={`flex h-full flex-col rounded-lg xl:h-[46vh] panel-theme-${type} ${type}-shadow overflow-hidden`}
      >
        <div
          className={`policy-card-container flex flex-col overflow-y-auto overflow-x-hidden rounded-lg py-2`}
        >
          {data?.map((u, i) => (
            <motion.div
              key={u.id}
              className="relative px-2 policy-card"
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
