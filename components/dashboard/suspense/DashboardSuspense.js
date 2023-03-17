import React, { useEffect, useState } from 'react'
import { useReloadContext } from '../../../context/state'
import {
  getSearch,
  isMobile,
  timeout,
  useNextApi,
  getIcon,
} from '../../../utils/utils'
import { FaSearch } from 'react-icons/fa'
import { Input, useTheme, Button, Tooltip } from '@nextui-org/react'
import PanelTitle from '../../ui/title/PanelTitle'
import { motion } from 'framer-motion'
import SuspenseCard from '../../suspense/SuspenseCard'
import NewActivityModal from '../../activity/NewActivityModal'

export default function DashboardSuspense({ hideTitle = false }) {
  const [data, setData] = useState([])
  const [raw, setRaw] = useState([])
  const { reload, setReload } = useReloadContext()
  const { type } = useTheme()
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [suspenseOnly, setSuspenseOnly] = useState(false)

  const openNewActivity = (isSuspense = false) => {
    setShowActivityModal(true)
    setSuspenseOnly(isSuspense)
  }

  const closeActivityModal = () => {
    setShowActivityModal(false)
    setSuspenseOnly(false)
  }

  useEffect(() => {
    if (reload.suspense) {
      let isCancelled = false
      const handleChange = async () => {
        await timeout(100)
        if (!isCancelled) {
          fetchData()
          setReload({
            ...reload,
            suspense: false,
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
        fetchData()
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [])

  const fetchData = async () => {
    const res = await useNextApi('GET', `/api/suspense/recent`)
    if (res) {
      setData(res)
      setRaw(res)
    }
  }

  const searchData = (val) => {
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
          <PanelTitle title={`Upcoming Suspenses`} color="yellow" />
        </div>
      ) : null}

      <div
        className={`relative flex flex-col overflow-hidden rounded-lg xl:px-0 panel-theme-${type} ${type}-shadow`}
      >
        <div className="relative flex items-center w-full">
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
              onChange={(e) => searchData(e.target.value)}
            />
            <div className="z-30 flex w-full search-border-flair pink-to-blue-gradient-1" />
          </div>
          <div className="flex px-2">
            <Tooltip content={'Create Suspense'}>
              <Button
                size="xs"
                auto
                flat
                className="w-full"
                onClick={() => openNewActivity(true)}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex mx-2">{getIcon('plus')}</div>
                </div>
              </Button>
            </Tooltip>
          </div>
        </div>
        <div
          className={`activity-card-container relative flex h-full w-full flex-col overflow-y-auto rounded py-2 px-1 xl:h-[46vh]`}
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
              <SuspenseCard data={u} />
            </motion.div>
          ))}
        </div>
      </div>
      <NewActivityModal
        open={showActivityModal}
        callBack={closeActivityModal}
        createSuspenseOnly={suspenseOnly}
      />
    </div>
  )
}
