import { useTheme } from '@nextui-org/react'
import React, { useState } from 'react'
import { getFormattedDate } from '../../../utils/utils'
import TaskClientGroup from './TaskClientGroup'
import { motion } from 'framer-motion'

export default function TaskBundleContainer({ taskBundle }) {
  const isLate = (due) => {
    const today = new Date()
    const date = new Date(due)
    return today > date ? `text-color-error` : ``
  }
  return (
    <div className={`relative flex w-full flex-col rounded-lg`}>
      <div className="flex items-center w-full mb-2 space-x-2">
        <div className="data-point peach-gradient-1" />
        <h6 className={`${isLate(taskBundle?.date)} font-semibold`}>
          {getFormattedDate(taskBundle?.date)}
        </h6>
      </div>
      <div className="relative flex flex-col w-full space-y-2">
        {taskBundle?.clients?.map((client, i) => (
          <motion.div
            key={client.uid}
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
            <TaskClientGroup group={client} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
