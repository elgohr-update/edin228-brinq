import { Input, Switch } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import ActivityCard from '../activity/ActivityCard'
import Panel from '../ui/panel/Panel'
import { FaSearch } from 'react-icons/fa'
import { getSearch, timeout, useNextApi } from '../../utils/utils'
import { useReloadContext } from '../../context/state'
import { useRouter } from 'next/router'
import SuspenseCard from '../suspense/SuspenseCard'
import { motion } from 'framer-motion'

const ClientSuspense = ({
  flat = true,
  noBg = true,
  shadow = false,
  overflow = false,
  editable = false,
  clientId,
  limit = 8,
}) => {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [raw, setRaw] = useState(null)
  const { reload, setReload } = useReloadContext()
  const [showCompleted, setShowCompleted] = useState(false)

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled) {
        fetchSuspenses()
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    if (reload.suspense) {
      let isCancelled = false
      const handleChange = async () => {
        await timeout(100)
        if (!isCancelled) {
          fetchSuspenses()
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

  const fetchSuspenses = async () => {
    const res = await useNextApi('GET', `/api/clients/${clientId}/suspenses`)
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
    <Panel flat={flat} noBg={noBg} shadow={shadow} overflow={overflow}>
      <div className="flex w-full items-center justify-between">
        {data?.length > 0 ? (
          <div className="w-full">
            <Input
              className={`z-10`}
              type="search"
              aria-label="Table Search Bar"
              size="sm"
              fullWidth
              underlined
              placeholder="Search"
              labelLeft={<FaSearch />}
              onChange={(e) => searchActivity(e.target.value)}
            />
          </div>
        ) : null}
        <div>
          <div className="flex justify-end flex-col items-end">
            <h4>Completed</h4>
            <Switch
              checked={showCompleted}
              size="xs"
              onChange={(e) => setShowCompleted(e.target.checked)}
            />
          </div>
        </div>
      </div>
      <div className={`flex h-full w-full flex-col rounded py-1`}>
        {data
          ?.filter((x) => x.completed == showCompleted)
          .map((u, i) => (
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
              <SuspenseCard
                hideClient={true}
                hideAssigned={false}
                data={u}
                indexLast={i + 1 == data?.length}
              />
            </motion.div>
          ))}
      </div>
    </Panel>
  )
}

export default ClientSuspense
