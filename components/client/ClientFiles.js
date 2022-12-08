import { Input } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { getIcon, getSearch, reverseList, timeout } from '../../utils/utils'
import FileCard from '../files/FileCard'
import Panel from '../ui/panel/Panel'

function ClientFiles({
  flat = true,
  noBg = true,
  shadow = false,
  overflow = false,
  editable = false,
  files = null,
}) {
  const [data, setData] = useState(null)
  const [raw, setRaw] = useState(null)

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled) {
        const reversed = reverseList(files)
        setData(reversed)
        setRaw(reversed)
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [files])

  const searchData = (val) => {
    if (val.length > 1) {
      const filtered = getSearch(raw, val)
      setData(filtered)
    } else {
      setData(raw)
    }
  }
  return (
    <Panel flat={flat} noBg={noBg} shadow={shadow} overflow={overflow}>
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
            labelLeft={getIcon('search')}
            onChange={(e) => searchData(e.target.value)}
          />
        </div>
      ) : null}
      <div className={`flex h-full w-full flex-col rounded py-1`}>
        {data?.map((u, i) => (
          <FileCard key={u.id} data={u} indexLast={i + 1 == data?.length} />
        ))}
      </div>
    </Panel>
  )
}

export default ClientFiles
