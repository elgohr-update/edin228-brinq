import { useTheme } from '@nextui-org/react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useReloadContext } from '../../../context/state'
import { sortByProperty, timeout, useNextApi } from '../../../utils/utils'
import PanelTitle from '../../ui/title/PanelTitle'
import RenewalPath from './RenewalPath'
import RenewalPathCard from './RenewalPathCard'

export default function RenewalTimelines() {
  const { type } = useTheme()
  const [data, setData] = useState(null)
  const { reload, setReload } = useReloadContext()

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled) {
        fetchData()
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    if (reload.paths) {
      let isCancelled = false
      const handleChange = async () => {
        await timeout(100)
        if (!isCancelled) {
          fetchData()
          setReload({
            ...reload,
            paths: false,
          })
        }
      }
      handleChange()
      return () => {
        isCancelled = true
      }
    }
  }, [reload])

  const fetchData = async () => {
    const res = await useNextApi('GET', `/api/paths/`)
    setData(res)
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-full py-2">
        <PanelTitle title={`Policy Renewal Timelines`} color="yellow" />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex flex-col w-full h-full">
          <div className="w-full h-full py-2">
            <PanelTitle title={`Commercial Lines`} color="blue" />
          </div>
          <div className="flex w-full gap-4">
            {data
              ?.filter((x) => x.line == 'Commercial Lines')
              .map((path) => (
                <RenewalPath
                  key={path.id}
                  allPaths={data?.filter((x) => x.line == 'Commercial Lines')}
                  path={path}
                />
              ))}
          </div>
        </div>
        <div className="flex flex-col w-full h-full">
          <div className="w-full h-full py-2">
            <PanelTitle title={`Personal Lines`} color="red" />
          </div>
          <div className="flex w-full gap-4">
            {data
              ?.filter((x) => x.line == 'Personal Lines')
              .map((path) => (
                <RenewalPath
                  key={path.id}
                  allPaths={data?.filter((x) => x.line == 'Personal Lines')}
                  path={path}
                />
              ))}
          </div>
        </div>
        <div className="flex flex-col w-full h-full">
          <div className="w-full h-full py-2">
            <PanelTitle title={`Benefits`} color="lime" />
          </div>
          <div className="flex w-full gap-4">
            {data
              ?.filter((x) => x.line == 'Benefits')
              .map((path) => (
                <RenewalPath
                  key={path.id}
                  allPaths={data?.filter((x) => x.line == 'Benefits')}
                  path={path}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
