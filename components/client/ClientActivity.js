import { Input } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import ActivityCard from '../activity/ActivityCard'
import Panel from '../ui/panel/Panel'
import { FaSearch } from 'react-icons/fa'
import { getSearch, timeout, useNextApi } from '../../utils/utils'
import { useAppContext } from '../../context/state'

const ClientActivity = ({
  flat = true,
  noBg = true,
  shadow = false,
  overflow = false,
  editable = false,
  clientId,
  limit = 8
}) => {
  const [data, setData] = useState(null)
  const [raw, setRaw] = useState(null)
  const { state, setState } = useAppContext()

  useEffect(() => {
    let isCancelled = false;
    const handleChange = async () => {
      await timeout(100);
      if (!isCancelled){
        if (!raw) {
          fetchActivity()
        }
      }
    }
    handleChange()
    return () => {
      isCancelled = true;
    }
  }, [])

  useEffect( () => {
    if (state.reloadTrigger.activities){
      let isCancelled = false;
      const handleChange = async () => {
        await timeout(100);
        if (!isCancelled){
          fetchActivity()
          setState({
              ...state,reloadTrigger:{...state.reloadTrigger,activities:false}
          })
        }
      }
      handleChange()
      return () => {
        isCancelled = true;
      }  
    }
  },[state.reloadTrigger])

  const fetchActivity = async () => {
    const res = await useNextApi(
      'GET',
      `/api/clients/${clientId}/activity?limit=${limit}`
    )
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
