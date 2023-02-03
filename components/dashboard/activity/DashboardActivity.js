import React, { useEffect, useState } from 'react'
import { useReloadContext } from '../../../context/state'
import {
  getSearch,
  isMobile,
  timeout,
  useNextApi,
  getIcon,
} from '../../../utils/utils'
import ActivityCard from '../../activity/ActivityCard'
import { FaSearch } from 'react-icons/fa'
import { Input, useTheme, Button, Tooltip } from '@nextui-org/react'
import PanelTitle from '../../ui/title/PanelTitle'
import { motion } from 'framer-motion'
import NewActivityModal from '../../activity/NewActivityModal'

export default function DashboardActivity({ hideTitle = false }) {
  const [data, setData] = useState([])
  const [raw, setRaw] = useState([])
  const { reload, setReload } = useReloadContext()
  const { type } = useTheme()
  const [showActivityModal, setShowActivityModal] = useState(false)

  const openNewActivity = () => {
    setShowActivityModal(true)
  }
  const closeActivityModal = () => {
    setShowActivityModal(false)
  }

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
    if (res) {
      setData(res)
      setRaw(res)
    }
  }

  const searchActivity = (val) => {
    if (val.length > 1) {
      const filtered = getSearch(raw, val)
      setData(filtered)
    } else {
      setData(raw)
    }
  }
  const mobile = isMobile()
  return (
    <div
      className={`relative flex w-full flex-auto shrink-0 flex-col rounded-lg`}
    >
      {!mobile && !hideTitle ? (
        <div className="pl-4">
          <PanelTitle title={`Recent Activity`} color="indigo" />
        </div>
      ) : null}
      <div
        className={`relative flex flex-col overflow-hidden rounded-lg xl:px-0 panel-theme-${type} ${type}-shadow`}
      >
        {data?.length > 0 ? (
          <div className="relative flex w-full items-center">
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
              <div className="search-border-flair pink-to-blue-gradient-1 z-30 flex w-full" />
            </div>
            <div className="flex px-2">
              <Tooltip content={'Create Activity'}>
                <Button size="xs" auto flat className="w-full" onClick={() => openNewActivity()}>
                  <div className="flex items-center space-x-2">
                    <div className="mx-2 flex">{getIcon('plus')}</div>
                  </div>
                </Button>
              </Tooltip>
            </div>
          </div>
        ) : null}
        <div
          className={`activity-card-container relative flex h-full w-full flex-col overflow-y-auto rounded py-2 xl:h-[46vh]`}
        >
          {data?.map((u, i) => (
            <motion.div
              key={u?.id}
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
              <ActivityCard activity={u} indexLast={i + 1 == data?.length} />
            </motion.div>
          ))}
        </div>
      </div>
      <NewActivityModal
        open={showActivityModal}
        callBack={closeActivityModal}
        createSuspenseOnly={false}
      />
    </div>
  )
}
