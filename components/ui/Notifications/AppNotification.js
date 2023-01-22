import { useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import {
  useNotificationContext,
  useNotificationUpdateContext,
} from '../../../context/state'
import { timeout } from '../../../utils/utils'
import { motion } from 'framer-motion'

export default function AppNotification() {
  const { notification } = useNotificationContext()
  const { setNotification } = useNotificationUpdateContext()
  const [show, setShow] = useState(true)
  const [notificationLength, setNotificationLength] = useState(
    notification.length
  )
  const { type } = useTheme()

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(3000)
      if (!isCancelled) {
        if (notification.length > 10) {
          const updated = notification.slice(10).map((item) => {
            item.seen = true
            return item
          })
          setNotification([...updated])
        } else {
          const updated = notification.map((item) => {
            item.seen = true
            return item
          })
          setNotification([...updated])
        }
      }
    }
    if (notification.length != notificationLength) {
      handleChange()
      setNotificationLength(notification.length)
    }
    return () => {
      isCancelled = true
    }
  }, [notification])

  const getBackground = (bg) => {
    switch (bg) {
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
          x: show ? 0 : 500,
        },
        hidden: { opacity: 0, x: 500 },
      }}
      transition={{ ease: 'easeInOut', duration: 0.25 }}
      className={`absolute bottom-5 right-5 z-40 flex min-h-[80px] flex-auto flex-col space-y-1 lg:gap-2 lg:space-y-0`}
    >
      {notification?.map((n) => (
        <motion.div
          key={n.id}
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              opacity: 1,
              x: !n.seen ? 0 : 500,
            },
            hidden: { opacity: 0, x: 500 },
          }}
          transition={{ ease: 'easeInOut', duration: 0.25 }}
          className={`flex flex-auto ${type}-shadow ${getBackground(
            n.background
          )} z-40 min-h-[80px] rounded-lg text-white`}
        >
          <div className="flex items-center justify-between flex-auto p-4">
            <div className="mr-4 text-3xl">{n.icon}</div>
            <div>{n.text}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
