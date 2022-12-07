import React, { useEffect, useState } from 'react'
import { useReloadContext } from '../../../context/state'
import { getSearch, timeout, useNextApi } from '../../../utils/utils'
import ActivityCard from '../../activity/ActivityCard'
import { FaSearch } from 'react-icons/fa'
import { Input, useTheme } from '@nextui-org/react'
import PanelTitle from '../../ui/title/PanelTitle'
import { motion } from 'framer-motion'

export default function DashboardActivity() {
  const [data, setData] = useState(null)
  const [raw, setRaw] = useState(null)
  const { reload, setReload } = useReloadContext()
  const { type } = useTheme()

  useEffect(() => {
    if (reload.activities) {
      let isCancelled = false
      const handleChange = async () => {
        await timeout(100)
        if (!isCancelled) {
          fetchActivity()
          setReload({
            ...reload,
            activities: false,
          })
        }
      }
      handleChange()
      return () => {
        isCancelled = true
      }
    }
  }, [reload])

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled) {
        fetchActivity()
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [])

  const fetchActivity = async () => {
    const res = await useNextApi('GET', `/api/activity/recent`)
    setData(res)
    setRaw(res)
  }

  const searchActivity = (val) => {
    if (val.length > 1) {
      const filtered = getSearch(raw, val)
      setData(filtered)
    } else {
      setData(raw)
    }
  }

  return (
    <div className={`flex flex-auto shrink-0 h-full rounded-lg w-full flex-col relative`}>
      <div className="pl-4">
        <PanelTitle title={`Recent Activity`} color="indigo" />
      </div>
      <div className={`flex flex-col overflow-hidden relative rounded-lg lg:px-0 panel-theme-${type} ${type}-shadow`}>
        {data?.length > 0 ? (
          <div className="relative w-full">
            <Input
              className={`z-10`}
              type="search"
              aria-label="Activity Search Bar"
              size="sm"
              fullWidth
              underlined
              placeholder="Search"
              labelLeft={<FaSearch />}
              onChange={(e) => searchActivity(e.target.value)}
            />
            <div className="z-30 flex w-full search-border-flair pink-to-blue-gradient-1"/>
          </div>
        ) : null}
        <div
          className={`activity-card-container flex h-full w-full flex-col overflow-y-auto relative max-h-[40vh] lg:max-h-[59.4vh] rounded`}
        >
          {data?.map((u, i) => (
            <motion.div
              key={u.id}
              className="relative"
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
              <ActivityCard activity={u} indexLast={i+1 == data?.length} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
