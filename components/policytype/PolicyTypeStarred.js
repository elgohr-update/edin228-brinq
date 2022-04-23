import React, { useEffect, useState } from 'react'
import TagBasic from '../ui/tag/TagBasic'

export default function PolicyTypeHeatmap({ all, policies, line }) {
  const [filteredAll, setFilteredAll] = useState([])
  const [activePolicyTypes, setActivePolicyTypes] = useState([])

  useEffect(() => {
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
  }, [])

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
