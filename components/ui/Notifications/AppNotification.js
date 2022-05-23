import { useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { useNotificationContext } from '../../../context/state'
import { timeout } from '../../../utils/utils'
import { motion } from 'framer-motion'

export default function AppNotification() {
  const { notification, setNotification } = useNotificationContext()
  const [show, setShow] = useState(false)
  const { type } = useTheme()

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled && notification.text) {
        setShow(true)
        await timeout(3000)
        setShow(false)
        setNotification({
          icon: null,
          text: null,
          position: 'bottom-right',
          color: 'white',
          background: 'blue',
        })
      }
    }
    handleChange()
    return () => {}
  }, [notification])

  const getBackground = () => {
    switch (notification.background) {
      case 'orange':
        return 'orange-gradient-1'
      case 'orange-reverse':
        return 'orange-reverse-gradient-1'
      case 'pink':
        return 'pink-gradient-1'
      case 'green':
        return 'green-gradient-1'
      case 'blue':
        return 'blue-gradient-1'
      case 'peach':
        return 'peach-gradient-1'
      case 'blood-orange':
        return 'blood-orange-gradient-1'
      case 'grand-blue':
        return 'grand-blue-gradient-1'
      case 'celestial':
        return 'celestial-gradient-1'
      case 'purple-to-green':
        return 'purple-to-green-gradient-1'
      case 'pink-to-orange':
        return 'pink-to-orange-gradient-1'
      case 'pink-to-blue':
        return 'pink-to-blue-gradient-1'
      case 'green-to-orange':
        return 'green-to-orange-gradient-1'
      case 'grand-blue-to-orange':
        return 'grand-blue-to-orange-gradient-1'
      case 'green-to-blue-2':
        return 'green-to-blue-gradient-2'
      case 'blue-to-orange-2':
        return 'blue-to-orange-gradient-2'
      case 'orange-to-red-2':
        return 'orange-to-red-gradient-2'
      case 'orange-to-green-gradient-2':
        return 'orange-to-green-gradient-2'
      case 'blue-to-orange-gradient-3':
        return 'blue-to-orange-gradient-3'
      case 'purple-to-blue-gradient-2':
        return 'purple-to-blue-gradient-2'
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          opacity: 1,
          x: show? 0 : 500,
        },
        hidden: { opacity: 0, x: 500 },
      }}
      transition={{ ease: 'easeInOut', duration: 0.25 }}
      className={`flex flex-auto ${type}-shadow ${getBackground()} fixed bottom-5 min-h-[80px] right-5 z-40 flex rounded-lg bg-red-500 text-white`}
    >
      <div className="flex flex-auto items-center justify-between p-4">
        <div className="text-3xl mr-4">{notification.icon}</div>
        <div>{notification.text}</div>
      </div>
    </motion.div>
  )
}
