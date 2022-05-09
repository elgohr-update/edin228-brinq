import React, { useEffect, useState } from 'react'
import { useReloadContext } from '../../../context/state'
import { getSearch, timeout, useNextApi } from '../../../utils/utils'
import ActivityCard from '../../activity/ActivityCard'
import { FaSearch } from 'react-icons/fa'
import { Input, useTheme } from '@nextui-org/react'
import PanelTitle from '../../ui/title/PanelTitle'

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
            activities: false
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
    <div className="flex h-full w-full flex-col">
      <div className="pl-4">
        <PanelTitle title={`Recent Activity`} color="indigo" />
      </div>
      <div
        className={`flex flex-col rounded-lg px-2`}
      >
        {data?.length > 0 ? (
          <div className="w-full">
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
          </div>
        ) : null}
        <div className={`flex activity-card-container h-full w-full flex-col rounded max-h-[50vh] overflow-y-auto`}>
          {data?.map((u) => (
            <ActivityCard key={u.id} activity={u} />
          ))}
        </div>
      </div>
    </div>
  )
}
