import { Input } from '@nextui-org/react'
import React, { useEffect, useState, useTransition } from 'react'
import ActivityCard from '../activity/ActivityCard'
import Panel from '../ui/panel/Panel'
import { FaSearch } from 'react-icons/fa'
import { getSearch, useNextApi } from '../../utils/utils'

const ClientActivity = ({
  flat = true,
  noBg = true,
  shadow = false,
  overflow = false,
  editable = false,
  clientId,
  limit = 8
}) => {
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState(null)
  const [raw, setRaw] = useState(null)

  useEffect(() => {
    const fetchActivity = async () => {
      const res = await useNextApi(
        'GET',
        `${limit? `/api/clients/${clientId}/activity?limit=${limit}` : `/api/clients/${clientId}/activity`}`
      )
      setData(res)
      setRaw(res)
    }
    if (!raw) {
      fetchActivity()
    }
  }, [])

  const searchActivity = (val) => {
    startTransition(() => {
      if (val.length > 1) {
        const filtered = getSearch(raw, val)
        setData(filtered)
      } else {
        setData(raw)
      }
    })
  }

  return (
    <Panel flat={flat} noBg={noBg} shadow={shadow} overflow={overflow}>
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
      <div className={`flex h-full w-full flex-col rounded`}>
        {data?.map((u) => (
          <ActivityCard key={u.id} activity={u} hideClient />
        ))}
      </div>
    </Panel>
  )
}

export default ClientActivity
