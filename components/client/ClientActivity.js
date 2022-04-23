import { Input } from '@nextui-org/react'
import React, { useState,useTransition } from 'react'
import ActivityCard from '../activity/ActivityCard'
import Panel from '../ui/panel/Panel'
import { FaSearch } from 'react-icons/fa';
import { getSearch } from '../../utils/utils';

const ClientActivity = ({
  activity,
  flat = true,
  noBg = true,
  shadow = false,
  overflow = false,
  editable = false,
}) => {
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(null)
  const [data, setData] = useState(activity)

  const searchActivity = (val) => {
      startTransition( () => {
          if (val.length > 1){
              const filtered = getSearch(activity,val)
              setData(filtered)
          }else {
              setData(activity)
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
