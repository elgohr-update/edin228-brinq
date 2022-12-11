import React, { useEffect, useState } from 'react'
import PanelTitle from '../../ui/title/PanelTitle'
import { motion } from 'framer-motion'
import { isMobile, timeout, useNextApi } from '../../../utils/utils'
import { useTheme } from '@nextui-org/react'
import DashboardExpiringCard from './DashboardExpiringCard'

export default function DashboardExpiringPolicies() {
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
    const res = await useNextApi('GET', `/api/policy/expiring`)
    setData(res)
  }
  const mobile = isMobile()

  return (
    <div
      className={`relative flex h-full flex-auto shrink-0 flex-col rounded-lg`}
    >
      <div className="pl-4">
        {!mobile ? <PanelTitle title={`Expiring Soon`} color="orange" /> : null}
      </div>
      <div
        className={`flex h-full flex-col rounded-lg lg:max-h-[16vh] panel-theme-${type} ${type}-shadow overflow-y-auto`}
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
              <DashboardExpiringCard policy={u} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
