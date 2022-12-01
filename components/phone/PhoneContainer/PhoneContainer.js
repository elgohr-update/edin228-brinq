import React, { useState } from 'react'
import DashboardPhone from '../../dashboard/phone/DashboardPhone'
import PhoneToggle from './PhoneToggle'
import { motion } from 'framer-motion'
import { useTheme } from '@nextui-org/react'
import { useActivityDrawerContext } from '../../../context/state'

function PhoneContainer() {
  const { type } = useTheme()
  const [open, setOpen] = useState(false)
  const { activityDrawer, setActivityDrawer } = useActivityDrawerContext()

  const openPhoneToggle = () => {
    if (activityDrawer.callData){
      setActivityDrawer({ ...activityDrawer, callData:null })
    }
    setOpen(!open)
  }

  return (
    <div className={`fixed z-[9999999]  ${type}-shadow`}>
      {open ? (
        <motion.div
          className={`fixed bottom-[0px] h-full flex w-full lg:w-[450px] right-[0px]`}
          initial="hidden"
          animate="visible"
          variants={{
            visible: { opacity: 1, x: 0, y: 0 },
            hidden: { opacity: 0, x: 100, y: 100 },
          }}
          transition={{ ease: 'easeOut', duration: 0.25 }}
        >
          <DashboardPhone />
        </motion.div>
      ) : null}
      <div onClick={openPhoneToggle}>
        <PhoneToggle />
      </div>
    </div>
  )
}

export default PhoneContainer
