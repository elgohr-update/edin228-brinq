import { Image, useTheme } from '@nextui-org/react'
import React, { useEffect, useRef, useState } from 'react'
import { usePhoneContext } from '../../context/state'
import { getRecentCalls } from '../../utils/ringcentral'
import { getIcon } from '../../utils/utils'
import { motion } from 'framer-motion'
import CallLogCard from './CallLogCard'

function PhoneLog() {
  const { type } = useTheme()
  const { phoneState, setPhoneState } = usePhoneContext()
  const [recentCalls, setRecentCalls] = useState(null)
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
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div
        className={`relative flex w-full items-center px-2 panel-theme-${type} overflow-hidden`}
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
        <div className={`bottom-border-flair pink-to-blue-gradient-1`} />
      </div>
      <div className="flex flex-col w-full h-full">
        <div className="flex h-full w-full flex-col space-y-2 overflow-y-auto p-2 lg:max-h-[70vh]">
          {recentCalls?.map((u, i) => (
            <motion.div
              key={u.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  opacity: 1,
                  transition: {
                    delay: i * 0.05,
                  },
                  y: 0,
                },
                hidden: { opacity: 0, y: -10 },
              }}
              transition={{ ease: 'easeInOut', duration: 0.1 }}
            >
              <CallLogCard record={u} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PhoneLog
