import { useTheme } from '@nextui-org/react'
import React, { useState } from 'react'
import { getConstantIcons } from '../../../utils/utils'
import TaskCard from '../TaskCard'

export default function TaskClientGroup({ group }) {
  const { type } = useTheme()
  const [open, setOpen] = useState(false)
  const getLine = (line) => {
    return line == 'Commercial Lines'
      ? 'soft-blue-to-soft-purple-gradient-1'
      : line == 'Personal Lines'
      ? 'pink-to-blue-gradient-1'
      : 'green-gradient-1'
  }
  return (
    <div className="relative flex w-full flex-col">
      <div
        className={`relative mb-1 flex w-full cursor-pointer rounded-lg px-2 py-1 transition duration-100 ease-out hover:bg-gray-500/20`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex w-full items-center space-x-1">
            <div className={`data-point-xs ${getLine(group.line)}`}></div>
            <h6>{group.client_name}</h6>
          </div>
          <div className="flex items-center space-x-2">
            <h4 className="flex items-center space-x-1">
              <div>{group.tasks.length}</div>
              <div>Tasks</div>
            </h4>
            <div>{getConstantIcons(open ? 'down' : 'left')}</div>
          </div>
        </div>
      </div>
      {open ? (
        <div className="relative flex w-full flex-col space-y-2">
          {group.tasks.map((task) => (
            <div key={task.uid} className="flex w-full">
              <TaskCard task={task} showPolicy />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
