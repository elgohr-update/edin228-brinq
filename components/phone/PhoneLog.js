import { Image, Input, useTheme } from '@nextui-org/react'
import React, { useEffect, useRef, useState } from 'react'
import { usePhoneContext } from '../../context/state'
import { getRecentCalls } from '../../utils/ringcentral'
import {
  getFormattedDate,
  getFormattedDateHuge,
  getFormattedDateTime,
  getIcon,
  getSearch,
} from '../../utils/utils'
import { motion } from 'framer-motion'
import CallLogCard from './CallLogCard'

function PhoneLog() {
  const { type } = useTheme()
  const { phoneState, setPhoneState } = usePhoneContext()
  const [recentCalls, setRecentCalls] = useState(null)
  const [recentCallsRaw, setRecentCallsRaw] = useState(null)
  const runOnce = useRef(true)

  useEffect(() => {
    if (runOnce.current && phoneState.tab == 1 && phoneState.auth) {
      fetchRecentCalls()
      runOnce.current = false
    }
    return () => {
      runOnce.current = false
    }
  }, [phoneState.auth])

  const fetchRecentCalls = async () => {
    const data = await getRecentCalls()
    setRecentCalls(data?.records)
    setRecentCallsRaw(data?.records)
  }

  const search = (val) => {
    if (val.length > 1) {
      const filtered = getSearch(recentCallsRaw, val)
      setRecentCalls(filtered)
    } else {
      setRecentCalls(recentCallsRaw)
    }
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div
        className={`relative h-[50px] flex w-full items-center px-2 panel-theme-${type} overflow-hidden`}
      >
        <div className="flex items-center justify-center mr-2 ">
          <Image
            showSkeleton
            maxDelay={10000}
            width={20}
            height={20}
            src={`https://cdn.brinq.io/assets/RingCentral/Icon.png`}
            alt="Default Image"
          />
        </div>
        <div className="flex items-center py-4 text-xs tracking-widest uppercase">
          <span>{getIcon('phone')}</span>
          <span className="mx-2 font-bold text-yellow-500 text-md"> / </span>
          <span>Call Log</span>
        </div>
      </div>
      {recentCallsRaw?.length > 0 ? (
        <div className="relative w-full">
          <Input
            className={`z-10`}
            type="search"
            aria-label="Activity Search Bar"
            size="sm"
            fullWidth
            underlined
            placeholder="Search"
            labelLeft={getIcon('search')}
            onChange={(e) => search(e.target.value)}
          />
          <div className="z-30 flex w-full search-border-flair pink-to-blue-gradient-1" />
        </div>
      ) : null}
      <div className="flex flex-col w-full h-full">
        <div className="flex h-full max-h-[90vh] w-full flex-col space-y-2 overflow-y-auto p-2 xl:max-h-[92vh] xl:pb-[50px]">
          {recentCalls?.map((u, i) => (
            <div key={u.id}>
              {i == 0 ? (
                <div className="relative flex items-center w-full">
                  <div className="pink-to-blue-gradient-1 h-[10px] w-[10px] rounded-full mr-1"></div>
                  <div className="p-1 text-xs font-bold opacity-80">
                    {getFormattedDateHuge(u.startTime)}
                  </div>
                </div>
              ) : getFormattedDateHuge(
                  recentCalls[i != 0 ? i - 1 : 0].startTime
                ) != getFormattedDateHuge(recentCalls[i].startTime) ? (
                <div className="relative flex items-center w-full">
                <div className="pink-to-blue-gradient-1 h-[10px] w-[10px] rounded-full mr-1"></div>
                  <div className="p-1 text-xs font-bold opacity-80">
                    {getFormattedDateHuge(u.startTime)}
                  </div>
                </div>
              ) : null}
              <CallLogCard record={u} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PhoneLog
