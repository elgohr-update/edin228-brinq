import React, { useEffect, useState } from 'react'
import { timeout, useNextApi } from '../../utils/utils'
import TagBasic from '../ui/tag/TagBasic'

export default function PolicyTypeStarred({ policies, line }) {
  const [all, setAll] = useState(null)
  const [filteredAll, setFilteredAll] = useState([])
  const [activePolicyTypes, setActivePolicyTypes] = useState([])
  
  useEffect(() => {
    let isCancelled = false;
    const handleChange = async () => {
      await timeout(100);
      if (!isCancelled){
        if (!all){
          getPolicyTypes()
        }
      }
    }
    handleChange()
    return () => {
      isCancelled = true;
    }
  }, [])
  
  const getPolicyTypes = async () => {
    const res = await useNextApi('GET',`/api/policytypes/`)
    setAll(res);
  }

  useEffect(() => {
    const filterPT = () => {
      const filtered =
          line == 'Commercial Lines'
            ? all.filter((x) => x.cl == true && x.starred)
            : line == 'Personal Lines'
            ? all.filter((x) => x.pl == true && x.starred)
            : line == 'Benefits'
            ? all.filter((x) => x.b == true && x.starred)
            : []
      setFilteredAll(filtered)
      const activePT = []
      policies.forEach( x => x.policy_types.forEach( pt => activePT.push(pt)))
      setActivePolicyTypes(activePT)
    }
    if (all){
      filterPT()
    }
  }, [all])

  const isPurchased = (tagId) => {
    return activePolicyTypes.filter( x => x.id === tagId).length > 0 ? 'blue'  : 'def'
  }

  return (
    <div className="flex p-1">
      <div className="space-1 flex w-full flex-wrap">
        {filteredAll.map((pt) => (
          <div key={pt.id} className="m-1">
            <TagBasic text={pt.tag} tooltip tooltipContent={pt.name} color={isPurchased(pt.id)} />
          </div>
        ))}
      </div>
    </div>
  )
}
