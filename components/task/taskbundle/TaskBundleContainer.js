import { useTheme } from '@nextui-org/react'
import React, { useState } from 'react'
import { getFormattedDate } from '../../../utils/utils'
import TaskClientGroup from './TaskClientGroup'

export default function TaskBundleContainer({ taskBundle }) {
  const isLate = (due) => {
    const today = new Date()
    const date = new Date(due)
    return today > date ? `text-color-error` : ``
  }
  return (
    <div className={`relative flex w-full flex-col rounded-lg`}>
      <div className="mb-2 flex w-full items-center space-x-2">
        <div className="data-point peach-gradient-1" />
        <h6 className={`${isLate(taskBundle.date)} font-semibold`}>{getFormattedDate(taskBundle.date)}</h6>
      </div>
      <div className="relative flex w-full flex-col space-y-2">
        {taskBundle.clients.map((client) => (
          <TaskClientGroup key={client.uid} group={client} />
        ))}
      </div>
    </div>
  )
}
