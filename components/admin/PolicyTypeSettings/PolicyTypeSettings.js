import React, { useEffect, useState } from 'react'
import TagBasic from '../../ui/tag/TagBasic'
import PanelTitle from '../../ui/title/PanelTitle'

export default function PolicyTypeSettings() {
  const [policyTypes, setPolicyTypes] = useState([])
  const [clPolicyTypes, setClPolicyTypes] = useState([])
  const [plPolicyTypes, setPlPolicyTypes] = useState([])
  const [bPolicyTypes, setBPolicyTypes] = useState([])
  

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const clientInfo = await fetch(`/api/policytypes/`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setPolicyTypes(data)
        setClPolicyTypes(filtered(data, `Commercial Lines`))
        setPlPolicyTypes(filtered(data, `Personal Lines`))
        setBPolicyTypes(filtered(data, `Benefits`))
      })
  }

  const filtered = (data,line) => {
    const final =
      line == 'Commercial Lines'
        ? data.filter((x) => x.cl == true).sort(function(x, y) {
              return (x.starred === y.starred)? 0 : x.starred? -1 : 1;
          })
        : line == 'Personal Lines'
        ? data.filter((x) => x.pl == true).sort(function(x, y) {
              return (x.starred === y.starred)? 0 : x.starred? -1 : 1;
          })
        : line == 'Benefits'
        ? data.filter((x) => x.b == true).sort(function(x, y) {
            return (x.starred === y.starred)? 0 : x.starred? -1 : 1;
        })
        : []
    return final
  }

  const isStarred = (isStarred) => {
    return policyTypes.filter( x => x.starred === isStarred).length > 0 ? true : false
  }

  const getTagColor = (tag) => {
      return tag.starred ? 'blue' :  'def'
  }

  const setStarred = async (ptid) => {
    const info = await fetch(`/api/policytypes/${ptid}?toggleStarred=true`, {
      method: 'PUT',
    })
      .then(() => fetchData())
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex flex-col md:w-4/12">
        <div className="h-full w-full py-4">
          <h6>Prefered Policies</h6>
        </div>
        <div className="flex flex-col">
          <PanelTitle title={`Commercial Lines`} color="sky" />
          <div className="space-1 flex w-full flex-wrap py-1">
            {clPolicyTypes.map((pt) => (
              <div key={pt.id} className="m-1" onClick={() => setStarred(pt.id) }>
                <TagBasic text={pt.tag} tooltip tooltipContent={pt.name} color={isStarred(pt.starred) ? getTagColor(pt) : `def`} />
              </div>
            ))}
          </div>
          <PanelTitle title={`Personal Lines`} color="red" />
          <div className="space-1 flex w-full flex-wrap py-1">
            {plPolicyTypes.map((pt) => (
              <div key={pt.id} className="m-1" onClick={() => setStarred(pt.id) }>
                <TagBasic text={pt.tag} tooltip tooltipContent={pt.name} color={isStarred(pt.starred) ? getTagColor(pt) : `def`} />
              </div>
            ))}
          </div>
          <PanelTitle title={`Benefits`} color="lime" />
          <div className="space-1 flex w-full flex-wrap py-1">
            {bPolicyTypes.map((pt) => (
              <div key={pt.id} className="m-1" onClick={() => setStarred(pt.id) }>
                <TagBasic text={pt.tag} tooltip tooltipContent={pt.name} color={isStarred(pt.starred) ? getTagColor(pt) : `def`} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        asdasdasdasdas
      </div>
    </div>
  )
}
