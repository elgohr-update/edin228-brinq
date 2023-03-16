import { Avatar, Progress } from '@nextui-org/react'
import React from 'react'
import {
  formatMoney,
  getFormattedDate,
  getIcon,
  sortByProperty,
} from '../../utils/utils'
import TaskCompletion from '../task/TaskCompletion'
import TagBasic from '../ui/tag/TagBasic'
import UserAvatar from '../user/Avatar'
import { motion } from 'framer-motion'

function PolicyTableRow({ pol, currentUser, i = 1 }) {
  const tasks_completed = pol.tasks.filter((x) => x.active && x.done).length
  const tasks_total = pol.tasks.filter((x) => x.active).length
  const percentage = Math.round((tasks_completed / tasks_total) * 100)

  const ordered = sortByProperty(
    pol.users.filter((x) => x.id != currentUser?.id),
    'producer'
  )

  return (
    <motion.div
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
      className="flex flex-col w-full pl-2"
    >
      <div className="flex items-center justify-between w-full text-xs">
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
          <div className={`${pol.renewed ? 'opacity-50' : 'opacity-80 '}`}>
            {pol.policy_number}
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <div className="flex">
            <div className="flex w-[200px] flex-col px-4">
              <div className="flex justify-between w-full">
                <div className="text-xs opacity-50">Tasks</div>
                <div className="flex justify-end w-full text-xs tracking-widest">
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
              className={`font-bold text-teal-500 ${
                pol.renewed ? 'opacity-50' : 'opacity-80 '
              }`}
            >{`$ ${formatMoney(pol.premium)}`}</div>
            {pol.renewed ? (
              <div className="font-bold text-emerald-500">Renewed</div>
            ) : (
              <div
                className={`${
                  pol.renewed ? 'line-through opacity-50' : 'opacity-80 '
                }`}
              >
                {getFormattedDate(pol.expiration_date)}
              </div>
            )}
          </div>
          <div className="flex items-center justify-center px-4">
            <Avatar.Group
              count={pol.users.length > 3 ? pol.users.length : null}
            >
              {ordered.map((u) => (
                <UserAvatar
                  tooltip={true}
                  tooltipPlacement="topEnd"
                  isUser={true}
                  passUser={u}
                  key={u.id}
                  isGrouped={true}
                  squared={false}
                  size={`sm`}
                />
              ))}
            </Avatar.Group>
          </div>
        </div>
      </div>
      <div className="flex items-center w-full py-2">
        {pol?.tasks?.map((task) => (
          <TaskCompletion task={task} />
        ))}
      </div>
    </motion.div>
  )
}

export default PolicyTableRow
