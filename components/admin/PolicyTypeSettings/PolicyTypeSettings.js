import { Loading } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import PolicyTypeTag from '../../policytype/PolicyTypeTag'
import PanelTitle from '../../ui/title/PanelTitle'

export default function PolicyTypeSettings() {
  const [loading, setLoading] = useState(true)
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
        setLoading(false)
      })
  }

  const filtered = (data, line) => {
    const final =
      line == 'Commercial Lines'
        ? data
            .filter((x) => x.cl == true)
            .sort(function (x, y) {
              return x.starred === y.starred ? 0 : x.starred ? -1 : 1
            })
        : line == 'Personal Lines'
        ? data
            .filter((x) => x.pl == true)
            .sort(function (x, y) {
              return x.starred === y.starred ? 0 : x.starred ? -1 : 1
            })
        : line == 'Benefits'
        ? data
            .filter((x) => x.b == true)
            .sort(function (x, y) {
              return x.starred === y.starred ? 0 : x.starred ? -1 : 1
            })
        : []
    return final
  }

  const isStarred = (isStarred) => {
    return policyTypes.filter((x) => x.starred === isStarred).length > 0
      ? true
      : false
  }

  const setStarred = async (ptid) => {
    const info = await fetch(`/api/policytypes/${ptid}?toggleStarred=true`, {
      method: 'PUT',
    }).then(() => fetchData())
  }

  const submitChanges = async (ptid, bundle) => {
    const info = await fetch(`/api/policytypes/${ptid}`, {
      method: 'PUT',
      body: JSON.stringify(bundle),
    }).then(() => fetchData())
  }

  return (
    <div className="flex w-full flex-col">
      <div className="h-full w-full py-2">
        <PanelTitle
          title={`Preferred Policies and Policy Types`}
          color="indigo"
        />
      </div>
      <div className="flex flex-col px-4">
        <PanelTitle title={`Commercial Lines`} color="sky" />
        <div className="space-1 flex w-full flex-wrap py-1">
          {loading ? (
            <div className="flex w-full items-center justify-center">
              <Loading size="md" color="primary" textColor="primary" />
            </div>
          ) : (
            clPolicyTypes.map((pt) => (
              <PolicyTypeTag
                key={pt.id}
                pt={pt}
                onClick={(ptid, bundle) =>
                  bundle ? submitChanges(ptid, bundle) : setStarred(ptid)
                }
                isStarred={isStarred(pt.starred)}
              />
            ))
          )}
        </div>
        <PanelTitle title={`Personal Lines`} color="red" />
        <div className="space-1 flex w-full flex-wrap py-1">
          {loading ? (
            <div className="flex w-full items-center justify-center">
              <Loading size="md" color="primary" textColor="primary" />
            </div>
          ) : (
            plPolicyTypes.map((pt) => (
              <PolicyTypeTag
                key={pt.id}
                pt={pt}
                onClick={(ptid, bundle) =>
                  bundle ? submitChanges(ptid, bundle) : setStarred(ptid)
                }
                isStarred={isStarred(pt.starred)}
              />
            ))
          )}
        </div>
        <PanelTitle title={`Benefits`} color="lime" />
        <div className="space-1 flex w-full flex-wrap py-1">
          {loading ? (
            <div className="flex w-full items-center justify-center">
              <Loading size="md" color="primary" textColor="primary" />
            </div>
          ) : (
            bPolicyTypes.map((pt) => (
              <PolicyTypeTag
                key={pt.id}
                pt={pt}
                onClick={(ptid, bundle) =>
                  bundle ? submitChanges(ptid, bundle) : setStarred(ptid)
                }
                isStarred={isStarred(pt.starred)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
