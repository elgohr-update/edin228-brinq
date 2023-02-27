import { Progress } from '@nextui-org/react'
import React from 'react'
import { formatMoney, getFormattedDate, getIcon } from '../../utils/utils'
import TaskCompletion from '../task/TaskCompletion'
import TagBasic from '../ui/tag/TagBasic'

function PolicyTableRow({ pol }) {
  const tasks_completed = pol.tasks.filter((x) => x.active && x.done).length
  const tasks_total = pol.tasks.filter((x) => x.active).length
  const percentage = Math.round((tasks_completed / tasks_total) * 100)
  return (
    <div className="flex w-full flex-col pl-2">
      <div className="flex w-full items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          {/* {pol.renewed ? (
            <div className="text-emerald-500">{getIcon('circleCheck')}</div>
          ) : (
            <div className="data-point-md purple-to-green-gradient-1"></div>
          )} */}
          <div>
            <TagBasic
              tooltip
              tooltipContent={pol.policy_type_full}
              text={pol.policy_type}
            />
          </div>
          <div
            className={`${
              pol.renewed ? 'line-through opacity-50' : 'opacity-80 '
            }`}
          >
            {pol.policy_number}
          </div>
        </div>
        {pol.renewed ? (
          <div className="text-emerald-500 font-bold">Renewed</div>
        ) : (
          <div className="flex items-center justify-end space-x-2">
            <div className="flex">
              <div className="flex w-[200px] flex-col px-4">
                <div className="flex w-full justify-between">
                  <div className="text-xs opacity-50">Tasks</div>
                  <div className="flex w-full justify-end text-xs tracking-widest">
                    {Number(percentage) ? percentage : 0}%
                  </div>
                </div>
                <Progress
                  shadow={true}
                  size="sm"
                  color="gradient"
                  value={percentage}
                />
              </div>
            </div>
            <div className="flex min-w-[125px] items-center justify-end space-x-2">
              <div
                className={`text-teal-500 font-bold ${
                  pol.renewed ? 'line-through opacity-50' : 'opacity-80 '
                }`}
              >{`$ ${formatMoney(pol.premium)}`}</div>
              <div
                className={`${
                  pol.renewed ? 'line-through opacity-50' : 'opacity-80 '
                }`}
              >
                {getFormattedDate(pol.expiration_date)}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex w-full items-center py-2">
        {pol?.tasks?.map((task) => (
          <TaskCompletion task={task} />
        ))}
      </div>
    </div>
  )
}

export default PolicyTableRow
