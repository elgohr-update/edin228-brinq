import { useTheme } from '@nextui-org/react'
import React, { useState } from 'react'
import { getIcon } from '../../../utils/utils'
import TaskCard from '../TaskCard'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ClientTableCell from '../../table/ClientTableCell'

export default function TaskClientGroup({ group }) {
  const { isDark, type } = useTheme()
  const [open, setOpen] = useState(true)
  const getLine = (line) => {
    return line == 'Commercial Lines'
      ? 'soft-blue-to-soft-purple-gradient-1'
      : line == 'Personal Lines'
      ? 'pink-to-blue-gradient-1'
      : 'green-gradient-1'
  }
  return (
    <div className="relative flex flex-col w-full">
      <div
        className={`relative mb-1 flex w-full cursor-pointer rounded-lg px-2 py-1 transition duration-100 ease-out ${
          isDark ? 'hover:bg-zinc-400/10' : 'hover:bg-zinc-400/20'
        }`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center w-full space-x-1">
            <div className={`data-point-xs ${getLine(group.line)}`}></div>
            <h6 className="flex w-full space-x-1">
              <ClientTableCell
                cellValue={group?.client_name}
                clientId={group?.client_id}
                type={type}
              />
            </h6>
          </div>
          <div className="flex items-center space-x-2">
            <h4 className="flex items-center ml-4 space-x-1">
              <div className="flex items-center justify-center">
                {group.tasks.length}
              </div>
              <div className="flex items-center justify-center">
                {getIcon('task')}
              </div>
            </h4>
            <div>{getIcon(open ? 'down' : 'left')}</div>
          </div>
        </div>
      </div>
      {open ? (
        <div className="relative flex flex-col w-full space-y-2">
          {group.tasks.map((task, i) => (
            <motion.div
              key={task.uid}
              className="flex w-full"
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
              transition={{ ease: 'easeInOut', duration: 0.25 }}
            >
              <TaskCard task={task} showPolicy />
            </motion.div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
